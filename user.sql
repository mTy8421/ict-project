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

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_role` enum('admin','คณบดี','รองคณบดีฝ่ายวิชาการ','รองคณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร','รองคณบดีฝ่ายวิจัยและนวัตกรรม','รองคณบดีฝ่ายคุณภาพนิสิต','พนักงาน') NOT NULL DEFAULT 'พนักงาน',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `IDX_65d72a4b8a5fcdad6edee8563b` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `workload`
--

CREATE TABLE workload (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50),
  department VARCHAR(100),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  assignedToUserId INT
);

ALTER TABLE workload
  ADD COLUMN start_date DATE,
  ADD COLUMN end_date DATE;

-- เพิ่ม column priority
ALTER TABLE `workload` 
ADD COLUMN `priority` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium';


--
-- Table structure for table `workload_comment`
--

CREATE TABLE IF NOT EXISTS `workload_comment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `comment_content` text NOT NULL,
  `comment_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comment_created_by` int NOT NULL,
  `comment_updated_by` int NOT NULL,
  `comment_workload_id` int NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `comment_created_by` (`comment_created_by`),
  KEY `comment_updated_by` (`comment_updated_by`),
  KEY `comment_workload_id` (`comment_workload_id`),
  CONSTRAINT `comment_created_by` FOREIGN KEY (`comment_created_by`) REFERENCES `user` (`user_id`),
  CONSTRAINT `comment_updated_by` FOREIGN KEY (`comment_updated_by`) REFERENCES `user` (`user_id`),
  CONSTRAINT `comment_workload_id` FOREIGN KEY (`comment_workload_id`) REFERENCES `workload` (`workload_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `workload_file`
--

CREATE TABLE IF NOT EXISTS `workload_file` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `file_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `file_created_by` int NOT NULL,
  `file_updated_by` int NOT NULL,
  `file_workload_id` int NOT NULL,
  PRIMARY KEY (`file_id`),
  KEY `file_created_by` (`file_created_by`),
  KEY `file_updated_by` (`file_updated_by`),
  KEY `file_workload_id` (`file_workload_id`),
  CONSTRAINT `file_created_by` FOREIGN KEY (`file_created_by`) REFERENCES `user` (`user_id`),
  CONSTRAINT `file_updated_by` FOREIGN KEY (`file_updated_by`) REFERENCES `user` (`user_id`),
  CONSTRAINT `file_workload_id` FOREIGN KEY (`file_workload_id`) REFERENCES `workload` (`workload_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `workload_history`
--

CREATE TABLE IF NOT EXISTS `workload_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `history_action` enum('สร้าง','แก้ไข','ลบ','อัพโหลดไฟล์','ลบไฟล์','เพิ่มความคิดเห็น','ลบความคิดเห็น') NOT NULL,
  `history_description` text,
  `history_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `history_created_by` int NOT NULL,
  `history_workload_id` int NOT NULL,
  PRIMARY KEY (`history_id`),
  KEY `history_created_by` (`history_created_by`),
  KEY `history_workload_id` (`history_workload_id`),
  CONSTRAINT `history_created_by` FOREIGN KEY (`history_created_by`) REFERENCES `user` (`user_id`),
  CONSTRAINT `history_workload_id` FOREIGN KEY (`history_workload_id`) REFERENCES `workload` (`workload_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_email`, `user_name`, `user_password`, `user_role`) 
VALUES 
('admin@test.com', 'Admin User', '$2b$10$mUldAcThO9c1hnz2Fn6d8eA7xXfYMVp/ixyL8JdidhIc3SBNM7b76', 'admin'),
('dean@test.com', 'Dean User', '$2b$10$mUldAcThO9c1hnz2Fn6d8eA7xXfYMVp/ixyL8JdidhIc3SBNM7b76', 'คณบดี'),
('vice_dean_academic@test.com', 'Academic Vice Dean', '$2b$10$mUldAcThO9c1hnz2Fn6d8eA7xXfYMVp/ixyL8JdidhIc3SBNM7b76', 'รองคณบดีฝ่ายวิชาการ'),
('vice_dean_strategy@test.com', 'Strategy Vice Dean', '$2b$10$mUldAcThO9c1hnz2Fn6d8eA7xXfYMVp/ixyL8JdidhIc3SBNM7b76', 'รองคณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร'),
('vice_dean_discipline@test.com', 'Discipline Vice Dean', '$2b$10$mUldAcThO9c1hnz2Fn6d8eA7xXfYMVp/ixyL8JdidhIc3SBNM7b76', 'รองคณบดีฝ่ายวิจัยและนวัตกรรม'),
('vice_dean_student@test.com', 'Student Quality Vice Dean', '$2b$10$mUldAcThO9c1hnz2Fn6d8eA7xXfYMVp/ixyL8JdidhIc3SBNM7b76', 'รองคณบดีฝ่ายคุณภาพนิสิต'),
('staff@test.com', 'Staff User', '$2b$10$mUldAcThO9c1hnz2Fn6d8eA7xXfYMVp/ixyL8JdidhIc3SBNM7b76', 'พนักงาน');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

ALTER TABLE workload
ADD COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;