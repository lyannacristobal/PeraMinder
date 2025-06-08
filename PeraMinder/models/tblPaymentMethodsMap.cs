using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Configuration;
using System.Linq;
using System.Web;

namespace PeraMinder.Models
{
    public class tblPaymentMethodsMap : EntityTypeConfiguration<tblPaymentMethodsModel>
    {
        public tblPaymentMethodsMap()
        {
            HasKey(i => i.paymentMethodID);
            ToTable("tblpaymentmethods");

        }
    }
}