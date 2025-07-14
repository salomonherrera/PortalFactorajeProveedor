using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TekProvider.Shared.Enums;

namespace TekProvider.Shared.Entities;

[Table("FactoringRequests")]
public class FactoringRequest
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string RequestNumber { get; set; } = string.Empty;

    [Required]
    public int UserId { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    [Required]
    public FactoringStatus Status { get; set; } = FactoringStatus.InProcess;

    [Column(TypeName = "decimal(5,2)")]
    public decimal? CommissionRate { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? CommissionAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? AdvanceAmount { get; set; }

    public DateTime? PaymentDate { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    [MaxLength(500)]
    public string? RejectionReason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation Properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
    
    public virtual ICollection<FactoringRequestInvoice> FactoringRequestInvoices { get; set; } = new List<FactoringRequestInvoice>();
}