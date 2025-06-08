using Google.Protobuf.WellKnownTypes;
using PeraMinder.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static System.Net.WebRequestMethods;

namespace PeraMinder.Controllers
{
    public class HomeController : Controller
    {
        private object adminData;

        public ActionResult Index()
        {
            return View();
        }

   

        public ActionResult LandingNavbar()
        {
            return View();
        }
        public ActionResult RegistrationPage()
        {
            return View();
        }

        public ActionResult ContactPage()
        {
            return View();
        }

        public ActionResult WhyUs()
        {
            return View();
        }

        public ActionResult LoginPage()
        {
            return View();
        }

        public ActionResult Features()
        {
            return View();
        }

        public ActionResult NavLogged()
        {
            return View();
        }


        public ActionResult Test()
        {
            return View();
        }
        public ActionResult Dashboard()
        {
            try
            {
                if (Session["FirstName"] != null)
                {
                    ViewBag.FirstName = Session["FirstName"].ToString();
                }
                else
                {
                    Session["FirstName"] = "Guest";
                    ViewBag.FirstName = "Guest";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in Dashboard Action: " + ex.Message);
                ViewBag.FirstName = "Guest";
            }

            return View();
        }



        public ActionResult AdminDashboard()
        {
            return View();
        }

        public ActionResult UserManagement()
        {
            return View();
        }

        public ActionResult Transactions()
        {
            return View();
        }


        public ActionResult AdminManagement()
        {
            return View();
        }

        public ActionResult FeedbackManagement()
        {
            return View();
        }
        public new ActionResult Profile() => View();


        [HttpPost]
        public JsonResult AddUser(tblUsersModel registrationData)
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    // Log the incoming request
                    Console.WriteLine("Attempting to add user with email: " + registrationData.email);

                    // Check for duplicate email (case-insensitive)
                    var existingUser = db.tblusers
                        .AsNoTracking() // Prevents unnecessary tracking for read-only queries
                        .FirstOrDefault(u => u.email.ToLower() == registrationData.email.ToLower());

                    if (existingUser != null)
                    {
                        Console.WriteLine("Duplicate email detected: " + registrationData.email);
                        return Json(new { success = false, message = "Email is already taken!" });
                    }

                    // Create new user
                    var userData = new tblUsersModel()
                    {
                        fName = registrationData.fName.Trim(),
                        lName = registrationData.lName.Trim(),
                        email = registrationData.email.Trim(),
                        password = registrationData.password, // Assuming plaintext for now
                        createdAt = DateTime.Now,
                        updatedAt = DateTime.Now
                    };

                    // Add user to the database
                    db.tblusers.Add(userData);

                    // Save changes to the database
                    db.SaveChanges();
                    Console.WriteLine("User successfully added: " + registrationData.email);
                    return Json(new { success = true, message = "Welcome to PeraMinder!" });
                }
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine("Database error: " + ex.InnerException?.Message);

                // Handle unique constraint violation
                if (IsUniqueConstraintViolation(ex))
                {
                    return Json(new { success = false, message = "Email is already taken!" });
                }

