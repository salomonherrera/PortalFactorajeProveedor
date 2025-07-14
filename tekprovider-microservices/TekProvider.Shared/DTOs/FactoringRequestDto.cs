using TekProvider.Shared.Enums;

namespace TekProvider.Shared.DTOs;

public class FactoringRequestDto
{
    public int Id { get; set; }
    public string RequestNumber { get; set; } = string.Empty;
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public FactoringStatus Status { get; set; }
    public decimal? CommissionRate { get; set; }
    public decimal? CommissionAmount { get; set; }
    public decimal? AdvanceAmount { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<InvoiceDto> Invoices { get; set; } = new();
}

public class CreateFactoringRequestDto
{
    public int UserId { get; set; }
    public List<int> InvoiceIds { get; set; } = new();
    public string? Notes { get; set; }
}

public class UpdateFactoringRequestDto
{
    public FactoringStatus? Status { get; set; }
    public decimal? CommissionRate { get; set; }
    public decimal? AdvanceAmount { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? Notes { get; set; }
    public string? RejectionReason { get; set; }
}