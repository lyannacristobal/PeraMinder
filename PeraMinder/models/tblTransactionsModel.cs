using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PeraMinder.Models
{
    public class tblTransactionsModel
    {
        public int transactionID { get; set; }
        public int userID { get; set; }
        public DateTime transactionDate { get; set; }
        public int categoryID { get; set; }
        public int paymentMethodID { get; set; }
        public int transactionTypeID { get; set; }
        public decimal amount { get; set; }
        public string notes { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }

    }
}