using TekProvider.Shared.Entities;

namespace TekProvider.Shared.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Invoice> Invoices { get; }
    IRepository<FactoringRequest> FactoringRequests { get; }
    IRepository<FactoringRequestInvoice> FactoringRequestInvoices { get; }
    IRepository<SupportTicket> SupportTickets { get; }
    IRepository<Notification> Notifications { get; }
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}