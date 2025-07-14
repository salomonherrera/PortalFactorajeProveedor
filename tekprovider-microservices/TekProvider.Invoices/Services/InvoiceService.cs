using AutoMapper;
using TekProvider.Invoices.Services;
using TekProvider.Shared.DTOs;
using TekProvider.Shared.Entities;
using TekProvider.Shared.Enums;
using TekProvider.Shared.Interfaces;

namespace TekProvider.Invoices.Services;

public class InvoiceService : IInvoiceService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public InvoiceService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<InvoiceDto>> GetInvoicesByUserAsync(int userId)
    {
        var invoices = await _unitOfWork.Invoices.FindAsync(i => i.UserId == userId);
        return _mapper.Map<IEnumerable<InvoiceDto>>(invoices);
    }

    public async Task<InvoiceDto?> GetInvoiceByIdAsync(int id)
    {
        var invoice = await _unitOfWork.Invoices.GetByIdAsync(id);
        return invoice != null ? _mapper.Map<InvoiceDto>(invoice) : null;
    }

    public async Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceDto createInvoiceDto)
    {
        var invoice = _mapper.Map<Invoice>(createInvoiceDto);
        invoice.CreatedAt = DateTime.UtcNow;
        invoice.Status = InvoiceStatus.Issued;

        await _unitOfWork.Invoices.AddAsync(invoice);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<InvoiceDto>(invoice);
    }

    public async Task<InvoiceDto?> UpdateInvoiceAsync(int id, UpdateInvoiceDto updateInvoiceDto)
    {
        var invoice = await _unitOfWork.Invoices.GetByIdAsync(id);
        if (invoice == null) return null;

        _mapper.Map(updateInvoiceDto, invoice);
        invoice.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Invoices.UpdateAsync(invoice);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<InvoiceDto>(invoice);
    }

    public async Task<bool> DeleteInvoiceAsync(int id)
    {
        var invoice = await _unitOfWork.Invoices.GetByIdAsync(id);
        if (invoice == null) return false;

        await _unitOfWork.Invoices.DeleteAsync(invoice);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<InvoiceDto>> GetInvoicesByStatusAsync(int userId, string status)
    {
        if (Enum.TryParse<InvoiceStatus>(status, out var invoiceStatus))
        {
            var invoices = await _unitOfWork.Invoices.FindAsync(i => i.UserId == userId && i.Status == invoiceStatus);
            return _mapper.Map<IEnumerable<InvoiceDto>>(invoices);
        }
        return new List<InvoiceDto>();
    }

    public async Task<IEnumerable<InvoiceDto>> GetInvoicesByDateRangeAsync(int userId, DateTime startDate, DateTime endDate)
    {
        var invoices = await _unitOfWork.Invoices.FindAsync(i => 
            i.UserId == userId && 
            i.IssueDate >= startDate && 
            i.IssueDate <= endDate);
        return _mapper.Map<IEnumerable<InvoiceDto>>(invoices);
    }

    public async Task<decimal> GetTotalAmountByUserAsync(int userId)
    {
        var invoices = await _unitOfWork.Invoices.FindAsync(i => i.UserId == userId);
        return invoices.Sum(i => i.Amount);
    }

    public async Task<bool> InvoiceExistsAsync(string folio)
    {
        return await _unitOfWork.Invoices.ExistsAsync(i => i.Folio == folio);
    }
}