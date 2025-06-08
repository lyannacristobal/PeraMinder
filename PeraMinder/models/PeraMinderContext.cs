using MySql.Data.EntityFramework;
using System.Data.Entity;

namespace PeraMinder.Models
{
    [DbConfigurationType(typeof(MySqlEFConfiguration))]
    public class PeraMinderContext : DbContext
    {
        static PeraMinderContext()
        {
            Database.SetInitializer<PeraMinderContext>(null);
        }

        public PeraMinderContext() : base("Name=pminder_db")
        {
        }

        public virtual DbSet<tblUsersModel> tblusers { get; set; }
        public virtual DbSet<tblFeedbacksModel> tblfeedbacks { get; set; }
        public virtual DbSet<tblTransactionsModel> tbltransactions { get; set; }
        public virtual DbSet<tblAdminModel> tbladmin { get; set; }
        public virtual DbSet<tblCategoryModel> tblcategory { get; set; }
        public virtual DbSet<tblPaymentMethodsModel> tblpaymentmethods { get; set; }
        public virtual DbSet<tblTransactionTypeModel> tbltransactiontype { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure models
            modelBuilder.Configurations.Add(new tblUsersMap());
            modelBuilder.Configurations.Add(new tblFeedbacksMap());
            modelBuilder.Configurations.Add(new tblTransactionsMap());
            modelBuilder.Configurations.Add(new tblAdminMap());
            modelBuilder.Configurations.Add(new tblCategoryMap());
            modelBuilder.Configurations.Add(new tblPaymentMethodsMap());
            modelBuilder.Configurations.Add(new tblTransactionTypeMap());
        }
    }
}
