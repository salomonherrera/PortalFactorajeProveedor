using Microsoft.EntityFrameworkCore;
using TekProvider.Shared.Entities;

namespace TekProvider.Shared.Data;

public class TekProviderDbContext : DbContext
{
    public TekProviderDbContext(DbContextOptions<TekProviderDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<FactoringRequest> FactoringRequests { get; set; }
    public DbSet<FactoringRequestInvoice> FactoringRequestInvoices { get; set; }
    public DbSet<SupportTicket> SupportTickets { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.RFC).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.ProviderCode).IsUnique();
        });

        // Invoice Configuration
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasIndex(e => e.Folio).IsUnique();
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.IssueDate);
            entity.HasIndex(e => e.DueDate);

            entity.HasOne(d => d.User)
                .WithMany(p => p.Invoices)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // FactoringRequest Configuration
        modelBuilder.Entity<FactoringRequest>(entity =>
        {
            entity.HasIndex(e => e.RequestNumber).IsUnique();
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // FactoringRequestInvoice Configuration
        modelBuilder.Entity<FactoringRequestInvoice>(entity =>
        {
            entity.HasIndex(e => new { e.FactoringRequestId, e.InvoiceId }).IsUnique();

            entity.HasOne(d => d.FactoringRequest)
                .WithMany(p => p.FactoringRequestInvoices)
                .HasForeignKey(d => d.FactoringRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Invoice)
                .WithMany(p => p.FactoringRequests)
                .HasForeignKey(d => d.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // SupportTicket Configuration
        modelBuilder.Entity<SupportTicket>(entity =>
        {
            entity.HasIndex(e => e.TicketNumber).IsUnique();
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Priority);
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(d => d.User)
                .WithMany(p => p.SupportTickets)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Notification Configuration
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.IsRead);
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(d => d.User)
                .WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed Data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Users
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                CompanyName = "Servicios Empresariales Demo S.A. de C.V.",
                RFC = "SED123456789",
                Email = "admin@serviciosempresariales.com",
                Phone = "+52 55 1234 5678",
                Address = "Av. Insurgentes Sur 123, Col. Roma Norte, CDMX",
                BankAccount = "012345678901234567",
                BankName = "BBVA México",
                ProviderCode = "PROV-001234",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed Invoices
        var invoices = new List<Invoice>();
        var companies = new[]
        {
            "Nestlé México", "Coca Cola", "Walmart", "Soriana", "Liverpool",
            "Palacio de Hierro", "Chedraui", "Oxxo", "Seven Eleven", "Farmacias Guadalajara",
            "Farmacias del Ahorro", "Home Depot", "Costco", "Sams Club", "Mercado Libre",
            "Amazon México", "Grupo Bimbo", "Femsa", "Alsea", "Cinépolis",
            "Telcel", "Movistar"
        };

        for (int i = 1; i <= 22; i++)
        {
            invoices.Add(new Invoice
            {
                Id = i,
                Folio = $"F{i:D3}",
                ClientName = companies[i - 1],
                Amount = new Random().Next(45000, 500000),
                IssueDate = DateTime.UtcNow.AddDays(-new Random().Next(1, 30)),
                DueDate = DateTime.UtcNow.AddDays(new Random().Next(15, 45)),
                Status = (InvoiceStatus)new Random().Next(1, 4),
                UserId = 1,
                CreatedAt = DateTime.UtcNow
            });
        }

        modelBuilder.Entity<Invoice>().HasData(invoices);
    }
}