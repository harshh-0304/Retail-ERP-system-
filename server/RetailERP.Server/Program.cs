using Microsoft.EntityFrameworkCore;
using RetailERP.Server.Data;
using System.Text.Json.Serialization; // Add this using directive

var builder = WebApplication.CreateBuilder(args);

// Define a CORS policy name
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options => // Add JSON options configuration
    {
        // This helps to prevent circular reference errors and ensures navigation properties are serialized.
        // Option 1: Preserve object references (might add $id, $ref properties to JSON)
        // options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;

        // Option 2: Ignore cycles (recommended for most API scenarios to avoid circular reference issues)
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull; // Optional: Ignore null properties
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173", // Your Vite development server URL
                                              "https://localhost:5173") // Include HTTPS if your Vite dev server uses it
                                 .AllowAnyHeader()
                                 .AllowAnyMethod();
                      });
});


// Get the connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configure the DbContext to use SQL Server with your connection string
builder.Services.AddDbContext<RetailDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

// Use the CORS policy here, after UseRouting and before UseAuthorization
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
