using TekProvider.Shared.DTOs;

namespace TekProvider.Invoices.Services;

public interface IInvoiceService
{
    Task<IEnumerable<InvoiceDto>> GetInvoicesByUserAsync(int userId);
    Task<InvoiceDto?> GetInvoiceByIdAsync(int id);
    Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceDto createInvoiceDto);
    Task<InvoiceDto?> UpdateInvoiceAsync(int id, UpdateInvoiceDto updateInvoiceDto);
    Task<bool> DeleteInvoiceAsync(int id);
    Task<IEnumerable<InvoiceDto>> GetInvoicesByStatusAsync(int userId, string status);
    Task<IEnumerable<InvoiceDto>> GetInvoicesByDateRangeAsync(int userId, DateTime startDate, DateTime endDate);
    Task<decimal> GetTotalAmountByUserAsync(int userId);
    Task<bool> InvoiceExistsAsync(string folio);
}