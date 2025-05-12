-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 03, 2025 at 02:31 AM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_role` enum('admin','หัวหน้าสำนักงาน','พนักงาน','พนักงานฝ่ายวิจัยและนวัตถกรรม','พนักงานฝ่ายคุณภาพนิสิต','พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร','พนักงานฝ่ายวิชาการ','คณบดี','คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร','รองคณบดีฝ่ายวิชาการ','รองคณบดีฝ่ายวิจัยและนวัตถกรรม','รองคณบดีฝ่ายคุณภาพนิสิต') NOT NULL DEFAULT 'พนักงาน'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `IDX_65d72a4b8a5fcdad6edee8563b` (`user_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- Insert admin user
INSERT INTO `user` (`user_email`, `user_name`, `user_password`, `user_role`) 
VALUES ('admin@ict.com', 'Admin User', 'admin123', 'admin');

-- Insert dean user
INSERT INTO `user` (`user_email`, `user_name`, `user_password`, `user_role`) 
VALUES ('dean@ict.com', 'Dean User', 'dean123', 'คณบดี');

-- Insert vice dean users
INSERT INTO `user` (`user_email`, `user_name`, `user_password`, `user_role`) 
VALUES ('vicedean.academic@ict.com', 'Academic Vice Dean', 'vicedean123', 'รองคณบดีฝ่ายวิชาการ');

INSERT INTO `user` (`user_email`, `user_name`, `user_password`, `user_role`) 
VALUES ('vicedean.strategy@ict.com', 'Strategy Vice Dean', 'vicedean123', 'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร');

INSERT INTO `user` (`user_email`, `user_name`, `user_password`, `user_role`) 
VALUES ('vicedean.student@ict.com', 'Student Quality Vice Dean', 'vicedean123', 'รองคณบดีฝ่ายคุณภาพนิสิต');

-- Insert staff users
INSERT INTO `user` (`user_email`, `user_name`, `user_password`, `user_role`) 
VALUES ('staff.academic@ict.com', 'Academic Staff', 'staff123', 'พนักงานฝ่ายวิชาการ');

INSERT INTO `user` (`user_email`, `user_name`, `user_password`, `user_role`) 
VALUES ('staff.strategy@ict.com', 'Strategy Staff', 'staff123', 'พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร');

INSERT INTO `user` (`user_email`, `user_name`, `user_password`, `user_role`) 
VALUES ('staff.student@ict.com', 'Student Quality Staff', 'staff123', 'พนักงานฝ่ายคุณภาพนิสิต');