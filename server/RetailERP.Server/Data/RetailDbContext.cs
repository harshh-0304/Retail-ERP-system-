    using Microsoft.EntityFrameworkCore;
    using RetailERP.Server.Models; // Ensure this is correct

    namespace RetailERP.Server.Data
    {
        public class RetailDbContext : DbContext
        {
            public RetailDbContext(DbContextOptions<RetailDbContext> options)
                : base(options)
            {
            }

            public DbSet<Product> Products { get; set; } = default!;
            public DbSet<Customer> Customers { get; set; } = default!;
            public DbSet<Bill> Bills { get; set; } = default!;
            public DbSet<BillItem> BillItems { get; set; } = default!;

            // Optional: Fluent API for more complex model configurations if needed
            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                // Example: Composite key for BillItem if needed (not strictly necessary with 'Id' PK)
                // modelBuilder.Entity<BillItem>()
                //     .HasKey(bi => new { bi.BillId, bi.ProductId });

                // Example: Configure one-to-many relationship explicitly if needed
                // modelBuilder.Entity<BillItem>()
                //     .HasOne(bi => bi.Bill)
                //     .WithMany(b => b.Items)
                //     .HasForeignKey(bi => bi.BillId);

                // modelBuilder.Entity<BillItem>()
                //     .HasOne(bi => bi.Product)
                //     .WithMany(p => p.BillItems)
                //     .HasForeignKey(bi => bi.ProductId);
            }
        }
    }
    