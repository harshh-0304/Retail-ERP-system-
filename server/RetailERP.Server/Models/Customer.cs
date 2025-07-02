// File: C:\Users\bakas\Desktop\Retail ERP\server\RetailERP.Server\Models\Customer.cs

using System.ComponentModel.DataAnnotations;
using System.Collections.Generic; // For ICollection
using System.Text.Json.Serialization; // IMPORTANT: Add this using directive

namespace RetailERP.Server.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = default!;

        [Required]
        [MaxLength(50)]
        public string Contact { get; set; } = default!; // E.g., Phone Number

        [MaxLength(255)]
        [EmailAddress] // Optional: Basic email format validation
        public string? Email { get; set; } // Email might be optional, hence nullable

        // Navigation property for Bills (a customer can have many bills)
        // ADD THIS: [JsonIgnore] to break the circular reference when serializing Customer
        // This prevents the serializer from going Bill -> Customer -> Bills -> Bill -> ...
        [JsonIgnore]
        public ICollection<Bill> Bills { get; set; } = new List<Bill>();
    }
}
