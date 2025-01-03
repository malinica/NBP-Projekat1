using System.Text;
using backend.Hubs;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Test API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
    option.UseInlineDefinitionsForEnums();
});

builder.Services.AddProblemDetails();

builder.Services.AddDbContext<ProjectContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("NBPProjekat1CS")));

builder.Services.AddScoped<TokenService, TokenService>();
builder.Services.AddScoped<TestService, TestService>();
builder.Services.AddScoped<UserService, UserService>();
builder.Services.AddScoped<ItemService, ItemService>();
builder.Services.AddScoped<AuctionService, AuctionService>();
builder.Services.AddScoped<OfferService, OfferService>();
builder.Services.AddHostedService<AuctionBackgroundService>();
builder.Services.AddSignalR();

builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services
    .AddIdentity<User, IdentityRole>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
        options.User.RequireUniqueEmail = true;
        options.Password.RequireDigit = true;
        options.Password.RequiredLength = 8;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequireUppercase = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ProjectContext>();

var validIssuer = builder.Configuration.GetValue<string>("JwtTokenSettings:ValidIssuer");
var validAudience = builder.Configuration.GetValue<string>("JwtTokenSettings:ValidAudience");
var symmetricSecurityKey = builder.Configuration.GetValue<string>("JwtTokenSettings:SymmetricSecurityKey");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.IncludeErrorDetails = true;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ClockSkew = TimeSpan.Zero,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = validIssuer,
            ValidAudience = validAudience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(symmetricSecurityKey!)
            ),
        };
        // options.Events = new JwtBearerEvents
        // {
        //     OnMessageReceived = context =>
        //     {
        //         var accessToken = context.Request.Query["access_token"];
        //         if (!string.IsNullOrEmpty(accessToken) && context.HttpContext.WebSockets.IsWebSocketRequest)
        //         {
        //             context.Token = accessToken;
        //         }
        //         return Task.CompletedTask;
        //     }
        // };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin()
              .WithOrigins("http://localhost:5500",
                           "https://localhost:5500",
                           "http://127.0.0.1:5500",
                           "https://127.0.0.1:5500",
                           "http://127.0.0.1:3000",
                           "https://127.0.0.1:3000",
                           "http://localhost:3000",
                           "https://localhost:3000",
                           "http://127.0.0.1:5173",
                           "https://127.0.0.1:5173",
                           "http://localhost:5173",
                           "https://localhost:5173");

    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Demo API");
    });
}

app.UseHttpsRedirection();
app.UseStatusCodePages();
app.UseStaticFiles();
app.UseCors("CORS");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<AuctionHub>("auctionHub");

app.Run();

