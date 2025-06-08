using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Configuration;
using System.Linq;
using System.Web;

namespace PeraMinder.Models
{
    public class tblCategoryMap : EntityTypeConfiguration<tblCategoryModel>
    {
        public tblCategoryMap()
        {
            HasKey(i => i.categoryID);
            ToTable("tblcategory");

        }
    }
}