using TekProvider.Shared.Enums;

namespace TekProvider.Shared.DTOs;

public class InvoiceDto
{
    public int Id { get; set; }
    public string Folio { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public InvoiceStatus Status { get; set; }
    public string? Description { get; set; }
    public string? ClientRFC { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateInvoiceDto
{
    public string Folio { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public string? Description { get; set; }
    public string? ClientRFC { get; set; }
    public int UserId { get; set; }
}

public class UpdateInvoiceDto
{
    public string? ClientName { get; set; }
    public decimal? Amount { get; set; }
    public DateTime? DueDate { get; set; }
    public InvoiceStatus? Status { get; set; }
    public string? Description { get; set; }
}