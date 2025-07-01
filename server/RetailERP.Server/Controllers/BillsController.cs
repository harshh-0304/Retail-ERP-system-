// File: C:\Users\bakas\Desktop\Retail ERP\server\RetailERP.Server\Controllers\BillsController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailERP.Server.Data; // Your DbContext
using RetailERP.Server.Models; // Your Bill model

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
        // Includes Customer and BillItems for comprehensive bill data
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bill>>> GetBills()
        {
            if (_context.Bills == null)
            {
                return NotFound();
            }
            return await _context.Bills
                                 .Include(b => b.Customer) // Eager load the Customer
                                 .Include(b => b.Items)    // Eager load the BillItems
                                     .ThenInclude(bi => bi.Product) // Further include Product for each BillItem
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
        // Note: When posting a bill, ensure CustomerId is provided.
        // BillItems can be added in a separate request or as part of a more complex DTO.
        [HttpPost]
        public async Task<ActionResult<Bill>> PostBill(Bill bill)
        {
            if (_context.Bills == null)
            {
                return Problem("Entity set 'RetailDbContext.Bills' is null.");
            }

            // Ensure related entities are tracked correctly if they are new or existing
            if (bill.Customer != null && bill.Customer.Id == 0)
            {
                _context.Customers.Add(bill.Customer); // Add new customer if provided
            }
            else if (bill.Customer != null && bill.Customer.Id > 0)
            {
                _context.Customers.Attach(bill.Customer); // Attach existing customer
                _context.Entry(bill.Customer).State = EntityState.Unchanged; // Prevent updating customer if it's just a reference
            }

            // Handle BillItems if they are part of the initial POST
            // FIX: Added null check for bill.Items
            if (bill.Items != null && bill.Items.Any())
            {
                foreach (var item in bill.Items)
                {
                    // Attach existing products or add new ones if necessary
                    if (item.Product != null && item.Product.Id > 0)
                    {
                        _context.Products.Attach(item.Product);
                        _context.Entry(item.Product).State = EntityState.Unchanged;
                    }
                    _context.BillItems.Add(item); // Add the bill item
                }
            }


            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();

            // Reload navigation properties to return a complete object
            await _context.Entry(bill)
                          .Reference(b => b.Customer).LoadAsync();
            await _context.Entry(bill)
                          .Collection(b => b.Items).LoadAsync();
            // FIX: Added null check for bill.Items before iterating after loading
            if (bill.Items != null)
            {
                foreach (var item in bill.Items)
                {
                    await _context.Entry(item).Reference(bi => bi.Product).LoadAsync();
                }
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

            // Detach any existing tracked entity with the same ID to avoid conflicts
            var existingBill = await _context.Bills.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
            if (existingBill == null)
            {
                return NotFound();
            }

            _context.Entry(bill).State = EntityState.Modified;

            // Handle related entities: Customer and BillItems
            // For simplicity in a PUT, you might only update scalar properties of Bill
            // or use a DTO. Handling nested updates for collections like BillItems
            // requires more complex logic (e.g., comparing existing items, adding new, removing old).
            // This example assumes BillItems are managed separately or via a DTO for updates.

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
            var bill = await _context.Bills.FindAsync(id);
            if (bill == null)
            {
                return NotFound();
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
