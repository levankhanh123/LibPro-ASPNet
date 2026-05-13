using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace LibraryInfrastructure.Persistence
{
    public class LibraryDbContextFactory : IDesignTimeDbContextFactory<LibraryDbContext>
    {
        public LibraryDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<LibraryDbContext>();
            // Cấu hình tạm thời để EF Core có thể tạo Migration
            optionsBuilder.UseMySQL("Server=localhost;Port=3306;Database=LibPro;Uid=root;Pwd=CHANGE_ME;SslMode=Preferred;");
            return new LibraryDbContext(optionsBuilder.Options);
        }
    }
}