                return Json(new { success = false, message = "A database error occurred. Please contact support." });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Unexpected error: " + ex.Message);
                return Json(new { success = false, message = "An unexpected error occurred. Please try again." });
            }
        }

        private bool IsUniqueConstraintViolation(DbUpdateException ex)
        {
            if (ex.InnerException is SqlException sqlEx)
            {
                // SQL Server error codes for unique constraint violations
                return sqlEx.Number == 2627 || sqlEx.Number == 2601;
            }

            return false;
        }


        //Feedbacks Logic
        [HttpPost]
        public JsonResult AddFeedback(tblFeedbacksModel feedbackData)
        {
            try
            {

                using (var db = new PeraMinderContext())
                {
                    var feedback = new tblFeedbacksModel()
                    {
                        fullName = feedbackData.fullName,
                        email = feedbackData.email,
                        message = feedbackData.message,
                        createdAt = DateTime.Now
                    };

                    db.tblfeedbacks.Add(feedback);
                    db.SaveChanges();
                }

                return Json(new { success = true, message = "Feedback submitted successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message });
            }
        }

        // Login
        [HttpPost]
        public JsonResult ValidateUser(string email, string password)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                {
                    return Json(new { success = false, message = "Email and password are required." });
                }

                // Hardcoded admin credentials
                const string hardcodedAdminEmail = "admin@peraminder.com";
                const string hardcodedAdminPassword = "Admin123";

                if (email.Equals(hardcodedAdminEmail, StringComparison.OrdinalIgnoreCase) && password == hardcodedAdminPassword)
                {
                    Session["UserID"] = -1;
                    Session["FirstName"] = "Hardcoded Admin";
                    Session["IsAdmin"] = true;

                    return Json(new { success = true, message = "System account login successful.", isAdmin = true });
                }

                using (var db = new PeraMinderContext())
                {
                    var admin = db.tbladmin.FirstOrDefault(a =>
                        a.email.ToLower() == email.ToLower() && a.password == password);

                    if (admin != null)
                    {
                        // Set session variables for logged-in admin
                        Session["UserID"] = admin.adminID;
                        Session["FirstName"] = admin.fName;
                        Session["IsAdmin"] = true;

                        return Json(new { success = true, message = "Admin login successful!", isAdmin = true });
                    }

                    // Validate regular users
                    var user = db.tblusers.FirstOrDefault(u =>
                        u.email.ToLower() == email.ToLower() && u.password == password);

                    if (user != null)
                    {
                        // Set session variables for logged-in user
                        Session["UserID"] = user.userID;
                        Session["FirstName"] = user.fName;
                        Session["IsAdmin"] = false;

                        return Json(new { success = true, message = "Login successful!", isAdmin = false });
                    }

                    return Json(new { success = false, message = "Invalid email or password!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred during login." });
            }
        }


        //logout
        [HttpPost]
        public JsonResult Logout()
        {
            try
            {

                // Ensure session exists before clearing
                if (Session != null)
                {
                    Session.Clear();
                    Session.Abandon();
                }
                else
                {
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                // Log the exact error
                return Json(new { success = false, message = "An error occurred during logout. Please try again later." });
            }
        }

        [HttpGet]
        public JsonResult GetSessionData()
        {
            try
            {
                var firstName = Session["FirstName"]?.ToString() ?? "Guest";
                return Json(new { success = true, firstName }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred." }, JsonRequestBehavior.AllowGet);
            }
        }




        //User Management

        [HttpGet]
        public JsonResult GetUsers()
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    var users = db.tblusers.Select(u => new
                    {
                        userID = u.userID, // Ensure userID is included
                        u.fName,
                        u.lName,
                        u.email,
                        u.createdAt,
                        u.updatedAt
                    }).ToList();

                    return Json(new { success = true, data = users }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }



        [HttpPost]
        public JsonResult UpdateUser(tblUsersModel updateData)
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    var user = db.tblusers.FirstOrDefault(u => u.userID == updateData.userID);
                    if (user != null)
                    {
                        user.fName = updateData.fName;
                        user.lName = updateData.lName;
                        user.email = updateData.email;
                        user.updatedAt = DateTime.Now;

                        db.SaveChanges();
                        return Json(new { success = true, message = "User updated successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = $"User not found for userID {updateData.userID}" });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        [HttpPost]
        public JsonResult DeleteUser(int userID)
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    var user = db.tblusers.FirstOrDefault(u => u.userID == userID);
                    if (user != null)
                    {
                        db.tblusers.Remove(user);
                        db.SaveChanges();
                        return Json(new { success = true, message = "User deleted successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = $"User with ID {userID} not found!" });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message });
            }
        }

        //Feedback Management

        [HttpGet]
        public JsonResult GetFeedbacks()
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    var feedbacks = db.tblfeedbacks.Select(f => new
                    {
                        feedbackID = f.feedbackID,
                        f.fullName,
                        f.email,
                        f.message,
                        f.createdAt
                    }).ToList();

                    return Json(new { success = true, data = feedbacks }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }




        [HttpPost]
        public JsonResult UpdateFeedback(tblFeedbacksModel feedbackData)
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    var feedback = db.tblfeedbacks.FirstOrDefault(f => f.feedbackID == feedbackData.feedbackID);
                    if (feedback != null)
                    {
                        feedback.fullName = feedbackData.fullName;
                        feedback.email = feedbackData.email;
                        feedback.message = feedbackData.message;
                        feedback.updatedAt = DateTime.Now;

                        db.SaveChanges();
                        return Json(new { success = true, message = "Feedback updated successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Feedback not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteFeedback(int feedbackID)
        {
            try
            {
                if (feedbackID <= 0)
                {
                    return Json(new { success = false, message = "Invalid feedback ID." });
                }

                using (var db = new PeraMinderContext())
                {
                    var feedback = db.tblfeedbacks.FirstOrDefault(f => f.feedbackID == feedbackID);
                    if (feedback != null)
                    {
                        db.tblfeedbacks.Remove(feedback);
                        db.SaveChanges();
                        return Json(new { success = true, message = "Feedback deleted successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Feedback not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                System.Diagnostics.Debug.WriteLine($"Error deleting feedback: {ex.Message}");
                return Json(new { success = false, message = "An error occurred while deleting feedback." });
            }
        }

        // ===== Admin Management =====

        [HttpGet]
        public JsonResult GetAdmins()
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    var admins = db.tbladmin.Select(a => new
                    {
                        adminID = a.adminID,
                        a.fName,
                        a.lName,
                        a.email,
                        a.createdAt,
                        a.updatedAt
                    }).ToList();

                    return Json(new { success = true, data = admins }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult AddAdmin(tblAdminModel adminData)
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    var newAdmin = new tblAdminModel()
                    {
                        fName = adminData.fName,
                        lName = adminData.lName,
                        email = adminData.email,
                        password = adminData.password,
                        createdAt = DateTime.Now,
                        updatedAt = DateTime.Now
                    };

                    db.tbladmin.Add(newAdmin);
                    db.SaveChanges();

                    return Json(new { success = true, message = "Admin added successfully!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }




        [HttpPost]
        public JsonResult UpdateAdmin(tblAdminModel adminData)
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    var admin = db.tbladmin.FirstOrDefault(a => a.adminID == adminData.adminID);
                    if (admin != null)
                    {
                        admin.fName = adminData.fName;
                        admin.lName = adminData.lName;
                        admin.email = adminData.email;
                        admin.updatedAt = DateTime.Now;

                        db.SaveChanges();
                        return Json(new { success = true, message = "Admin updated successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Admin not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult DeleteAdmin(int adminID)
        {
            try
            {
                if (adminID <= 0)
                {
                    return Json(new { success = false, message = "Invalid admin ID." });
                }

                using (var db = new PeraMinderContext())
                {
                    var admin = db.tbladmin.FirstOrDefault(a => a.adminID == adminID);
                    if (admin != null)
                    {
                        db.tbladmin.Remove(admin);
                        db.SaveChanges();
                        return Json(new { success = true, message = "Admin deleted successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Admin not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while deleting admin." });
            }
        }

        // ========= Transactions Page =========

        [HttpGet]
        public JsonResult GetTransactions()
        {
            try
            {
                // Validate Session
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, message = "User is not logged in." }, JsonRequestBehavior.AllowGet);
                }

                int userID = (int)Session["UserID"];

                using (var db = new PeraMinderContext())
                {
                    var transactions = (from t in db.tbltransactions
                                        join c in db.tblcategory on t.categoryID equals c.categoryID into categoryGroup
                                        from c in categoryGroup.DefaultIfEmpty()
                                        join pm in db.tblpaymentmethods on t.paymentMethodID equals pm.paymentMethodID into paymentMethodGroup
                                        from pm in paymentMethodGroup.DefaultIfEmpty()
                                        join tt in db.tbltransactiontype on t.transactionTypeID equals tt.transactionTypeID into transactionTypeGroup
                                        from tt in transactionTypeGroup.DefaultIfEmpty()
                                        where t.userID == userID
                                        select new
                                        {
                                            transactionID = t.transactionID, // Internal use
                                            transactionDate = t.transactionDate,
                                            categoryID = c != null ? c.categoryID : (int?)null,
                                            autoCategoryType = c != null ? c.categoryName : "Uncategorized",
                                            paymentMethodID = pm != null ? pm.paymentMethodID : (int?)null,
                                            autoPaymentMethodName = pm != null ? pm.paymentMethodName : "Unknown Payment Method",
                                            transactionTypeID = tt != null ? tt.transactionTypeID : (int?)null,
                                            autoTransactionTypeName = tt != null ? tt.transactionTypeName : "Unknown Transaction Type",
                                            amount = t.amount,
                                            notes = t.notes,
                                            createdAt = t.createdAt, // Internal use
                                            updatedAt = t.updatedAt  // Internal use
                                        }).ToList();


                    return Json(new { success = true, data = transactions }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred while fetching transactions: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AddTransaction(tblTransactionsModel transactionData)
        {
            try
            {
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, message = "User is not logged in." });
                }

                using (var db = new PeraMinderContext())
                {
                    var newTransaction = new tblTransactionsModel
                    {
                        userID = (int)Session["UserID"],
                        transactionDate = transactionData.transactionDate,
                        categoryID = transactionData.categoryID,
                        paymentMethodID = transactionData.paymentMethodID,
                        transactionTypeID = transactionData.transactionTypeID,
                        amount = transactionData.amount,
                        notes = transactionData.notes,
                        createdAt = DateTime.Now,
                        updatedAt = DateTime.Now
                    };

                    db.tbltransactions.Add(newTransaction);
                    db.SaveChanges();

                    return Json(new { success = true, message = "Transaction added successfully!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message });
            }
        }



        [HttpGet]
        public JsonResult GetUserID()
        {
            if (Session["UserID"] == null)
            {
                Console.WriteLine("GetUserID: Session UserID is null.");
                return Json(new { success = false, message = "User is not logged in." }, JsonRequestBehavior.AllowGet);
            }

            int userID = (int)Session["UserID"];
            Console.WriteLine($"GetUserID: Returning UserID {userID}");
            return Json(new { success = true, userID = userID }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult UpdateTransaction(tblTransactionsModel transactionData)
        {
            try
            {
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, message = "User is not logged in." });
                }

                using (var db = new PeraMinderContext())
                {
                    var transaction = db.tbltransactions.FirstOrDefault(t => t.transactionID == transactionData.transactionID);
                    if (transaction == null)
                    {
                        return Json(new { success = false, message = "Transaction not found." });
                    }

                    transaction.transactionDate = transactionData.transactionDate;
                    transaction.categoryID = transactionData.categoryID;
                    transaction.paymentMethodID = transactionData.paymentMethodID;
                    transaction.transactionTypeID = transactionData.transactionTypeID;
                    transaction.amount = transactionData.amount;
                    transaction.notes = transactionData.notes;
                    transaction.updatedAt = DateTime.Now;

                    db.SaveChanges();

                    return Json(new { success = true, message = "Transaction updated successfully!" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message });
            }
        }

        [HttpPost]
        [Route("Home/DeleteTransaction")]
        public JsonResult DeleteTransaction(int transactionID)
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    var transaction = db.tbltransactions.FirstOrDefault(t => t.transactionID == transactionID);
                    if (transaction != null)
                    {
                        db.tbltransactions.Remove(transaction);
                        db.SaveChanges();
                        return Json(new { success = true, message = "Transaction deleted successfully!" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Transaction not found." });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message });
            }
        }

        // == Transaction Summary

        [HttpGet]
        public JsonResult GetTransactionSummary(string period)
        {
            try
            {
                // Ensure the user is logged in
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, message = "User is not logged in." }, JsonRequestBehavior.AllowGet);
                }

                int userID = (int)Session["UserID"];
                DateTime now = DateTime.Now;
                DateTime startDate = now;
                DateTime endDate = now;

                // Calculate the date range based on the period
                if (string.IsNullOrWhiteSpace(period))
                {
                    return Json(new { success = false, message = "Period is required." }, JsonRequestBehavior.AllowGet);
                }

                switch (period.ToLower())
                {
                    case "daily":
                        startDate = now.Date;
                        endDate = now.Date.AddDays(1).AddTicks(-1);
                        break;

                    case "weekly":
                        int offset = (int)now.DayOfWeek;
                        startDate = now.AddDays(-offset).Date; // Start of the week (Sunday)
                        endDate = startDate.AddDays(7).AddTicks(-1); // End of the week (Saturday)
                        break;

                    case "monthly":
                        startDate = new DateTime(now.Year, now.Month, 1); // First day of the month
                        endDate = startDate.AddMonths(1).AddTicks(-1);    // Last day of the month
                        break;

                    case "yearly":
                        startDate = new DateTime(now.Year, 1, 1);         // Start of the year
                        endDate = new DateTime(now.Year + 1, 1, 1).AddTicks(-1); // End of the year
                        break;

                    default:
                        return Json(new { success = false, message = "Invalid period." }, JsonRequestBehavior.AllowGet);
                }

                using (var db = new PeraMinderContext())
                {
                    // Filter transactions for the user and date range
                    var transactions = db.tbltransactions
                        .Where(t => t.userID == userID && t.transactionDate >= startDate && t.transactionDate <= endDate)
                        .GroupBy(t => t.transactionTypeID)
                        .Select(g => new
                        {
                            TransactionTypeID = g.Key,
                            TotalAmount = g.Sum(t => t.amount)
                        }).ToList();

                    // Calculate totals
                    var totalIncome = transactions.FirstOrDefault(t => t.TransactionTypeID == 1)?.TotalAmount ?? 0;
                    var totalExpenses = transactions.FirstOrDefault(t => t.TransactionTypeID == 2)?.TotalAmount ?? 0;
                    var balance = totalIncome - totalExpenses;

                    // Return the response
                    return Json(new
                    {
                        success = true,
                        period,
                        totalIncome,
                        totalExpenses,
                        balance
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        // == CHarts
        [HttpGet]
        public JsonResult GetIncomeExpenseData(string period)
        {
            try
            {
                // Check if the user is logged in
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, message = "User is not logged in." }, JsonRequestBehavior.AllowGet);
                }

                int userID = (int)Session["UserID"];
                DateTime now = DateTime.Now;
                DateTime startDate = now;
                DateTime endDate = now;

                // Define the date range based on the period
                if (period.Equals("monthly", StringComparison.OrdinalIgnoreCase))
                {
                    startDate = new DateTime(now.Year, now.Month, 1);
                    endDate = startDate.AddMonths(1);
                }
                else if (period.Equals("weekly", StringComparison.OrdinalIgnoreCase))
                {
                    int offset = now.DayOfWeek - DayOfWeek.Sunday;
                    startDate = now.Date.AddDays(-offset);
                    endDate = startDate.AddDays(7);
                }
                else if (period.Equals("daily", StringComparison.OrdinalIgnoreCase))
                {
                    startDate = now.Date;
                    endDate = now.Date.AddDays(1);
                }

                using (var db = new PeraMinderContext())
                {
                    // Filter transactions by the logged-in user's ID and date range
                    var incomeExpenseData = db.tbltransactions
                        .Where(t => t.userID == userID && t.transactionDate >= startDate && t.transactionDate < endDate)
                        .GroupBy(t => t.transactionTypeID) // 1 = Income, 2 = Expense
                        .Select(g => new
                        {
                            TransactionTypeID = g.Key,
                            TotalAmount = g.Sum(t => t.amount)
                        }).ToList();

                    var totalIncome = incomeExpenseData.FirstOrDefault(t => t.TransactionTypeID == 1)?.TotalAmount ?? 0;
                    var totalExpense = incomeExpenseData.FirstOrDefault(t => t.TransactionTypeID == 2)?.TotalAmount ?? 0;

                    return Json(new
                    {
                        success = true,
                        data = new
                        {
                            Income = totalIncome,
                            Expense = totalExpense
                        }
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetIncomeExpenseData: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return Json(new { success = false, message = "An error occurred: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult GetMonthlyExpenseBreakdown(int month, int year)
        {
            try
            {
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, message = "User is not logged in." }, JsonRequestBehavior.AllowGet);
                }

                int userID = (int)Session["UserID"];

                using (var db = new PeraMinderContext())
                {
                    var breakdown = db.tbltransactions
                        .Where(t => t.userID == userID && t.transactionDate.Month == month && t.transactionDate.Year == year && t.transactionTypeID == 2) // Only expenses
                        .GroupBy(t => t.categoryID)
                        .Select(g => new
                        {
                            categoryName = db.tblcategory.FirstOrDefault(c => c.categoryID == g.Key).categoryName,
                            totalAmount = g.Sum(t => t.amount)
                        })
                        .ToList();

                    return Json(new { success = true, data = breakdown }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetCategoryTrends(string period)
        {
            try
            {
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, message = "User is not logged in." }, JsonRequestBehavior.AllowGet);
                }

                int userID = (int)Session["UserID"];
                using (var db = new PeraMinderContext())
                {
                    DateTime startDate = DateTime.Now;
                    DateTime endDate = DateTime.Now;

                    if (period.Equals("weekly", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = DateTime.Now.AddDays(-7); // Last 7 days
                    }
                    else if (period.Equals("monthly", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = DateTime.Now.AddMonths(-1); // Last month
                    }
                    else
                    {
                        return Json(new { success = false, message = "Invalid period." }, JsonRequestBehavior.AllowGet);
                    }

                    var trends = db.tbltransactions
                        .Where(t => t.userID == userID && t.transactionDate >= startDate && t.transactionDate <= endDate && t.transactionTypeID == 2)
                        .GroupBy(t => new { t.categoryID, t.transactionDate.Month })
                        .Select(g => new
                        {
                            categoryID = g.Key.categoryID,
                            month = g.Key.Month,
                            categoryName = db.tblcategory.FirstOrDefault(c => c.categoryID == g.Key.categoryID).categoryName,
                            totalAmount = g.Sum(t => t.amount)
                        })
                        .ToList();

                    var groupedData = trends
                        .GroupBy(t => t.categoryID)
                        .Select(g => new
                        {
                            categoryName = g.First().categoryName,
                            amounts = g.Select(t => t.totalAmount).ToList()
                        })
                        .ToList();

                    var timePeriods = trends
                        .Select(t => t.month)
                        .Distinct()
                        .OrderBy(m => m)
                        .ToList();

                    return Json(new { success = true, data = groupedData, timePeriods = timePeriods }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }




        // === ADMIN CHARTS

        [HttpGet]
        public JsonResult GetUserGrowth(string period)
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    DateTime startDate = DateTime.Now;
                    DateTime endDate = DateTime.Now;

                    // Define the date range based on the period
                    if (period.Equals("daily", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = DateTime.Now.AddDays(-7); // Last 7 days
                    }
                    else if (period.Equals("weekly", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = DateTime.Now.AddDays(-30); // Last 30 days
                    }
                    else if (period.Equals("monthly", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = DateTime.Now.AddMonths(-6); // Last 6 months
                    }
                    else
                    {
                        return Json(new { success = false, message = "Invalid period." }, JsonRequestBehavior.AllowGet);
                    }

                    // Fetch raw data from the database
                    var rawUserData = db.tblusers
                        .Where(u => u.createdAt >= startDate && u.createdAt <= endDate)
                        .Select(u => new { u.createdAt }) // Only fetch the creation date
                        .ToList(); // Bring the data into memory for processing

                    // Perform in-memory grouping
                    IEnumerable<dynamic> groupedData;

                    if (period.Equals("daily", StringComparison.OrdinalIgnoreCase))
                    {
                        groupedData = rawUserData
                            .GroupBy(u => u.createdAt.Date) // Group by date
                            .Select(g => new
                            {
                                Date = g.Key.ToString("yyyy-MM-dd"), // Format as YYYY-MM-DD
                                UserCount = g.Count()
                            });
                    }
                    else if (period.Equals("weekly", StringComparison.OrdinalIgnoreCase))
                    {
                        groupedData = rawUserData
                            .GroupBy(u => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
                                u.createdAt, CalendarWeekRule.FirstDay, DayOfWeek.Sunday)) // Group by week number
                            .Select(g => new
                            {
                                Date = $"Week {g.Key}",
                                UserCount = g.Count()
                            });
                    }
                    else // Monthly
                    {
                        groupedData = rawUserData
                            .GroupBy(u => new { u.createdAt.Year, u.createdAt.Month }) // Group by year and month
                            .Select(g => new
                            {
                                Date = $"{g.Key.Month}/{g.Key.Year}", // Format as MM/YYYY
                                UserCount = g.Count()
                            });
                    }

                    // Convert grouped data to a list and sort by date
                    var sortedData = groupedData
                        .OrderBy(g => g.Date)
                        .ToList();

                    return Json(new { success = true, data = sortedData }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetAdminUserRatio()
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    int adminCount = db.tbladmin.Count();
                    int userCount = db.tblusers.Count();

                    return Json(new
                    {
                        success = true,
                        data = new
                        {
                            AdminCount = adminCount,
                            UserCount = userCount
                        }
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public JsonResult GetFeedbackGrowth(string period)
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    DateTime now = DateTime.Now;
                    DateTime startDate;

                    // Define the date range based on the period
                    if (period.Equals("daily", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = now.AddDays(-7); // Last 7 days
                    }
                    else if (period.Equals("weekly", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = now.AddDays(-30); // Last 30 days
                    }
                    else if (period.Equals("monthly", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = now.AddMonths(-6); // Last 6 months
                    }
                    else
                    {
                        return Json(new { success = false, message = "Invalid period." }, JsonRequestBehavior.AllowGet);
                    }

                    var rawFeedbackData = db.tblfeedbacks
                        .Where(f => f.createdAt >= startDate && f.createdAt <= now)
                        .Select(f => f.createdAt)
                        .ToList();

                    IEnumerable<dynamic> groupedData;

                    if (period.Equals("daily", StringComparison.OrdinalIgnoreCase))
                    {
                        groupedData = rawFeedbackData
                            .GroupBy(date => date.Date) // Group by date
                            .Select(g => new
                            {
                                Date = g.Key.ToString("yyyy-MM-dd"), // Format as YYYY-MM-DD
                                FeedbackCount = g.Count()
                            });
                    }
                    else if (period.Equals("weekly", StringComparison.OrdinalIgnoreCase))
                    {
                        groupedData = rawFeedbackData
                            .GroupBy(date => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
                                date, CalendarWeekRule.FirstDay, DayOfWeek.Sunday)) // Group by week number
                            .Select(g => new
                            {
                                Date = $"Week {g.Key}",
                                FeedbackCount = g.Count()
                            });
                    }
                    else // Monthly
                    {
                        groupedData = rawFeedbackData
                            .GroupBy(date => new { date.Year, date.Month }) // Group by year and month
                            .Select(g => new
                            {
                                Date = $"{g.Key.Month}/{g.Key.Year}", // Format as MM/YYYY
                                FeedbackCount = g.Count()
                            });
                    }

                    var sortedData = groupedData.OrderBy(g => g.Date).ToList();

                    return Json(new { success = true, data = sortedData }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
        }



        [HttpGet]
        public JsonResult GetCounts()
        {
            try
            {
                using (var db = new PeraMinderContext())
                {
                    int userCount = db.tblusers.Count();
                    int adminCount = db.tbladmin.Count();
                    int feedbackCount = db.tblfeedbacks.Count();

                    Console.WriteLine($"UserCount: {userCount}, AdminCount: {adminCount}, FeedbackCount: {feedbackCount}");

                    return Json(new
                    {
                        success = true,
                        data = new
                        {
                            UserCount = userCount,
                            AdminCount = adminCount,
                            FeedbackCount = feedbackCount
                        }
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in GetCounts: " + ex.Message);
                return Json(new { success = false, message = "An error occurred: " + ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}






