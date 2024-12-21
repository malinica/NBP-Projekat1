using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataLayer.Migrations
{
    /// <inheritdoc />
    public partial class V3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "80c8b6b1-e2b6-45e8-b044-8f2178a90111",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "a1c84961-3435-4645-a2d5-5675dc9818e3", "AQAAAAIAAYagAAAAEHqjOUA5FOrRcdITgOAa8AoROsUKlfBSgFdpiOsIdIbjM8457Sciq8GKnTow5KLCyg==", "ae690757-543b-415b-856d-037413708eb3" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "80c8b6b1-e2b6-45e8-b044-8f2178a90111",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "16b38225-e78c-4488-8b64-140e411482f3", "AQAAAAIAAYagAAAAEB8CNbEgQbL+s7S7+sdXmpDNlPlI+H7wPfimEn82KqP7JqguTWqG3R9l6+EmqXe63Q==", "f4812f94-45f6-4522-b7f9-2670d028d1c4" });
        }
    }
}
