using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Configuration;
using System.Linq;
using System.Web;

namespace PeraMinder.Models
{
    public class tblFeedbacksMap : EntityTypeConfiguration<tblFeedbacksModel>
    {
        public tblFeedbacksMap()
        {
            _ = HasKey(i => i.feedbackID);
            ToTable("tblfeedbacks");

        }
    }
}