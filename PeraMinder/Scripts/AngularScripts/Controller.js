app.controller("PeraMinderController", function ($scope, $window, $http, $timeout, PeraMinderService) {
    $scope.usersData = [];
    $scope.selectedUser = {};
    $scope.adminsData = [];
    $scope.selectedAdmin = {};
    $scope.admin = {};



    $scope.cancelFunc = function () {
        $scope.fName = null;
        $scope.lName = null;
        $scope.email= null;
        $scope.password = null;
        $scope.confirmPassword = null;
        $scope.uPassword = null;
        $scope.username = null;


    };

    $scope.submitFunc = function () {
        // Perform client-side validation
        if (isFormInvalid()) return;

        // Prepare user data for submission
        var userData = {
            fName: $scope.fName,
            lName: $scope.lName,
            email: $scope.email,
            password: $scope.password
        };

        // Call the service to submit user data
        PeraMinderService.addUser(userData).then(function (response) {
            if (response.data.success) {
                // Show success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome to PeraMinder!',
                    text: response.data.message,
                });
                resetFormFields();
            } else {
                // Show error alert if back-end validation fails (e.g., duplicate email)
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: response.data.message,
                });
            }
        }, function (error) {
            // Handle server or network errors
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred. Please try again later.',
            });
        });
    };

    function isFormInvalid() {
        // Validate first name
        if (!$scope.fName || $scope.fName.trim() === '') {
            showAlert('Missing First Name', 'First Name is required.');
            return true;
        }
        if ($scope.fName.length > 50) {
            showAlert('First Name Too Long', 'First Name must not exceed 50 characters.');
            return true;
        }

        // Validate last name
        if (!$scope.lName || $scope.lName.trim() === '') {
            showAlert('Missing Last Name', 'Last Name is required.');
            return true;
        }
        if ($scope.lName.length > 50) {
            showAlert('Last Name Too Long', 'Last Name must not exceed 50 characters.');
            return true;
        }

        // Validate email
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!$scope.email || $scope.email.trim() === '') {
            showAlert('Missing Email', 'Email is required.');
            return true;
        }
        if (!emailPattern.test($scope.email)) {
            showAlert('Invalid Email', 'Please enter a valid email address.');
            return true;
        }
        if ($scope.email.length > 150) {
            showAlert('Email Too Long', 'Email must not exceed 150 characters.');
            return true;
        }

        // Validate password
        if (!$scope.password || $scope.password.trim() === '') {
            showAlert('Missing Password', 'Password is required.');
            return true;
        }
        if ($scope.password.length < 8) {
            showAlert('Password Too Short', 'Password must be at least 8 characters long.');
            return true;
        }
        if ($scope.password.length > 100) {
            showAlert('Password Too Long', 'Password must not exceed 100 characters.');
            return true;
        }
        var passwordPattern = /^(?=.*[A-Z])(?=.*\d)/;
        if (!passwordPattern.test($scope.password)) {
            showAlert(
                'Weak Password',
                'Password must contain at least one uppercase letter and one number.'
            );
            return true;
        }

        // Validate password confirmation
        if ($scope.password !== document.getElementById("confirmPassword").value) {
            showAlert('Passwords Mismatch', 'Passwords do not match!');
            return true;
        }

        return false;
    }

    function showAlert(title, text) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
        });
    }

    function resetFormFields() {
        $scope.fName = "";
        $scope.lName = "";
        $scope.email = "";
        $scope.password = "";
        document.getElementById("confirmPassword").value = "";
    }


    // ========== Feedback Submission Logic ========== 
    $scope.submitFeedback = function () {
        if (isFeedbackFormInvalid()) return;

        var feedbackData = {
            fullName: $scope.feedback.fullName,
            email: $scope.feedback.email,
            message: $scope.feedback.message
        };

        // Perform client-side validation
        if (!feedbackData.fullName || feedbackData.fullName.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Full Name is required and must not exceed 70 characters.',
            });
            return;
        } else if (feedbackData.fullName.length > 70) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Full Name must not exceed 70 characters.',
            });
            return;
        }

        if (!feedbackData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackData.email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'A valid Email Address is required and must not exceed 150 characters.',
            });
            return;
        } else if (feedbackData.email.length > 150) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Email Address must not exceed 150 characters.',
            });
            return;
        }

        if (!feedbackData.message || feedbackData.message.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Message is required and must not exceed 5000 characters.',
            });
            return;
        } else if (feedbackData.message.length > 5000) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Message must not exceed 5000 characters.',
            });
            return;
        }

        // Submit feedback data to the service
        PeraMinderService.submitFeedback(feedbackData).then(function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thank You!',
                    text: 'Your feedback has been submitted successfully.',
                });
                resetFeedbackForm();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: response.message,
                });
            }
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while submitting your feedback.',
            });
        });
    };

    // Helper function to reset the feedback form
    function resetFeedbackForm() {
        $scope.feedback = {
            fullName: '',
            email: '',
            message: ''
        };
    }

    // Helper function to check if the feedback form is invalid
    function isFeedbackFormInvalid() {
        return false; // Placeholder for additional validations if needed
    }

    function isFeedbackFormInvalid() {
        if (!$scope.feedback.fullName || !$scope.feedback.email || !$scope.feedback.message) {
            showAlert('Missing Fields', 'All fields are required!');
            return true;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($scope.feedback.email)) {
            showAlert('Invalid Email', 'Please enter a valid email address!');
            return true;
        }

        return false;
    }



    function resetFeedbackForm() {
        $scope.feedback = {
            fullName: "",
            email: "",
            message: ""
        };
    }

    // ===== Login Function =======
    $scope.loginFunc = function () {
        if (isLoginFormInvalid()) return;

        var loginData = {
            email: $scope.username,
            password: $scope.uPassword,
        };

        PeraMinderService.loginFunc(loginData).then(
            function (response) {
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: response.data.message,
                    }).then(() => {
                        if (response.data.isAdmin) {
                            $window.location.href = '/Home/AdminDashboard';
                        } else {
                            $window.location.href = '/Home/Dashboard';
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: response.data.message,
                    });
                }
            },
            function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred during login. Please try again later.',
                });
            }
        );
    };



    function isLoginFormInvalid() {
        if (!$scope.username || !$scope.uPassword) {
            showAlert('Missing Fields', 'Both email and password are required!');
            return true;
        }
        return false;
    }


    // ===== Logout Function =======
    $scope.logoutFunc = function () {
        PeraMinderService.logoutFunc().then(
            function (response) {
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Logout Successful',
                        text: response.data.message,
                    }).then(() => {
                        $window.location.href = '/Home/LoginPage';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Logout Failed',
                        text: response.data.message,
                    });
                }
            },
            function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred during logout. Please try again later.',
                });
            }
        );
    };

    $scope.getSessionData = function () {
        PeraMinderService.getSessionData().then(
            function (response) {
                if (response.data.success) {
                    $scope.firstName = response.data.firstName;
                } else {
                    $scope.firstName = "Guest"; // Fallback
                }
            },
            function (error) {
                $scope.firstName = "Guest";
            }
        );
    };

    // Call this function on page load
    $scope.getSessionData();


    // === User ====
    $scope.addUser = function () {
        if (isFormInvalid()) return;

        // Prepare user data for submission
        var userData = {
            fName: $scope.fName,
            lName: $scope.lName,
            email: $scope.email,
            password: $scope.password
        };

        // Call the service to submit user data
        PeraMinderService.addUser(userData).then(function (response) {
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'User added!',
                    text: 'Welcome to PeraMinder!',
                });
                resetFormFields();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to add user',
                    text: response.data.message,
                });
            }
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error occurred',
                text: error.data.message || 'An unexpected error occurred!',
            });
        });
    };

    function isFormInvalid() {
        if (!$scope.fName || !$scope.lName || !$scope.email || !$scope.password) {
            showAlert('Missing Fields', 'All fields are required!');
            return true;
        }

        if ($scope.password.length < 8) {
            showAlert('Password Too Short', 'Password must be at least 8 characters long!');
            return true;
        }

        var passwordPattern = /^(?=.*[A-Z])(?=.*\d)/;
        if (!passwordPattern.test($scope.password)) {
            showAlert('Weak Password', 'Password must contain at least one uppercase letter and one number!');
            return true;
        }

        if ($scope.password !== document.getElementById("confirmPassword").value) {
            showAlert('Passwords Mismatch', 'Passwords do not match!');
            return true;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($scope.email)) {
            showAlert('Invalid Email', 'Please enter a valid email address!');
            return true;
        }

        return false;
    }

    function showAlert(title, text) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
        });
    }

    function resetFormFields() {
        $scope.fName = '';
        $scope.lName = '';
        $scope.email = '';
        $scope.password = '';
        document.getElementById("confirmPassword").value = '';
    }

    function resetFormFields() {
        $scope.fName = "";
        $scope.lName = "";
        $scope.email = "";
        $scope.password = "";
        document.getElementById("confirmPassword").value = "";
    }


