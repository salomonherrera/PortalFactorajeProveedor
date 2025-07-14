using AutoMapper;
using TekProvider.Support.Services;
using TekProvider.Shared.DTOs;
using TekProvider.Shared.Entities;
using TekProvider.Shared.Enums;
using TekProvider.Shared.Interfaces;

namespace TekProvider.Support.Services;

public class SupportService : ISupportService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SupportService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SupportTicketDto>> GetTicketsByUserAsync(int userId)
    {
        var tickets = await _unitOfWork.SupportTickets.FindAsync(t => t.UserId == userId);
        return _mapper.Map<IEnumerable<SupportTicketDto>>(tickets);
    }

    public async Task<SupportTicketDto?> GetTicketByIdAsync(int id)
    {
        var ticket = await _unitOfWork.SupportTickets.GetByIdAsync(id);
        return ticket != null ? _mapper.Map<SupportTicketDto>(ticket) : null;
    }

    public async Task<SupportTicketDto> CreateTicketAsync(CreateSupportTicketDto createTicketDto)
    {
        var ticket = _mapper.Map<SupportTicket>(createTicketDto);
        ticket.TicketNumber = $"TKT-{DateTime.Now.Ticks.ToString().Substring(0, 8)}";
        ticket.Status = TicketStatus.Open;
        ticket.CreatedAt = DateTime.UtcNow;

        // Auto-assign based on priority
        ticket.AssignedTo = GetAssignedExecutive(ticket.Priority);

        await _unitOfWork.SupportTickets.AddAsync(ticket);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<SupportTicketDto>(ticket);
    }

    public async Task<SupportTicketDto?> UpdateTicketAsync(int id, UpdateSupportTicketDto updateTicketDto)
    {
        var ticket = await _unitOfWork.SupportTickets.GetByIdAsync(id);
        if (ticket == null) return null;

        _mapper.Map(updateTicketDto, ticket);
        ticket.UpdatedAt = DateTime.UtcNow;

        if (updateTicketDto.Status == TicketStatus.Closed)
        {
            ticket.ClosedAt = DateTime.UtcNow;
        }

        await _unitOfWork.SupportTickets.UpdateAsync(ticket);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<SupportTicketDto>(ticket);
    }

    public async Task<bool> DeleteTicketAsync(int id)
    {
        var ticket = await _unitOfWork.SupportTickets.GetByIdAsync(id);
        if (ticket == null) return false;

        await _unitOfWork.SupportTickets.DeleteAsync(ticket);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<SupportTicketDto>> GetTicketsByStatusAsync(int userId, string status)
    {
        if (Enum.TryParse<TicketStatus>(status, out var ticketStatus))
        {
            var tickets = await _unitOfWork.SupportTickets.FindAsync(t => t.UserId == userId && t.Status == ticketStatus);
            return _mapper.Map<IEnumerable<SupportTicketDto>>(tickets);
        }
        return new List<SupportTicketDto>();
    }

    public async Task<IEnumerable<SupportTicketDto>> GetTicketsByPriorityAsync(int userId, string priority)
    {
        if (Enum.TryParse<TicketPriority>(priority, out var ticketPriority))
        {
            var tickets = await _unitOfWork.SupportTickets.FindAsync(t => t.UserId == userId && t.Priority == ticketPriority);
            return _mapper.Map<IEnumerable<SupportTicketDto>>(tickets);
        }
        return new List<SupportTicketDto>();
    }

    public async Task<bool> CloseTicketAsync(int id)
    {
        var ticket = await _unitOfWork.SupportTickets.GetByIdAsync(id);
        if (ticket == null) return false;

        ticket.Status = TicketStatus.Closed;
        ticket.ClosedAt = DateTime.UtcNow;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SupportTickets.UpdateAsync(ticket);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AssignTicketAsync(int id, string assignedTo)
    {
        var ticket = await _unitOfWork.SupportTickets.GetByIdAsync(id);
        if (ticket == null) return false;

        ticket.AssignedTo = assignedTo;
        ticket.Status = TicketStatus.InProgress;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SupportTickets.UpdateAsync(ticket);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    private string GetAssignedExecutive(TicketPriority priority)
    {
        var executives = new[]
        {
            "María González",
            "Carlos Ramírez", 
            "Ana Martínez",
            "Luis Hernández",
            "Patricia Silva"
        };

        return priority switch
        {
            TicketPriority.High => executives[0], // Senior executive for high priority
            TicketPriority.Medium => executives[1],
            TicketPriority.Low => executives[2],
            _ => executives[new Random().Next(executives.Length)]
        };
    }
}