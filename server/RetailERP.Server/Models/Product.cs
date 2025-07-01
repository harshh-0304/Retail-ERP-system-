// File: C:\Users\bakas\Desktop\Retail ERP\server\RetailERP.Server\Models\Product.cs

using System.ComponentModel.DataAnnotations; // For [Key] attribute
using System.Collections.Generic; // For ICollection
using System.Text.Json.Serialization; // IMPORTANT: Add this using directive for [JsonIgnore]

namespace RetailERP.Server.Models
{
    public class Product
    {
        [Key] // Denotes this as the primary key
        public int Id { get; set; }

        [Required] // Ensures this property must have a value
        [MaxLength(255)] // Optional: Set a max length for string properties
        public string Name { get; set; } = default!; // Initialized to avoid CS8618 warning

        [MaxLength(1000)] // Optional: Set a max length for description
        public string? Description { get; set; } // Nullable, as description might be optional

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")] // Ensures price is positive
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative")] // Ensures quantity is non-negative
        public int StockQuantity { get; set; }

        // Navigation property for BillItems (a product can be in many bill items)
        // Add [JsonIgnore] to break the circular reference when serializing Product
        // This prevents the serializer from going Bill -> BillItem -> Product -> BillItems -> ...
        [JsonIgnore]
        public ICollection<BillItem> BillItems { get; set; } = new List<BillItem>();
    }
}