$scope.loadUsers = function () {
    PeraMinderService.getUsers().then(function (response) {
        if (response.data.success) {
            $scope.users = response.data.data;
            if (window.location.pathname === "/Home/UserManagement") { 
            }
            $scope.$applyAsync(() => {
                initializeDataTable(); 
            });
        } else {
        }
    }, function (error) {
    });
};

// Function to initialize DataTable
    function initializeDataTable() {
        if (window.location.pathname === "/Home/UserManagement") { // Restrict to User Management page
            if (typeof $ !== 'undefined' && $.fn.DataTable) {
                setTimeout(function () {
                    $('#myTable').DataTable({
                        destroy: true, // Destroy any existing instance before reinitializing
                        paging: true,
                        searching: true,
                        ordering: true,
                        responsive: true,
                        autoWidth: false, // Prevent resizing issues
                        fixedHeader: true, // Keep header fixed
                        columns: [
                            { title: "First Name" },
                            { title: "Last Name" },
                            { title: "Email" },
                            {
                                title: "Created At",
                                data: "createdAt",
                                render: function (data, type, row) {
                                    if (type === 'display' && data) {
                                        try {
                                            // Extract the timestamp from the .NET date format
                                            const match = data.match(/\/Date\((\d+)\)\//);
                                            if (match) {
                                                const timestamp = parseInt(match[1], 10); // Extract timestamp in milliseconds
                                                const date = new Date(timestamp); // Convert to JavaScript Date

                                                // Format the date as "MMM DD YYYY"
                                                const options = { month: 'short', day: 'numeric', year: 'numeric' };
                                                return date.toLocaleDateString('en-US', options).replace(',', '');
                                            }
                                            return "Invalid Date"; // Fallback for invalid formats
                                        } catch (error) {
                                            return "Invalid Date";
                                        }
                                    }
                                    return data || "No Date"; // Fallback for non-display types
                                }
                            },
                            { title: "Actions", orderable: false }
                        ],
                        columnDefs: [
                            { width: '20%', targets: 0 }, // Adjust first column
                            { width: '20%', targets: 1 }, // Adjust second column
                            { width: '25%', targets: 2 }, // Adjust third column
                            { width: '10%', targets: 3 }, // Adjust fourth column
                            { width: '15%', targets: 4 }  // Make the last column larger
                        ]
                    });
                }, 0);
            } else {
            }
        }
    }



    // Edit User Function
    $scope.editUser = function (user) {
        if (!user) {
            return;
        }
        $scope.editUserID = user.userID;
        $scope.editFName = user.fName;
        $scope.editLName = user.lName;
        $scope.editEmail = user.email;

        // Open modal
        $('#editModal').modal('open');
    };

    // Update User Function
    $scope.updateUser = function () {
        const updatedUser = {
            userID: $scope.editUserID,
            fName: $scope.editFName,
            lName: $scope.editLName,
            email: $scope.editEmail,
        };


        PeraMinderService.updateUser(updatedUser).then(function (response) {
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                });
                $scope.loadUsers(); // Reload users
                $('#editModal').modal('close'); // Close modal
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
            }
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not update user: ' + error.data.message,
            });
        });
    };


    //Delete User
    $scope.deleteUser = function (userID) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                PeraMinderService.deleteUser(userID).then(function (response) {
                    if (response.data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: response.data.message,
                        });
                        $scope.loadUsers(); // Reload the users list
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data.message,
                        });
                    }
                }, function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred: ' + error.data.message,
                    });
                });
            }
        });
    };


    function isFormInvalid() {
        if (!$scope.fName || !$scope.lName || !$scope.email || !$scope.password) {
            showAlert('Missing Fields', 'All fields are required!');
            return true;
        }

        if ($scope.password.length < 8) {
            showAlert('Password Too Short', 'Password must be at least 8 characters long!');
            return true;
        }

        var passwordPattern = /^(?=.*[A-Z])(?=.*\d)/;
        if (!passwordPattern.test($scope.password)) {
            showAlert('Weak Password', 'Password must contain at least one uppercase letter and one number!');
            return true;
        }

        if ($scope.password !== document.getElementById("confirmPassword").value) {
            showAlert('Passwords Mismatch', 'Passwords do not match!');
            return true;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($scope.email)) {
            showAlert('Invalid Email', 'Please enter a valid email address!');
            return true;
        }

        return false;
    }

    function showAlert(title, text) {
        Swal.fire({
            icon: 'error',
            title: title,
            text: text,
        });
    }

    function resetFormFields() {
        $scope.fName = "";
        $scope.lName = "";
        $scope.email = "";
        $scope.password = "";
        document.getElementById("confirmPassword").value = "";
    }

    // Load users on page load
    $scope.loadUsers();



    // Feedback Management

    $scope.addFeedback = function () {
        if (isFeedbackFormInvalid()) return;

        var feedbackData = {
            fullName: $scope.feedback.fullName,
            email: $scope.feedback.email,
            message: $scope.feedback.message
        };

        PeraMinderService.submitFeedback(feedbackData).then(function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Feedback added.'
                });
                resetFeedbackForm();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: response.message,
                });
            }
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while submitting your feedback.',
            });
        });
    };

    function isFeedbackFormInvalid() {
        if (!$scope.feedback.fullName || !$scope.feedback.email || !$scope.feedback.message) {
            showAlert('Missing Fields', 'All fields are required!');
            return true;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test($scope.feedback.email)) {
            showAlert('Invalid Email', 'Please enter a valid email address!');
            return true;
        }

        return false;
    }
    $scope.loadFeedbacks = function () {
        PeraMinderService.getFeedbacks().then(function (response) {
            if (response.data.success) {
                $scope.feedbacks = response.data.data; // Assign feedbacks to $scope.feedbacks

                if (window.location.pathname === "/Home/FeedbackManagement") { // Log only on Feedback Management page
                }

                // Ensure changes are reflected in the UI
                $scope.$applyAsync(() => {
                    initializeFeedbackTable(); // Reinitialize DataTable after updating data
                });
            } else {
            }
        }, function (error) {
        });
    };

    // Initialize DataTable for Feedbacks
    function initializeFeedbackTable() {
        if (window.location.pathname === "/Home/FeedbackManagement") { // Ensure this runs only on the Feedbacks page
            if (typeof $ !== 'undefined' && $.fn.DataTable) {
                setTimeout(function () {
                    $('#feedbackTable').DataTable({
                        destroy: true,
                        paging: true,
                        searching: true,
                        ordering: true,
                        responsive: true,
                        autoWidth: false,
                        fixedHeader: true,
                        columns: [
                            { title: "Full Name" },
                            { title: "Email" },
                            { title: "Message" },
                            {
                                title: "Created At",
                                data: "createdAt",
                                render: function (data, type, row) {
                                    if (type === 'display' && data) {
                                        try {
                                            // Extract the timestamp from the .NET date format
                                            const match = data.match(/\/Date\((\d+)\)\//);
                                            if (match) {
                                                const timestamp = parseInt(match[1], 10); // Extract timestamp in milliseconds
                                                const date = new Date(timestamp); // Convert to JavaScript Date

                                                // Format the date as "MMM DD YYYY"
                                                const options = { month: 'short', day: 'numeric', year: 'numeric' };
                                                return date.toLocaleDateString('en-US', options).replace(',', '');
                                            }
                                            return "Invalid Date"; // Fallback for invalid formats
                                        } catch (error) {
                                            return "Invalid Date";
                                        }
                                    }
                                    return data || "No Date"; // Fallback for non-display types
                                }
                            },
                            { title: "Actions", orderable: false }
                        ],
                        columnDefs: [
                            { width: '20%', targets: 0 }, // Adjust first column
                            { width: '20%', targets: 1 }, // Adjust second column
                            { width: '25%', targets: 2 }, // Adjust third column
                            { width: '10%', targets: 3 }, // Adjust fourth column
                            { width: '15%', targets: 4 }  // Make the last column larger
                        ]
                    });
                }, 0);
            } else {
            }
        }
    }


    // Edit Feedback
    $scope.editFeedback = function (feedback) {
        $scope.selectedFeedback = angular.copy(feedback); // Copy feedback to avoid direct binding
        $('#editFeedbackModal').modal('open'); // Open edit modal
    };

    // Update Feedback
    $scope.updateFeedback = function () {
        PeraMinderService.updateFeedback($scope.selectedFeedback).then(function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Feedback updated!',
                });
                $scope.loadFeedbacks(); // Reload feedback list
                $('#editFeedbackModal').modal('close'); // Close modal
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message,
                });
            }
        }, function (error) {
        });
    };

    $scope.deleteFeedback = function (feedbackID) {
        if (!feedbackID) {
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
        }).then((result) => {
            if (result.isConfirmed) {
                // Call the service to delete feedback
                PeraMinderService.deleteFeedback(feedbackID).then(function (response) {
                    if (response.data && response.data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Feedback Deleted!',
                            text: response.data.message,
                        });
                        $scope.loadFeedbacks(); // Refresh feedback list
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data.message || 'Failed to delete feedback.',
                        });
                    }
                }).catch(function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An unexpected error occurred. Please try again later.',
                    });
                });
            }
        });
    };


  
    $scope.loadFeedbacks();

    document.addEventListener('DOMContentLoaded', function () {
        const modal = document.querySelector('#modal1');

        // Open modal and manage focus
        document.querySelector('.modal-trigger').addEventListener('click', function () {
            modal.setAttribute('aria-hidden', 'false');
            modal.querySelector('input#fullName').focus();
        });

        // Close modal and restore focus
        document.querySelector('.modal-close').addEventListener('click', function () {
            modal.setAttribute('aria-hidden', 'true');
            document.querySelector('.modal-trigger').focus();
        });
    });

    // ============= Admin Management ============

 

   

    $scope.loadAdmins = function () {
        PeraMinderService.getAdmins().then(function (response) {
            if (response.data.success) {
                $scope.admins = response.data.data;

                if (window.location.pathname === "/Home/AdminManagement") { // Log only on Feedback Management page
                }

                // Initialize or reinitialize the DataTable
                $scope.$applyAsync(() => {
                    initializeAdminTable(); // Reinitialize DataTable for Admins
                });
            } else {
            }
        }, function (error) {
        });
    };

    // Initialize DataTable for Feedbacks
    function initializeAdminTable() {
        if (window.location.pathname === "/Home/AdminManagement") { // Ensure this runs only on the Admin page
            if (typeof $ !== 'undefined' && $.fn.DataTable) {
                setTimeout(function () {
                    $('#adminTable').DataTable({
                        destroy: true,
                        paging: true,
                        searching: true,
                        ordering: true,
                        responsive: true,
                        autoWidth: false,
                        fixedHeader: true,
                        columns: [
                            { title: "First Name" },
                            { title: "Last Name" },
                            { title: "Email" },
                            {
                                title: "Created At",
                                data: "createdAt",
                                render: function (data, type, row) {
                                    if (type === 'display' && data) {
                                        try {
                                            // Extract the timestamp from the .NET date format
                                            const match = data.match(/\/Date\((\d+)\)\//);
                                            if (match) {
                                                const timestamp = parseInt(match[1], 10); // Extract timestamp in milliseconds
                                                const date = new Date(timestamp); // Convert to JavaScript Date

                                                // Format the date as "MMM DD YYYY"
                                                const options = { month: 'short', day: 'numeric', year: 'numeric' };
                                                return date.toLocaleDateString('en-US', options).replace(',', '');
                                            }
                                            return "Invalid Date"; // Fallback for invalid formats
                                        } catch (error) {
                                            return "Invalid Date";
                                        }
                                    }
                                    return data || "No Date"; // Fallback for non-display types
                                }
                            },                            { title: "Actions", orderable: false }
                        ],
                        columnDefs: [
                            { width: '20%', targets: 0 }, // Adjust first column
                            { width: '20%', targets: 1 }, // Adjust second column
                            { width: '25%', targets: 2 }, // Adjust third column
                            { width: '10%', targets: 3 }, // Adjust fourth column
                            { width: '15%', targets: 4 }  // Make the last column larger
                        ]
                    });
                }, 0);
            } else {
            }
        }
    }


    $scope.addAdmin = function () {
        // Basic validation
        if (!$scope.adminFName || $scope.adminFName.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'First Name is required.',
            });
            return;
        } else if ($scope.adminFName.length > 50) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'First Name must not exceed 50 characters.',
            });
            return;
        }

        if (!$scope.adminLName || $scope.adminLName.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Last Name is required.',
            });
            return;
        } else if ($scope.adminLName.length > 50) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Last Name must not exceed 50 characters.',
            });
            return;
        }

        if (!$scope.adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($scope.adminEmail)) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'A valid Email Address is required.',
            });
            return;
        } else if ($scope.adminEmail.length > 100) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: 'Email Address must not exceed 100 characters.',
            });
            return;
        }
        if (
            !$scope.adminPassword ||
            $scope.adminPassword.length < 8 ||
            !/[A-Z]/.test($scope.adminPassword) ||
            !/[\W_]/.test($scope.adminPassword)
        ) {
            let message = 'Password must be at least 8 characters long, contain at least one uppercase letter, and one special character.';
            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                text: message,
            });
            return;
        }

        const adminData = {
            fName: $scope.adminFName.trim(),
            lName: $scope.adminLName.trim(),
            email: $scope.adminEmail.trim(),
            password: $scope.adminPassword,
        };

        // Call the service to add admin
        PeraMinderService.addAdmin(adminData).then(function (response) {
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Admin added successfully!',
                });
                $scope.getAdmins(); // Reload admin list
                $('#addAdminModal').modal('close'); // Close modal
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
            }
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred. Please try again later.',
            });
        });
    };




    // Edit Admin
    $scope.editAdmin = function (admin) {
        $scope.selectedAdmin = angular.copy(admin); // Copy admin to avoid direct binding
        $('#editAdminModal').modal('open'); // Open edit modal
    };

    // Update Admin
    $scope.updateAdmin = function () {
        if (isAdminFormInvalid($scope.selectedAdmin)) return;

        PeraMinderService.updateAdmin($scope.selectedAdmin).then(function (response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Admin updated successfully!',
                });
                $scope.loadAdmins(); // Reload admin list
                $('#editAdminModal').modal('close'); // Close modal
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message,
                });
            }
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred. Please try again later.',
            });
        });
    };

    function isAdminFormInvalid(adminData) {
        if (!adminData.fName || !adminData.lName || !adminData.email) {
            showAlert('Missing Fields', 'All fields are required!');
            return true;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(adminData.email)) {
            showAlert('Invalid Email', 'Please enter a valid email address!');
            return true;
        }

        return false;
    }

    // Delete Admin
    $scope.deleteAdmin = function (adminID) {
        if (!adminID) {
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                PeraMinderService.deleteAdmin(adminID).then(function (response) {
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Admin deleted successfully!',
                        });
                        $scope.loadAdmins(); // Refresh admin list
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message || 'Failed to delete admin.',
                        });
                    }
                }).catch(function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An unexpected error occurred. Please try again later.',
                    });
                });
            }
        });
    };



    $scope.loadAdmins();


    // ==== TRANSACTIONS =====

        $scope.transactions = []; // Store fetched transactions
        $scope.userID = null; // Placeholder for dynamic userID

        // Initialize controller
        $scope.init = function () {
            // Fetch the userID dynamically
            PeraMinderService.getUserID().then(function (response) {
                if (response.data.success) {
                    $scope.userID = response.data.userID; // Set the dynamic userID
                    $scope.loadTransactions(); // Load transactions once userID is available
                } else {
                }
            }, function (error) {
            });
        };

    $scope.loadTransactions = function () {
        if (!$scope.userID) {
            alert('Error: User ID is not available. Please log in again.');
            return;
        }

        PeraMinderService.getTransactions($scope.userID).then(function (response) {
            if (response.data.success) {
                $scope.transactions = response.data.data;
                $scope.calculateTotals(); // Calculate totals after loading transactions
                $scope.initializeTransactionTable();
            } else {
            }
        }, function (error) {
        });
    };


    $scope.initializeTransactionTable = function () {
        if (window.location.pathname === "/Home/Transactions") {
            if (typeof $ !== 'undefined' && $.fn.DataTable) {
                setTimeout(function () {

                    if ($.fn.DataTable.isDataTable('#transactionsTable')) {
                        $('#transactionsTable').DataTable().destroy(); // Destroy any existing DataTable instance
                    }

                    // Custom date filter
                    $.fn.dataTable.ext.search.push(
                        function (settings, data, dataIndex) {
                            const selectedFilter = $('#dateFilter').val(); // Retrieve selected filter
                            const dateColumnIndex = 0; // Adjust this index based on your data column
                            const transactionDateRaw = data[dateColumnIndex]; // Date in the first column

                            // Parse date (modify as per your date format)
                            const match = transactionDateRaw.match(/\/Date\((\d+)\)\//); // Match .NET date format
                            const transactionDate = match
                                ? new Date(parseInt(match[1], 10))
                                : new Date(transactionDateRaw);

                            if (isNaN(transactionDate.getTime())) {
                                return false; // Skip invalid dates
                            }

                            const now = new Date();
                            const filter = selectedFilter || 'all';

                            if (filter === 'all') {
                                return true; // Show all rows
                            } else if (filter === 'week') {
                                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the week (Sunday)
                                const endOfWeek = new Date(startOfWeek);
                                endOfWeek.setDate(endOfWeek.getDate() + 6); // End of the week (Saturday)
                                return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
                            } else if (filter === 'month') {
                                return (
                                    transactionDate.getFullYear() === now.getFullYear() &&
                                    transactionDate.getMonth() === now.getMonth()
                                );
                            } else if (filter === 'year') {
                                return transactionDate.getFullYear() === now.getFullYear();
                            }

                            return true; // Default to showing all rows
                        }
                    );


                    // Initialize DataTable
                    $('#transactionsTable').DataTable({
                        paging: true,
                        searching: true,
                        ordering: true,
                        responsive: true,
                        autoWidth: false,
                        data: $scope.transactions,
                        columns: [
                            
                                {
                                    title: "Date",
                                    data: "transactionDate",
                                    render: function (data, type, row) {
                                        if (type === 'display' && data) {
                                            try {
                                                // Extract the timestamp from the .NET date format
                                                const match = data.match(/\/Date\((\d+)\)\//);
                                                if (match) {
                                                    const timestamp = parseInt(match[1], 10); // Extract timestamp in milliseconds
                                                    const date = new Date(timestamp); // Convert to JavaScript Date

                                                    // Format the date as "MMM DD YYYY"
                                                    const options = { month: 'short', day: 'numeric', year: 'numeric' };
                                                    return date.toLocaleDateString('en-US', options).replace(',', '');
                                                }
                                                return "Invalid Date"; // Fallback for invalid formats
                                            } catch (error) {
                                                return "Invalid Date";
                                            }
                                        }
                                        return data || "No Date"; // Fallback for non-display types
                                    }
                                },
                            { title: "Category", data: "autoCategoryType" },
                            { title: "Payment Method", data: "autoPaymentMethodName" },
                            { title: "Transaction Type", data: "autoTransactionTypeName" },
                            { title: "Amount", data: "amount" },
                            { title: "Notes", data: "notes" },
                            {
                                title: "Actions",
                                render: function (data, type, row) {
                                    return `
                                    <button class="btn btn-primary btn-sm edit-btn" data-id="${row.transactionID}">Edit</button>
                                    <button class="btn btn-danger btn-sm delete-btn" data-id="${row.transactionID}">Delete</button>
                                `;
                                },
                                orderable: false,
                            },
                        ],
                    });

                    // Apply custom filter when the dropdown changes
                    $('#dateFilter').on('change', function () {
                        $('#transactionsTable').DataTable().draw(); // Redraw the table to apply the filter
                    });
                }, 0);
            } else {
            }
        }
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('input, textarea, select').forEach((el) => {
                if (el && el.value && el.nextElementSibling) {
                    el.nextElementSibling.classList.add('active');
                }
            });
        });
  
        //DELETE-BTN
        $('#transactionsTable tbody').on('click', '.delete-btn', function () {
            const transactionID = Number($(this).data('id')); // Retrieve transaction ID

            $scope.$apply(() => {
                $scope.deleteTransaction(transactionID);
            });
        });

        //EDIT-BTN
        $('#transactionsTable tbody').on('click', '.edit-btn', function () {
    const transactionID = Number($(this).data('id'));

    // Call the Angular function with the correct transaction ID
    $scope.$apply(() => {
        $scope.editTransaction(transactionID);
    });
});

    };
    // ========== Add Transaction ==============
    $scope.addTransaction = function () {
        if (isTransactionFormInvalid()) return;

        // Prepare the transaction data
        var transactionData = {
            userID: $scope.userID, // Assuming userID is already available
            transactionDate: $scope.newTransaction.date,
            categoryID: $scope.newTransaction.categoryID,
            paymentMethodID: $scope.newTransaction.paymentMethodID,
            transactionTypeID: $scope.newTransaction.transactionTypeID,
            amount: $scope.newTransaction.amount,
            notes: $scope.newTransaction.notes
        };

        // Call service to save transaction
        PeraMinderService.addTransaction(transactionData).then(function (response) {
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Transaction Added!',
                    text: response.data.message,
                });
                $scope.loadTransactions(); // Reload transactions
                $scope.resetTransactionForm(); // Clear the form
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
            }
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while adding the transaction.',
            });
        });
    };

    // Helper function to validate the transaction form
    function isTransactionFormInvalid() {
        if (!$scope.newTransaction.date || !$scope.newTransaction.amount || !$scope.newTransaction.categoryID) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Date, Amount, and Category are required!',
            });
            return true;
        }
        return false;
    }

    // Helper function to reset the transaction form
    $scope.resetTransactionForm = function () {
        $scope.newTransaction = {
            date: "",
            categoryID: "",
            paymentMethodID: "",
            transactionTypeID: "",
            amount: "",
            notes: ""
        };
    };

    // Initialize newTransaction object
    $scope.resetTransactionForm();


    
        document.addEventListener('DOMContentLoaded', function () {
            // Initialize modals
            var modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);

            // Initialize other components (if needed)
        });
    $scope.initSelects = function () {
        $timeout(function () {
            const elems = document.querySelectorAll('select');
            if (elems) {
                M.FormSelect.init(elems);
            }
        });
    };
    document.querySelectorAll('input, textarea, select').forEach((el) => {
        if (el && el.value && el.nextElementSibling) {
            el.nextElementSibling.classList.add('active');
        }
    });


    $scope.init = function () {
        PeraMinderService.getUserID().then(function (response) {
            if (response.data.success) {
                $scope.userID = response.data.userID; // Assign userID
                $scope.loadTransactions(); // Load transactions
            } else {
            }
        }, function (error) {
        });
    };


    $scope.init();

    $scope.initSelects();

    $scope.categories = [];
    $scope.paymentMethods = [];
    $scope.transactionTypes = [];

    $scope.loadData = function () {
        $scope.categories = [
            { categoryID: 1, categoryName: "Food", type: "expense" },
            { categoryID: 2, categoryName: "Transportation", type: "expense" },
            { categoryID: 3, categoryName: "Housing/Utilities", type: "expense" },
            { categoryID: 4, categoryName: "Health", type: "expense" },
            { categoryID: 5, categoryName: "Education", type: "expense" },
            { categoryID: 6, categoryName: "Lifestyle", type: "expense" },
            { categoryID: 7, categoryName: "Salary/Wages", type: "income" },
            { categoryID: 8, categoryName: "Investments", type: "income" },
            { categoryID: 9, categoryName: "Side Hustle", type: "income" },
            { categoryID: 10, categoryName: "Other Income", type: "income" }
       

        ];
        $scope.paymentMethods = [
            { paymentMethodID: 1, paymentMethodName: "Credit Card" },
            { paymentMethodID: 2, paymentMethodName: "Debit" },
            { paymentMethodID: 3, paymentMethodName: "Cash" },
            { paymentMethodID: 4, paymentMethodName: "Bank Transfer" },
            { paymentMethodID: 5, paymentMethodName: "E-Wallet" },



        ];
        $scope.transactionTypes = [
            { transactionTypeID: 1, transactionTypeName: "Income" },
            { transactionTypeID: 2, transactionTypeName: "Expense" },
        ];

        $scope.filteredCategories = [];

        $scope.$watch('newTransaction.transactionTypeID', function (newTypeID) {
            if (newTypeID) {
                if (newTypeID == 1) { // Income
                    $scope.filteredCategories = $scope.categories.filter(function (category) {
                        return category.type === "income";
                    });
                } else if (newTypeID == 2) { // Expense
                    $scope.filteredCategories = $scope.categories.filter(function (category) {
                        return category.type === "expense";
                    });
                }
            } else {
                $scope.filteredCategories = []; 
            }

            $timeout(function () {
                const elems = document.querySelectorAll('select');
                if (elems) {
                    M.FormSelect.init(elems);
                }
            });
        });
    };

    $scope.editTransaction = function (transactionID) {

        if (typeof transactionID !== 'number' || isNaN(transactionID)) {
            Swal.fire('Error', 'Invalid transaction ID.', 'error');
            return;
        }

        // Find the transaction by ID
        const transaction = $scope.transactions.find(t => t.transactionID === transactionID);

        if (transaction) {
            $scope.editTransactionData = angular.copy(transaction);

            // Convert transactionDate from /Date(...) format to a usable Date object
            $scope.editTransactionData.transactionDate = new Date(parseInt(transaction.transactionDate.match(/\d+/)[0], 10));

            // Filter categories based on transaction type
            $scope.filteredCategories = $scope.categories.filter(category =>
                (transaction.transactionTypeID === 1 && category.type === "income") ||
                (transaction.transactionTypeID === 2 && category.type === "expense")
            );

            // Reinitialize Materialize selects for dropdowns
            $timeout(() => M.FormSelect.init(document.querySelectorAll('select')), 0);

            // Open the edit modal
            const editModal = document.getElementById('editTransactionModal');
            M.Modal.getInstance(editModal).open();
        } else {
            Swal.fire('Error', 'Transaction not found.', 'error');
        }
    };




    $scope.updateTransaction = function () {
        const updatedData = {
            transactionID: $scope.editTransactionData.transactionID,
            transactionDate: $scope.editTransactionData.transactionDate,
            categoryID: $scope.editTransactionData.categoryID,
            paymentMethodID: $scope.editTransactionData.paymentMethodID,
            transactionTypeID: $scope.editTransactionData.transactionTypeID,
            amount: $scope.editTransactionData.amount,
            notes: $scope.editTransactionData.notes
        };

        PeraMinderService.updateTransaction(updatedData).then(response => {
            if (response.data.success) {
                Swal.fire('Success', 'Transaction updated successfully!', 'success');
                $scope.loadTransactions(); // Reload transactions
            } else {
                Swal.fire('Error', response.data.message, 'error');
            }
        }).catch(error => {
            Swal.fire('Error', 'An error occurred while updating the transaction.', 'error');
        });
    };
    document.addEventListener('DOMContentLoaded', function () {
        var modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
    });

    // == Delete
    $scope.deleteTransaction = function (transactionID) {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                PeraMinderService.deleteTransaction(transactionID).then(function (response) {
                    if (response.data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Transaction Deleted!',
                            text: response.data.message,
                        });
                        $scope.loadTransactions(); // Reload transactions after deletion
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data.message,
                        });
                    }
                }, function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An unexpected error occurred. Please try again later.',
                    });
                });
            }
        });
    };

    $scope.calculateTotals = function () {
        $scope.totalIncome = 0;
        $scope.totalExpenses = 0;
        $scope.balance = 0;

        $scope.transactions.forEach(transaction => {
            if (transaction.autoTransactionTypeName === "Income") {
                $scope.totalIncome += transaction.amount;
            } else if (transaction.autoTransactionTypeName === "Expense") {
                $scope.totalExpenses += transaction.amount;
            }
        });

        $scope.balance = $scope.totalIncome - $scope.totalExpenses;
    };

    // == SUMMARY ==
    $scope.getSummary = function (period) {
        if (!period) {
            return;
        }

        PeraMinderService.getSummary(period).then(function (response) {
            if (response.data.success) {
                // Update scope variables with raw numeric values
                $scope.totalIncome = response.data.totalIncome;
                $scope.totalExpenses = response.data.totalExpenses;
                $scope.balance = response.data.balance;

                // Log for debugging (optional)
                console.log(`${period.charAt(0).toUpperCase() + period.slice(1)} Summary`, {
                    totalIncome: $scope.totalIncome,
                    totalExpenses: $scope.totalExpenses,
                    balance: $scope.balance,
                });
            } else {
            }
        }, function (error) {
        });
    };

    // Call loadData during initialization
    $scope.loadData();
    $scope.initializeTransactionTable();

    // Default values for summary
    $scope.totalIncome = 0;
    $scope.totalExpenses = 0;
    $scope.balance = 0;

    // Fetch summary data for a default period (e.g., monthly)
    $scope.fetchSummary = function (period = 'monthly') {
        $http
            .get(`/Home/GetTransactionSummary?period=${period}`)
            .then(function (response) {
                if (response.data.success) {
                    $scope.totalIncome = response.data.totalIncome;
                    $scope.totalExpenses = response.data.totalExpenses;
                    $scope.balance = response.data.balance;
                } else {
                }
            })
            .catch(function (error) {
            });
    };

    // Initialize data
    $scope.fetchSummary();

    // ===== CHARTS =======
    $scope.loadIncomeExpenseChart = function () {
        const period = 'monthly'; // Adjust this as needed: 'daily', 'weekly', 'monthly'

        // Fetch income and expense data
        PeraMinderService.getIncomeExpenseData(period)
            .then(function (response) {
                if (response.data.success) {
                    const data = response.data.data;

                    // Check if there's no data
                    if (data.Income === 0 && data.Expense === 0) {
                        // Clear existing chart and show a message instead
                        const chartElement = document.getElementById('incomeExpenseChart');
                        const ctx = chartElement.getContext('2d');
                        ctx.clearRect(0, 0, chartElement.width, chartElement.height);

                        // Display "No Data Available" message
                        ctx.font = '16px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillStyle = '#999';
                        ctx.fillText('No Transactions Available', chartElement.width / 2, chartElement.height / 2);
                    } else {
                        // Prepare chart data
                        const chartData = {
                            labels: ['Income', 'Expense'],
                            datasets: [
                                {
                                    data: [data.Income, data.Expense],
                                    backgroundColor: ['#264027', '#F5D547'], // Green for Income, Yellow for Expense
                                    borderColor: ['#FFFFFF', '#FFFFFF'], // White borders
                                    borderWidth: 1
                                }
                            ]
                        };

                        // Chart configuration
                        const config = {
                            type: 'doughnut',
                            data: chartData,
                            options: {
                                responsive: true,
                                plugins: {
                                    legend: { position: 'top' },
                                    title: { display: true, text: 'Income vs. Expense' }
                                }
                            }
                        };

                        // Render the chart
                        const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
                        new Chart(ctx, config);
                    }
                } else {
                    console.error('Failed to fetch income-expense data:', response.data.message);
                }
            })
            .catch(function (error) {
                console.error('Error fetching income-expense data:', error);
            });
    };



  
    $scope.loadUserGrowthChart = function () {
        const period = 'monthly'; // Adjust as needed: 'daily', 'weekly', 'monthly'

        PeraMinderService.getUserGrowth(period).then(function (response) {
            if (response.data.success) {
                const labels = response.data.data.map(item => item.Date);
                const data = response.data.data.map(item => item.UserCount);

                // Ensure element exists
                const chartElement = document.getElementById('userGrowthChart');
                if (!chartElement) {
                    return;
                }

                const ctx = chartElement.getContext('2d');
                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'User Growth',
                        data: data,
                        fill: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    }]
                };

                const config = {
                    type: 'line',
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            title: {
                                display: true,
                                text: 'User Growth Over Time'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'User Count'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time Period'
                                }
                            }
                        }
                    }
                };

                new Chart(ctx, config);
            } else {
            }
        }).catch(function (error) {
        });
    };


    $scope.loadExpenseBreakdownChart = function () {
        const chartElement = document.getElementById('expenseBreakdownChart');
        if (!chartElement) {
            // Exit if the chart element is not present
            return;
        }

        const currentMonth = new Date().getMonth() + 1; // Get current month (1-based)
        const currentYear = new Date().getFullYear(); // Get current year

        PeraMinderService.getMonthlyExpenseBreakdown(currentMonth, currentYear).then(function (response) {
            if (response.data.success) {
                const categories = response.data.data.map(item => item.categoryName);
                const amounts = response.data.data.map(item => item.totalAmount);

                // Render the chart
                const ctx = chartElement.getContext('2d');
                const data = {
                    labels: categories,
                    datasets: [{
                        label: 'Total Expenses',
                        data: amounts,
                        backgroundColor:  [
                            '#264027', // Cal Poly Green
                            '#F5D547', // Naples Yellow
                            '#f2f2f2', // Light Gray
                            '#FFFFFF'  // White
                        ],
                        borderWidth: 1
                    }]
                };
                const config = {
                    type: 'bar',
                    data: data,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false // Hide legend for a single dataset
                            },
                            title: {
                                display: true,
                                text: `Expense Breakdown for ${currentMonth}/${currentYear}`
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Amount (in PHP)' // Adjust as per currency
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Categories'
                                }
                            }
                        }
                    }
                };

                // Create the chart
                new Chart(ctx, config);
            }
        }).catch(function (error) {
        });
    };

    $scope.loadCategoryTrendsChart = function () {
        const chartElement = document.getElementById('categoryTrendsChart');
        if (!chartElement) {
            // Exit if the chart element is not present
            return;
        }

        const period = 'monthly'; // Adjust this as needed: 'weekly', 'monthly', etc.

        PeraMinderService.getCategoryTrends(period).then(function (response) {
            if (response.data.success) {
                const categories = response.data.data.map(item => item.categoryName);
                const timePeriods = response.data.timePeriods; // Assuming backend sends time periods
                const datasets = response.data.data.map(category => ({
                    label: category.categoryName,
                    data: category.amounts, // Array of amounts per time period
                    fill: false,
                    borderColor: getRandomColor(), // Helper function to generate random colors
                    tension: 0.1
                }));

                // Render the chart
                const ctx = chartElement.getContext('2d');
                const data = {
                    labels: timePeriods,
                    datasets: datasets
                };
                const config = {
                    type: 'line',
                    data: data,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            title: {
                                display: true,
                                text: 'Category Spending Trends Over Time'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Amount (in  ₱)' // Adjust as needed
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time Periods'
                                }
                            }
                        }
                    }
                };

                new Chart(ctx, config);
            }
        }).catch(function (error) {
        });
    };

    // Helper function to generate random colors for datasets
    function getRandomColor() {
        const palette = ['#264027', '#F5D547', '#f2f2f2', '#FFFFFF'];
        return palette[Math.floor(Math.random() * palette.length)];
    }

   
  


    // Call this function during dashboard initialization
    $scope.initDashboard = function () {
        $scope.loadExpenseBreakdownChart();
        $scope.loadCategoryTrendsChart();
        $scope.loadIncomeExpenseChart();

    };

    $scope.initDashboard();




    // = ADMIN CHARTS
    $scope.loadUserGrowthChart = function () {
        const period = 'monthly'; // Adjust as needed: 'daily', 'weekly', 'monthly'

        PeraMinderService.getUserGrowth(period).then(function (response) {
            if (response.data.success) {
                const labels = response.data.data.map(item => item.Date);
                const data = response.data.data.map(item => item.UserCount);

                // Render the chart
                const ctx = document.getElementById('userGrowthChart').getContext('2d');
                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'User Growth',
                        data: data,
                        fill: true,
                        borderColor: '#264027', // Cal Poly Green
                        backgroundColor: 'rgba(38, 64, 39, 0.2)', // Cal Poly Green
                        borderWidth: 2,
                        tension: 0.4
                    }]
                };

                const config = {
                    type: 'line',
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            title: {
                                display: true,
                                text: 'User Growth Over Time'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'User Count'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time Period'
                                }
                            }
                        }
                    }
                };

                new Chart(ctx, config);
            } else {
            }
        }).catch(function (error) {
        });
    };
    $scope.$on('$viewContentLoaded', function () {
        $scope.loadUserGrowthChart();
    });

    $scope.loadAdminUserRatioChart = function () {
        PeraMinderService.getAdminUserRatio().then(function (response) {
            if (response.data.success) {
                const adminCount = response.data.data.AdminCount;
                const userCount = response.data.data.UserCount;

                // Render the chart
                const ctx = document.getElementById('adminUserRatioChart').getContext('2d');
                const chartData = {
                    labels: ['Admins', 'Users'],
                    datasets: [{
                        label: 'Admin-to-User Ratio',
                        data: [adminCount, userCount],
                        backgroundColor: [
                            '#264027', // Cal Poly Green for Income
                            '#F5D547', // Naples Yellow
                        ],
                        borderColor: [
                            '#FFFFFF', // White border for clarity
                            '#FFFFFF'
                        ],
                        borderWidth: 1,
                    }]
                };

                const config = {
                    type: 'doughnut', // Doughnut chart for ratio
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            title: {
                                display: true,
                                text: 'Admin-to-User Ratio'
                            }
                        }
                    }
                };

                new Chart(ctx, config);
            } else {
            }
        }).catch(function (error) {
        });
    };

    $scope.loadFeedbackGrowthChart = function () {
        const chartElement = document.getElementById('feedbackGrowthChart');
        if (!chartElement) {
            // Exit if the chart element is not present
            return;
        }

        const period = 'monthly'; // Adjust as needed: 'daily', 'weekly', 'monthly'

        PeraMinderService.getFeedbackGrowth(period).then(function (response) {
            if (response.data.success) {
                const labels = response.data.data.map(item => item.Date);
                const data = response.data.data.map(item => item.FeedbackCount);

                // Render the chart
                const ctx = chartElement.getContext('2d');
                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Feedback Growth',
                        data: data,
                        fill: true,
                        borderColor: '#F5D547', // Naples Yellow
                        backgroundColor: 'rgba(245, 213, 71, 0.2)', // Semi-transparent Naples Yellow
                        borderWidth: 2,
                        tension: 0.4
                    }]
                };

                const config = {
                    type: 'line',
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            title: {
                                display: true,
                                text: 'Feedback Growth Over Time'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Feedback Count'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time Period'
                                }
                            }
                        }
                    }
                };

                new Chart(ctx, config);
            } else {
                console.error('Failed to load feedback growth data:', response.data.message);
            }
        }).catch(function (error) {
            console.error('Error fetching feedback growth data:', error);
        });
    };


    // Call these functions on initialization
    $scope.initDashboard = function () {
        $scope.loadAdminUserRatioChart();
        $scope.loadFeedbackGrowthChart();
        $scope.loadUserGrowthChart();

    };
    $scope.initDashboard();

    // Scope variables for counts
    $scope.totalUsers = 0;
    $scope.totalAdmins = 0;
    $scope.totalFeedbacks = 0;

    $scope.loadCounts = function () {
        PeraMinderService.getCounts().then(function (response) {
            if (response.data.success) {
                $scope.totalUsers = response.data.data.UserCount;
                $scope.totalAdmins = response.data.data.AdminCount;
                $scope.totalFeedbacks = response.data.data.FeedbackCount;
            } else {
            }
        }, function (error) {
        });
    };


    // Call the function to fetch counts on page load
    $scope.loadCounts();

    
});


