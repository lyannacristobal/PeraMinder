app.service("PeraMinderService", ['$http', function ($http) {
    // User & Registration
    this.submitFunc = function (userData) {
        return $http({
            method: 'POST',
            url: '/Home/AddUser',
            data: userData
        });
    };

    this.addUser = function (userData) {
        return $http({
            method: 'POST',
            url: '/Home/AddUser',
            data: userData
        });
    };

    this.getUsers = function () {
        return $http({
            method: 'GET',
            url: '/Home/GetUsers'
        });
    };

    this.updateUser = function (user) {
        return $http.post('/Home/UpdateUser', user);
    };

    this.deleteUser = function (userID) {
        return $http({
            method: 'POST',
            url: '/Home/DeleteUser',
            data: { userID: userID },
        });
    };

    //Login & Logout

    this.loginFunc = function (loginData) {
        return $http({
            method: 'POST',
            url: '/Home/ValidateUser',
            data: loginData
        });
    };

    this.logoutFunc = function () {
        return $http.post('/Home/Logout');
    };

    this.getSessionData = function () {
        return $http.get('/Home/GetSessionData');
    };



    // Feedback Management
    this.submitFeedback = function (feedbackData) {
        return $http({
            method: 'POST',
            url: '/Home/AddFeedback',
            data: feedbackData
        }).then(function (response) {
            return response.data;
        }, function (error) {
            return { success: false, message: 'There was an issue with your request.' };
        });
    };

    this.getFeedbacks = function () {
        return $http({
            method: 'GET',
            url: '/Home/GetFeedbacks'
        });
    };


    this.updateFeedback = function (feedbackData) {
        if (!feedbackData || !feedbackData.feedbackID) {
            return Promise.reject("Invalid feedback data provided.");
        }
        return $http({
            method: 'POST',
            url: '/Home/UpdateFeedback',
            headers: {
                'Content-Type': 'application/json'
            },
            data: feedbackData
        })
            .then(function (response) {
              
                if (response.data && response.data.success) {
                    return response.data; // Return success response
                } else {
                    return Promise.reject(response.data.message || "Feedback update failed.");
                }
            })
            .catch(function (error) {
                return Promise.reject("An error occurred while updating feedback. Please try again later.");
            });
    };

    this.deleteFeedback = function (feedbackID) {
        if (!feedbackID) {
            return Promise.reject("Invalid feedbackID.");
        }

        return $http({
            method: 'POST',
            url: '/Home/DeleteFeedback', 
            headers: {
                'Content-Type': 'application/json',
            },
            data: { feedbackID: feedbackID }, 
        }).then(function (response) {
            return response; 
        }).catch(function (error) {
            return Promise.reject("An error occurred while attempting to delete feedback.");
        });
    };

    // Admin Management


    this.addAdmin = function (adminData) {
        return $http({
            method: 'POST',
            url: '/Home/AddAdmin',
            data: adminData
        });
    };


    this.getAdmins = function () {
        return $http({
            method: 'GET',
            url: '/Home/GetAdmins',
        });
    };

    this.updateAdmin = function (adminData) {
        if (!adminData || !adminData.adminID) {
            return Promise.reject("Invalid admin data provided.");
        }
        return $http({
            method: 'POST',
            url: '/Home/UpdateAdmin', 
            headers: {
                'Content-Type': 'application/json',
            },
            data: adminData,
        })
            .then(function (response) {
                if (response.data && response.data.success) {
                    return response.data; 
                } else {
                    return Promise.reject(response.data.message || "Admin update failed.");
                }
            })
            .catch(function (error) {
                return Promise.reject("An error occurred while updating admin. Please try again later.");
            });
    };

    this.deleteAdmin = function (adminID) {
        if (!adminID) {
            return Promise.reject("Invalid adminID.");
        }

        return $http({
            method: 'POST',
            url: '/Home/DeleteAdmin', 
            headers: {
                'Content-Type': 'application/json', 
            },
            data: { adminID: adminID },
        })
            .then(function (response) {
                if (response.data && response.data.success) {
                    return response.data; 
                } else {
                    return Promise.reject(response.data.message || "Admin deletion failed.");
                }
            })
            .catch(function (error) {
                return Promise.reject("An error occurred while attempting to delete admin.");
            });
    };

    // ===== Transactions ======

    this.getTransactions = function (userID) {
        return $http({
            method: 'GET',
            url: '/Home/GetTransactions',
            params: { userID: userID } 
        });
    };

    this.addTransaction = function (transactionData) {
        return $http({
            method: 'POST',
            url: '/Home/AddTransaction',
            data: transactionData
        });
    };

    this.updateTransaction = function (transactionData) {
        return $http({
            method: 'POST',
            url: '/Home/UpdateTransaction',
            data: transactionData
        });
    };

    this.deleteTransaction = function (transactionID) {
        return $http({
            method: 'POST',
            url: '/Home/DeleteTransaction',
            data: { transactionID: transactionID },
        });
    };
    this.getSummary = function (period) {
        return $http.get('/Home/GetTransactionSummary', {
            params: { period: period }
        }).then(function (response) {
            return response;
        }).catch(function (error) {
            throw error;
        });
    };

    this.getMonthlyExpenseBreakdown = function (month, year) {
        return $http.get('/Home/GetMonthlyExpenseBreakdown', {
            params: { month: month, year: year }
        }).then(function (response) {
            return response;
        }).catch(function (error) {
            throw error;
        });
    };


    this.getCategoryTrends = function (period) {
        return $http.get('/Home/GetCategoryTrends', {
            params: { period: period }
        }).then(function (response) {
            return response;
        }).catch(function (error) {
            throw error;
        });
    };


    this.getIncomeExpenseData = function (period) {
        return $http({
            method: 'GET',
            url: '/Home/GetIncomeExpenseData', // This must match the backend route
            params: { period: period },
        });
    };

    // === ADMIN CHARTS

    this.getUserGrowth = function (period) {
        return $http.get('/Home/GetUserGrowth', {
            params: { period: period }
        }).then(function (response) {
            return response;
        }).catch(function (error) {
            throw error;
        });
    };



    this.getFeedbackGrowth = function (period) {
        return $http.get('/Home/GetFeedbackGrowth', { params: { period } }); // Directly use the string
    };

    this.getAdminUserRatio = function () {
        return $http.get('/Home/GetAdminUserRatio') 
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                throw error;
            });
    };

    this.getCounts = function () {
        return $http.get('/Home/GetCounts');
    };

    this.getUserID = function () {
        return $http.get('/Home/GetUserID');
    };


}]);

