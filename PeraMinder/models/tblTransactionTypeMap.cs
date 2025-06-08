using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Configuration;
using System.Linq;
using System.Web;

namespace PeraMinder.Models
{
    public class tblTransactionTypeMap : EntityTypeConfiguration<tblTransactionTypeModel>
    {
        public tblTransactionTypeMap()
        {
            HasKey(i => i.transactionTypeID);
            ToTable("tbltransactiontype");

        }
    }
}