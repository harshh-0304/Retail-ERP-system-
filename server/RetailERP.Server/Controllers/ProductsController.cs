// File: C:\Users\bakas\Desktop\Retail ERP\server\RetailERP.Server\Controllers\ProductsController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailERP.Server.Data; // Your DbContext
using RetailERP.Server.Models; // Your Product model

namespace RetailERP.Server.Controllers
{
    [ApiController] // Indicates this is an API controller
    [Route("api/[controller]")] // Sets the base route for this controller (e.g., /api/products)
    public class ProductsController : ControllerBase // Inherit from ControllerBase for API controllers
    {
        private readonly RetailDbContext _context;

        // Constructor for Dependency Injection of your DbContext
        public ProductsController(RetailDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        // Now accepts optional query parameters for searching and filtering
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
            [FromQuery] string? search = null, // Optional search term for name/description
            [FromQuery] int? minStock = null)  // Optional minimum stock quantity
        {
            if (_context.Products == null)
            {
                return NotFound();
            }

            IQueryable<Product> query = _context.Products;

            // Apply search filter if a search term is provided
            if (!string.IsNullOrWhiteSpace(search))
            {
                // Ensure case-insensitive search by converting both sides to lower case
                // This filters products where Name OR Description contains the search term
                query = query.Where(p =>
                    p.Name.ToLower().Contains(search.ToLower()) ||
                    (p.Description != null && p.Description.ToLower().Contains(search.ToLower())));
            }

            // Apply minimum stock filter if minStock is provided
            if (minStock.HasValue)
            {
                // Filters products where StockQuantity is greater than or equal to the minStock value
                query = query.Where(p => p.StockQuantity >= minStock.Value);
            }

            // Execute the query and return the filtered list of products
            return await query.ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (_context.Products == null)
            {
                return Problem("Entity set 'RetailDbContext.Products' is null.");
            }
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Returns a 201 CreatedAtAction response with the new product's location
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); // 204 No Content response
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content response
        }

        private bool ProductExists(int id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
