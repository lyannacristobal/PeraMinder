-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table pminder_db.tbladmin
CREATE TABLE IF NOT EXISTS tbladmin (
  adminID int(11) NOT NULL AUTO_INCREMENT,
  fName varchar(50) NOT NULL,
  lName varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL,
  PRIMARY KEY (adminID),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pminder_db.tbladmin: ~0 rows (approximately)

-- Dumping structure for table pminder_db.tblanalytics
CREATE TABLE IF NOT EXISTS tblanalytics (
  analyticsID int(11) NOT NULL AUTO_INCREMENT,
  userID int(11) DEFAULT NULL,
  categoryID int(11) DEFAULT NULL,
  transactionTypeID int(11) DEFAULT NULL,
  totalAmount decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (analyticsID),
  KEY userID (userID),
  KEY categoryID (categoryID),
  KEY transactionTypeID (transactionTypeID),
  CONSTRAINT tblanalytics_ibfk_1 FOREIGN KEY (userID) REFERENCES tblusers (userID),
  CONSTRAINT tblanalytics_ibfk_2 FOREIGN KEY (categoryID) REFERENCES tblcategory (categoryID),
  CONSTRAINT tblanalytics_ibfk_3 FOREIGN KEY (transactionTypeID) REFERENCES tbltransactiontype (transactionTypeID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pminder_db.tblanalytics: ~0 rows (approximately)

-- Dumping structure for table pminder_db.tblcategory
CREATE TABLE IF NOT EXISTS tblcategory (
  categoryID int(11) NOT NULL AUTO_INCREMENT,
  categoryName varchar(50) NOT NULL,
  PRIMARY KEY (categoryID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pminder_db.tblcategory: ~0 rows (approximately)

-- Dumping structure for table pminder_db.tblfeedbacks
CREATE TABLE IF NOT EXISTS tblfeedbacks (
  feedbackID int(11) NOT NULL AUTO_INCREMENT,
  fullName varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  message text NOT NULL,
  phoneNumber varchar(20) DEFAULT NULL,
  createdAt datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (feedbackID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pminder_db.tblfeedbacks: ~0 rows (approximately)

-- Dumping structure for table pminder_db.tblpaymentmethods
CREATE TABLE IF NOT EXISTS tblpaymentmethods (
  paymentMethodID int(11) NOT NULL AUTO_INCREMENT,
  paymentMethodName varchar(50) NOT NULL,
  PRIMARY KEY (paymentMethodID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pminder_db.tblpaymentmethods: ~0 rows (approximately)

-- Dumping structure for table pminder_db.tbltransactions
CREATE TABLE IF NOT EXISTS tbltransactions (
  transactionID int(11) NOT NULL AUTO_INCREMENT,
  userID int(11) DEFAULT NULL,
  transactionDate datetime NOT NULL,
  categoryID int(11) DEFAULT NULL,
  paymentMethodID int(11) DEFAULT NULL,
  transactionTypeID int(11) DEFAULT NULL,
  amount decimal(10,2) NOT NULL,
  notes text DEFAULT NULL,
  createdAt datetime DEFAULT NULL,
  updatedAt datetime DEFAULT NULL,
  PRIMARY KEY (transactionID),
  KEY userID (userID),
  KEY categoryID (categoryID),
  KEY paymentMethodID (paymentMethodID),
  KEY transactionTypeID (transactionTypeID),
  CONSTRAINT tbltransactions_ibfk_1 FOREIGN KEY (userID) REFERENCES tblusers (userID),
  CONSTRAINT tbltransactions_ibfk_2 FOREIGN KEY (categoryID) REFERENCES tblcategory (categoryID),
  CONSTRAINT tbltransactions_ibfk_3 FOREIGN KEY (paymentMethodID) REFERENCES tblpaymentmethods (paymentMethodID),
  CONSTRAINT tbltransactions_ibfk_4 FOREIGN KEY (transactionTypeID) REFERENCES tbltransactiontype (transactionTypeID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pminder_db.tbltransactions: ~0 rows (approximately)

-- Dumping structure for table pminder_db.tbltransactiontype
CREATE TABLE IF NOT EXISTS tbltransactiontype (
  transactionTypeID int(11) NOT NULL AUTO_INCREMENT,
  transactionTypeName varchar(50) NOT NULL,
  PRIMARY KEY (transactionTypeID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pminder_db.tbltransactiontype: ~0 rows (approximately)

-- Dumping structure for table pminder_db.tblusers
CREATE TABLE IF NOT EXISTS tblusers (
  userID int(11) NOT NULL AUTO_INCREMENT,
  fName varchar(50) NOT NULL,
  lName varchar(50) NOT NULL,
  birthDate date NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
  createdAt datetime NOT NULL DEFAULT current_timestamp(),
  updatedAt datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (userID),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pminder_db.tblusers: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;