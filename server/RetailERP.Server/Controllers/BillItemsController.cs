// File: C:\Users\bakas\Desktop\Retail ERP\server\RetailERP.Server\Controllers\BillItemsController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailERP.Server.Data; // Your DbContext
using RetailERP.Server.Models; // Your BillItem model

namespace RetailERP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Route: /api/billitems
    public class BillItemsController : ControllerBase
    {
        private readonly RetailDbContext _context;

        public BillItemsController(RetailDbContext context)
        {
            _context = context;
        }

        // GET: api/BillItems
        // Includes Bill and Product for comprehensive item data
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BillItem>>> GetBillItems()
        {
            if (_context.BillItems == null)
            {
                return NotFound();
            }
            return await _context.BillItems
                                 .Include(bi => bi.Bill)    // Eager load the parent Bill
                                 .Include(bi => bi.Product) // Eager load the associated Product
                                 .ToListAsync();
        }

        // GET: api/BillItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BillItem>> GetBillItem(int id)
        {
            if (_context.BillItems == null)
            {
                return NotFound();
            }
            var billItem = await _context.BillItems
                                         .Include(bi => bi.Bill)
                                         .Include(bi => bi.Product)
                                         .FirstOrDefaultAsync(bi => bi.Id == id);

            if (billItem == null)
            {
                return NotFound();
            }

            return billItem;
        }

        // POST: api/BillItems
        // Note: When posting a BillItem, ensure BillId and ProductId are provided.
        [HttpPost]
        public async Task<ActionResult<BillItem>> PostBillItem(BillItem billItem)
        {
            if (_context.BillItems == null)
            {
                return Problem("Entity set 'RetailDbContext.BillItems' is null.");
            }

            // Attach existing Bill and Product to the context to avoid creating duplicates
            if (billItem.Bill != null && billItem.Bill.Id > 0)
            {
                _context.Bills.Attach(billItem.Bill);
                _context.Entry(billItem.Bill).State = EntityState.Unchanged;
            }
            if (billItem.Product != null && billItem.Product.Id > 0)
            {
                _context.Products.Attach(billItem.Product);
                _context.Entry(billItem.Product).State = EntityState.Unchanged;
            }

            _context.BillItems.Add(billItem);
            await _context.SaveChangesAsync();

            // Reload navigation properties to return a complete object
            await _context.Entry(billItem).Reference(bi => bi.Bill).LoadAsync();
            await _context.Entry(billItem).Reference(bi => bi.Product).LoadAsync();

            return CreatedAtAction("GetBillItem", new { id = billItem.Id }, billItem);
        }

        // PUT: api/BillItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBillItem(int id, BillItem billItem)
        {
            if (id != billItem.Id)
            {
                return BadRequest();
            }

            var existingBillItem = await _context.BillItems.AsNoTracking().FirstOrDefaultAsync(bi => bi.Id == id);
            if (existingBillItem == null)
            {
                return NotFound();
            }

            _context.Entry(billItem).State = EntityState.Modified;

            // Handle related entities: Bill and Product
            // Similar to Bill PUT, handling nested updates for related entities can be complex.
            // This example assumes related entities are managed separately or via a DTO for updates.

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BillItemExists(id))
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

        // DELETE: api/BillItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBillItem(int id)
        {
            if (_context.BillItems == null)
            {
                return NotFound();
            }
            var billItem = await _context.BillItems.FindAsync(id);
            if (billItem == null)
            {
                return NotFound();
            }

            _context.BillItems.Remove(billItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BillItemExists(int id)
        {
            return (_context.BillItems?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
