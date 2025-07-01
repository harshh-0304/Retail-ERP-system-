    // File: C:\Users\bakas\Desktop\Retail ERP\server\RetailERP.Server\Models\Customer.cs
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Text.Json.Serialization; // Add this using directive

    namespace RetailERP.Server.Models
    {
        public class Customer
        {
            public int Id { get; set; }

            [Required] // Added 'required' modifier
            [MaxLength(100)]
            public string Name { get; set; } = default!; // Initialized to avoid warning if 'required' is not fully supported by context

            [Required] // Added 'required' modifier
            [MaxLength(20)]
            public string Contact { get; set; } = default!; // Initialized to avoid warning

            [MaxLength(100)]
            public string? Email { get; set; } // Made nullable, as it might be optional

            // Navigation property for Bills
            // Add [JsonIgnore] to break the serialization cycle
            [JsonIgnore]
            public ICollection<Bill> Bills { get; set; } = new List<Bill>(); // Initialized collection
        }
    }
