using Microsoft.EntityFrameworkCore.Storage;
using TekProvider.Shared.Data;
using TekProvider.Shared.Entities;
using TekProvider.Shared.Interfaces;

namespace TekProvider.Shared.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly TekProviderDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(TekProviderDbContext context)
    {
        _context = context;
        Users = new Repository<User>(_context);
        Invoices = new Repository<Invoice>(_context);
        FactoringRequests = new Repository<FactoringRequest>(_context);
        FactoringRequestInvoices = new Repository<FactoringRequestInvoice>(_context);
        SupportTickets = new Repository<SupportTicket>(_context);
        Notifications = new Repository<Notification>(_context);
    }

    public IRepository<User> Users { get; private set; }
    public IRepository<Invoice> Invoices { get; private set; }
    public IRepository<FactoringRequest> FactoringRequests { get; private set; }
    public IRepository<FactoringRequestInvoice> FactoringRequestInvoices { get; private set; }
    public IRepository<SupportTicket> SupportTickets { get; private set; }
    public IRepository<Notification> Notifications { get; private set; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}