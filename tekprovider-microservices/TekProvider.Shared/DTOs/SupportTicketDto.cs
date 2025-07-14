using TekProvider.Shared.Enums;

namespace TekProvider.Shared.DTOs;

public class SupportTicketDto
{
    public int Id { get; set; }
    public string TicketNumber { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketPriority Priority { get; set; }
    public TicketStatus Status { get; set; }
    public int UserId { get; set; }
    public string? AssignedTo { get; set; }
    public string? AttachmentPath { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
}

public class CreateSupportTicketDto
{
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketPriority Priority { get; set; }
    public int UserId { get; set; }
    public string? AttachmentPath { get; set; }
}

public class UpdateSupportTicketDto
{
    public TicketStatus? Status { get; set; }
    public string? AssignedTo { get; set; }
    public string? Notes { get; set; }
}