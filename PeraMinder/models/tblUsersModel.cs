using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PeraMinder.Models
{
    public class tblUsersModel
    {
        public int userID { get; set; }
        public string fName { get; set; }
        public string lName { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
    }
}