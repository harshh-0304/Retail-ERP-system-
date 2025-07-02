// File: C:\Users\bakas\Desktop\Retail ERP\server\RetailERP.Server\Controllers\BillsController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailERP.Server.Data;
using RetailERP.Server.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation; // Added for [ValidateNever]

namespace RetailERP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Route: /api/bills
    public class BillsController : ControllerBase
    {
        private readonly RetailDbContext _context;

        public BillsController(RetailDbContext context)
        {
            _context = context;
        }

        // GET: api/Bills
        // Explicitly project into an anonymous type to ensure Customer and Product data are serialized
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBills() // Return type changed to IEnumerable<object>
        {
            if (_context.Bills == null)
            {
                return NotFound();
            }

            return await _context.Bills
                                 .Include(b => b.Customer)
                                 .Include(b => b.Items)
                                     .ThenInclude(bi => bi.Product)
                                 .Select(b => new // Project into an anonymous object
                                 {
                                     b.Id,
                                     b.BillDate,
                                     b.CustomerId,
                                     Customer = b.Customer != null ? new // Safely access Customer properties
                                     {
                                         b.Customer.Id,
                                         b.Customer.Name,
                                         b.Customer.Contact,
                                         b.Customer.Email
                                     } : null, // Provide null if customer is null
                                     b.TotalAmount,
                                     Items = b.Items.Select(bi => new // Explicitly select BillItem and Product properties
                                     {
                                         bi.Id,
                                         bi.BillId,
                                         bi.ProductId,
                                         Product = bi.Product != null ? new // Safely access Product properties
                                         {
                                             bi.Product.Id,
                                             bi.Product.Name,
                                             bi.Product.Description,
                                             bi.Product.Price,
                                             bi.Product.StockQuantity
                                         } : null, // Provide null if product is null
                                         bi.Quantity,
                                         bi.UnitPrice,
                                         bi.ItemTotal
                                     }).ToList()
                                 })
                                 .ToListAsync();
        }

        // GET: api/Bills/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bill>> GetBill(int id)
        {
            if (_context.Bills == null)
            {
                return NotFound();
            }
            // Also include related data for a single bill fetch
            var bill = await _context.Bills
                                     .Include(b => b.Customer)
                                     .Include(b => b.Items)
                                         .ThenInclude(bi => bi.Product)
                                     .FirstOrDefaultAsync(b => b.Id == id);

            if (bill == null)
            {
                return NotFound();
            }

            return bill;
        }

        // POST: api/Bills
        [HttpPost]
        public async Task<ActionResult<Bill>> PostBill(Bill bill)
        {
            if (_context.Bills == null)
            {
                return Problem("Entity set 'RetailDbContext.Bills' is null.");
            }

            // Ensure BillDate is set if not provided by client (or rely on model default)
            if (bill.BillDate == default(DateTime))
            {
                bill.BillDate = DateTime.UtcNow;
            }

            // Validate CustomerId exists
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == bill.CustomerId);
            if (!customerExists)
            {
                return BadRequest($"Customer with ID {bill.CustomerId} does not exist.");
            }

            // Explicitly skip validation for the Customer navigation property
            ModelState.ClearValidationState(nameof(bill.Customer));

            // Add the bill to the context. Its associated BillItems will also be tracked.
            _context.Bills.Add(bill);
            
            // Now, handle BillItems and update Product StockQuantity before saving
            foreach (var item in bill.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                {
                    return BadRequest($"Product with ID {item.ProductId} not found.");
                }

                if (product.StockQuantity < item.Quantity)
                {
                    return BadRequest($"Insufficient stock for product '{product.Name}'. Available: {product.StockQuantity}, Requested: {item.Quantity}");
                }

                product.StockQuantity -= item.Quantity; // Decrement stock
                item.UnitPrice = product.Price; // Use current product price as UnitPrice for the bill item
                item.ItemTotal = item.Quantity * item.UnitPrice;
                
                // No need to explicitly add item to _context.BillItems.Add(item); here
                // if it's already part of bill.Items and bill is added to context.
                // EF Core will handle cascading save for related entities in the graph.
            }

            // Save all changes (Bill, BillItems, Product stock updates) in one transaction
            await _context.SaveChangesAsync();

            // After saving, reload the customer and items (with products) for the response
            // This ensures the returned bill object is complete and ready for the frontend.
            await _context.Entry(bill).Reference(b => b.Customer).LoadAsync();
            await _context.Entry(bill).Collection(b => b.Items).LoadAsync();
            foreach (var item in bill.Items)
            {
                await _context.Entry(item).Reference(bi => bi.Product).LoadAsync();
            }

            return CreatedAtAction("GetBill", new { id = bill.Id }, bill);
        }

        // PUT: api/Bills/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBill(int id, Bill bill)
        {
            if (id != bill.Id)
            {
                return BadRequest();
            }

            _context.Entry(bill).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BillExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Bills/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBill(int id)
        {
            if (_context.Bills == null)
            {
                return NotFound();
            }
            var bill = await _context.Bills
                                     .Include(b => b.Items) // Include items to potentially revert stock
                                     .FirstOrDefaultAsync(b => b.Id == id);
            if (bill == null)
            {
                return NotFound();
            }

            // OPTIONAL: Revert stock for products in the deleted bill
            // This depends on your business logic. If you delete a bill, do you put stock back?
            foreach (var item in bill.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity += item.Quantity; // Add stock back
                }
            }

            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BillExists(int id)
        {
            return (_context.Bills?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
