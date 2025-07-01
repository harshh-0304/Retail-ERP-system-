// File: C:\Users\bakas\Desktop\Retail ERP\server\RetailERP.Server\Models\Bill.cs

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // For [Column] attribute
using System.Collections.Generic;

namespace RetailERP.Server.Models
{
    public class Bill
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime BillDate { get; set; } = DateTime.UtcNow; // Default to current UTC time

        // Foreign Key to Customer
        [Required]
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")] // Explicitly define foreign key relationship
        public Customer Customer { get; set; } = default!; // Navigation property, initialized with default!

        [Required]
        [Column(TypeName = "decimal(18, 2)")] // Specifies decimal precision for database
        [Range(0, double.MaxValue, ErrorMessage = "Total amount cannot be negative")]
        public decimal TotalAmount { get; set; }

        // Navigation property for BillItems (a bill can have many items)
        public ICollection<BillItem> Items { get; set; } = new List<BillItem>();
    }
}
