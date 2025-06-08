using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Configuration;
using System.Linq;
using System.Web;

namespace PeraMinder.Models
{
    public class tblTransactionsMap : EntityTypeConfiguration<tblTransactionsModel>
    {
        public tblTransactionsMap()
        {
            HasKey(i => i.transactionID);
            ToTable("tbltransactions");

        }
    }
}