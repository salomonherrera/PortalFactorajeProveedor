using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TekProvider.Factoring.Services;
using TekProvider.Shared.DTOs;
using TekProvider.Shared.Entities;
using TekProvider.Shared.Enums;
using TekProvider.Shared.Interfaces;

namespace TekProvider.Factoring.Services;

public class FactoringService : IFactoringService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public FactoringService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<FactoringRequestDto>> GetFactoringRequestsByUserAsync(int userId)
    {
        var requests = await _unitOfWork.FactoringRequests.FindAsync(fr => fr.UserId == userId);
        var requestDtos = new List<FactoringRequestDto>();

        foreach (var request in requests)
        {
            var requestDto = _mapper.Map<FactoringRequestDto>(request);
            
            // Get associated invoices
            var requestInvoices = await _unitOfWork.FactoringRequestInvoices.FindAsync(fri => fri.FactoringRequestId == request.Id);
            var invoiceIds = requestInvoices.Select(ri => ri.InvoiceId).ToList();
            
            var invoices = new List<InvoiceDto>();
            foreach (var invoiceId in invoiceIds)
            {
                var invoice = await _unitOfWork.Invoices.GetByIdAsync(invoiceId);
                if (invoice != null)
                {
                    invoices.Add(_mapper.Map<InvoiceDto>(invoice));
                }
            }
            
            requestDto.Invoices = invoices;
            requestDtos.Add(requestDto);
        }

        return requestDtos;
    }

    public async Task<FactoringRequestDto?> GetFactoringRequestByIdAsync(int id)
    {
        var request = await _unitOfWork.FactoringRequests.GetByIdAsync(id);
        if (request == null) return null;

        var requestDto = _mapper.Map<FactoringRequestDto>(request);
        
        // Get associated invoices
        var requestInvoices = await _unitOfWork.FactoringRequestInvoices.FindAsync(fri => fri.FactoringRequestId == id);
        var invoiceIds = requestInvoices.Select(ri => ri.InvoiceId).ToList();
        
        var invoices = new List<InvoiceDto>();
        foreach (var invoiceId in invoiceIds)
        {
            var invoice = await _unitOfWork.Invoices.GetByIdAsync(invoiceId);
            if (invoice != null)
            {
                invoices.Add(_mapper.Map<InvoiceDto>(invoice));
            }
        }
        
        requestDto.Invoices = invoices;
        return requestDto;
    }

    public async Task<FactoringRequestDto> CreateFactoringRequestAsync(CreateFactoringRequestDto createFactoringRequestDto)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            // Calculate total amount from invoices
            decimal totalAmount = 0;
            foreach (var invoiceId in createFactoringRequestDto.InvoiceIds)
            {
                var invoice = await _unitOfWork.Invoices.GetByIdAsync(invoiceId);
                if (invoice != null)
                {
                    totalAmount += invoice.Amount;
                }
            }

            // Create factoring request
            var factoringRequest = new FactoringRequest
            {
                RequestNumber = $"REQ-{DateTime.Now.Ticks.ToString().Substring(0, 8)}",
                UserId = createFactoringRequestDto.UserId,
                TotalAmount = totalAmount,
                Status = FactoringStatus.InProcess,
                Notes = createFactoringRequestDto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.FactoringRequests.AddAsync(factoringRequest);
            await _unitOfWork.SaveChangesAsync();

            // Create invoice associations
            foreach (var invoiceId in createFactoringRequestDto.InvoiceIds)
            {
                var requestInvoice = new FactoringRequestInvoice
                {
                    FactoringRequestId = factoringRequest.Id,
                    InvoiceId = invoiceId,
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.FactoringRequestInvoices.AddAsync(requestInvoice);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return await GetFactoringRequestByIdAsync(factoringRequest.Id) ?? _mapper.Map<FactoringRequestDto>(factoringRequest);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<FactoringRequestDto?> UpdateFactoringRequestAsync(int id, UpdateFactoringRequestDto updateFactoringRequestDto)
    {
        var request = await _unitOfWork.FactoringRequests.GetByIdAsync(id);
        if (request == null) return null;

        _mapper.Map(updateFactoringRequestDto, request);
        request.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.FactoringRequests.UpdateAsync(request);
        await _unitOfWork.SaveChangesAsync();

        return await GetFactoringRequestByIdAsync(id);
    }

    public async Task<bool> DeleteFactoringRequestAsync(int id)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var request = await _unitOfWork.FactoringRequests.GetByIdAsync(id);
            if (request == null) return false;

            // Delete associated invoice relationships
            var requestInvoices = await _unitOfWork.FactoringRequestInvoices.FindAsync(fri => fri.FactoringRequestId == id);
            await _unitOfWork.FactoringRequestInvoices.DeleteRangeAsync(requestInvoices);

            // Delete the request
            await _unitOfWork.FactoringRequests.DeleteAsync(request);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return true;
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            return false;
        }
    }

    public async Task<IEnumerable<FactoringRequestDto>> GetFactoringRequestsByStatusAsync(int userId, string status)
    {
        if (Enum.TryParse<FactoringStatus>(status, out var factoringStatus))
        {
            var requests = await _unitOfWork.FactoringRequests.FindAsync(fr => fr.UserId == userId && fr.Status == factoringStatus);
            return _mapper.Map<IEnumerable<FactoringRequestDto>>(requests);
        }
        return new List<FactoringRequestDto>();
    }

    public async Task<decimal> GetTotalFactoringAmountByUserAsync(int userId)
    {
        var requests = await _unitOfWork.FactoringRequests.FindAsync(fr => fr.UserId == userId);
        return requests.Sum(fr => fr.TotalAmount);
    }

    public async Task<bool> ApproveFactoringRequestAsync(int id, decimal commissionRate, decimal advanceAmount)
    {
        var request = await _unitOfWork.FactoringRequests.GetByIdAsync(id);
        if (request == null) return false;

        request.Status = FactoringStatus.Approved;
        request.CommissionRate = commissionRate;
        request.CommissionAmount = request.TotalAmount * (commissionRate / 100);
        request.AdvanceAmount = advanceAmount;
        request.PaymentDate = DateTime.UtcNow.AddDays(1); // Next business day
        request.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.FactoringRequests.UpdateAsync(request);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RejectFactoringRequestAsync(int id, string rejectionReason)
    {
        var request = await _unitOfWork.FactoringRequests.GetByIdAsync(id);
        if (request == null) return false;

        request.Status = FactoringStatus.Rejected;
        request.RejectionReason = rejectionReason;
        request.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.FactoringRequests.UpdateAsync(request);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}