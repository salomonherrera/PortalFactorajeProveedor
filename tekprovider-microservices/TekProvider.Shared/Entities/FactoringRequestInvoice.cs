using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TekProvider.Shared.Entities;

[Table("FactoringRequestInvoices")]
public class FactoringRequestInvoice
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int FactoringRequestId { get; set; }

    [Required]
    public int InvoiceId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    [ForeignKey("FactoringRequestId")]
    public virtual FactoringRequest FactoringRequest { get; set; } = null!;

    [ForeignKey("InvoiceId")]
    public virtual Invoice Invoice { get; set; } = null!;
}