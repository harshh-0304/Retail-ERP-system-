    using Microsoft.EntityFrameworkCore;
    using RetailERP.Server.Data;

    var builder = WebApplication.CreateBuilder(args);

    // Define a CORS policy name
    var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

    // Add services to the container.
    builder.Services.AddControllersWithViews();

    // Configure CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: MyAllowSpecificOrigins,
                          policy =>
                          {
                              // THIS IS THE CRITICAL LINE:
                              // Ensure 'http://localhost:5173' is correctly listed here.
                              // If your frontend ever uses HTTPS (e.g., https://localhost:5173), add that too.
                              policy.WithOrigins("http://localhost:5173")
                                    .AllowAnyHeader()
                                    .AllowAnyMethod();
                                    // .AllowCredentials(); // Add this if you plan to send cookies/authentication headers
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

    // IMPORTANT: Use CORS policy AFTER UseRouting and BEFORE UseAuthorization
    app.UseCors(MyAllowSpecificOrigins);

    app.UseAuthorization();

    app.MapStaticAssets();

    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}")
        .WithStaticAssets();


    app.Run();
    