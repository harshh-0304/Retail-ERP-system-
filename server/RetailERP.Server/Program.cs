using Microsoft.EntityFrameworkCore;
using RetailERP.Server.Data;
using System.Text.Json.Serialization; // Add this using directive
using Microsoft.Extensions.Logging; // Add this using directive

var builder = WebApplication.CreateBuilder(args);

// Define a CORS policy name
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options => // Add JSON options configuration
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173",
                                              "https://localhost:5173")
                                 .AllowAnyHeader()
                                 .AllowAnyMethod();
                      });
});

// Get the connection string from appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configure the DbContext to use SQL Server with your connection string
builder.Services.AddDbContext<RetailDbContext>(options =>
    options.UseSqlServer(connectionString)
           .LogTo(Console.WriteLine, LogLevel.Information) // ADDED: Log EF Core queries to console
           .EnableSensitiveDataLogging() // ADDED: Include parameter values in logs (for debugging only)
           .EnableDetailedErrors()); // ADDED: Enable detailed EF Core error messages

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
