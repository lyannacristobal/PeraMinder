using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PeraMinder.Models
{
    public class tblFeedbacksModel
    {
        public int feedbackID { get; set; }
        public string fullName { get; set; }
        public string email { get; set; }
        public string message { get; set; }
      
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }

    }
}