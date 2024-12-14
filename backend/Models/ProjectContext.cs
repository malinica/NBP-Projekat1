namespace backend.Models;
public class ProjectContext : DbContext
{
        public ProjectContext(DbContextOptions<ProjectContext> options) : base(options)
    {
        
    }
}