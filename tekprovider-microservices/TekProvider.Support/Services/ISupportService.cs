using TekProvider.Shared.DTOs;

namespace TekProvider.Support.Services;

public interface ISupportService
{
    Task<IEnumerable<SupportTicketDto>> GetTicketsByUserAsync(int userId);
    Task<SupportTicketDto?> GetTicketByIdAsync(int id);
    Task<SupportTicketDto> CreateTicketAsync(CreateSupportTicketDto createTicketDto);
    Task<SupportTicketDto?> UpdateTicketAsync(int id, UpdateSupportTicketDto updateTicketDto);
    Task<bool> DeleteTicketAsync(int id);
    Task<IEnumerable<SupportTicketDto>> GetTicketsByStatusAsync(int userId, string status);
    Task<IEnumerable<SupportTicketDto>> GetTicketsByPriorityAsync(int userId, string priority);
    Task<bool> CloseTicketAsync(int id);
    Task<bool> AssignTicketAsync(int id, string assignedTo);
}