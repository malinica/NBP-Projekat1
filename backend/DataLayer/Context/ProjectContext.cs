using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;

namespace DataLayer.Context;
public class ProjectContext : IdentityUserContext<User>
{
    public required DbSet<Item> Items {get;set;}
    public ProjectContext(DbContextOptions<ProjectContext> options) : base(options)
    {
        //komanda za kreiranje migracije, pokrece se iz foldera gde je web api
        //dotnet ef migrations add V1 --project ../DataLayer/DataLayer.csproj --startup-project ./backend.csproj
        //dotnet ef database update --project ../DataLayer/DataLayer.csproj --startup-project ./backend.csproj
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        var hasher = new PasswordHasher<User>();

        var adminEmail = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("SiteSettings")["AdminEmail"];
        var adminPassword = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("SiteSettings")["AdminPassword"];

        builder.Entity<User>().HasData(
            new User
            {
                Id = "80c8b6b1-e2b6-45e8-b044-8f2178a90111",
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                PasswordHash = hasher.HashPassword(null!, adminPassword!),
                Email = adminEmail,
                NormalizedEmail = adminEmail!.ToUpper(),
                Role = Enums.Role.Admin
            }
        );
    }
}