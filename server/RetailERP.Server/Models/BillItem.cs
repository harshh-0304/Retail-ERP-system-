// File: C:\Users\bakas\Desktop\Retail ERP\server\RetailERP.Server\Models\BillItem.cs

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailERP.Server.Models
{
    public class BillItem
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key to Bill
        [Required]
        public int BillId { get; set; }

        [ForeignKey("BillId")]
        public Bill Bill { get; set; } = default!; // Navigation property

        // Foreign Key to Product
        [Required]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; } = default!; // Navigation property

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")] // Price of the product at the time of billing
        [Range(0.01, double.MaxValue, ErrorMessage = "Unit price must be greater than 0")]
        public decimal UnitPrice { get; set; } // Price per item, stored for historical accuracy

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Item total cannot be negative")]
        public decimal ItemTotal { get; set; } // Quantity * UnitPrice
    }
}
