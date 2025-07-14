using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TekProvider.Shared.Enums;

namespace TekProvider.Shared.Entities;

[Table("SupportTickets")]
public class SupportTicket
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string TicketNumber { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;

    [Required]
    public TicketStatus Status { get; set; } = TicketStatus.Open;

    [Required]
    public int UserId { get; set; }

    [MaxLength(100)]
    public string? AssignedTo { get; set; }

    [MaxLength(500)]
    public string? AttachmentPath { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }

    // Navigation Properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}