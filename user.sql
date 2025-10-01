-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 01, 2025 at 05:06 AM
-- Server version: 9.4.0
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
-- Table structure for table `option`
--

CREATE TABLE `option` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `priority` varchar(255) NOT NULL DEFAULT 'low'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `option`
--

INSERT INTO `option` (`id`, `title`, `priority`) VALUES
(3, 'test', 'low'),
(4, 'hello', 'high');

-- --------------------------------------------------------

--
-- Table structure for table `upload_file`
--

CREATE TABLE `upload_file` (
  `id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `workId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_role` varchar(255) NOT NULL DEFAULT 'พนักงาน'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_email`, `user_name`, `user_password`, `user_role`) VALUES
(1, 'admin@test.com', 'admin', '1234', 'admin'),
(5, 'kolanya.ta@up.ac.th', 'นางโกลัญญา ตายะ', '1234', 'หัวหน้าสำนักงาน'),
(6, 'ronnachai.th@up.ac.th', 'นายรณชัย ทิพย์มณฑา', '1234', 'หัวหน้างานฝ่ายบริหารทั่วไป'),
(7, 'wanphen.th@up.ac.th', 'นางสาววันเพ็ญ ถาวรโชติ', '1234', 'พนักงานฝ่ายบริหารทั่วไป'),
(8, 'nungruthai.te@up.ac.th', 'ว่าที่ร้อยตรีหญิงหนึ่งฤทัย กัลณา', '1234', 'พนักงานฝ่ายบริหารทั่วไป'),
(9, 'sirintra.in@up.ac.th', 'นางศิรินทรา บุญมา', '1234', 'พนักงานฝ่ายบริหารทั่วไป'),
(10, 'suthida.de@up.ac.th', 'นางสาวสุธิดา เดชะตา', '1234', 'พนักงานฝ่ายบริหารทั่วไป'),
(11, 'mayurate.sa@up.ac.th', 'นางสาวมยุเรศ แสงสว่าง', '1234', 'พนักงานฝ่ายบริหารทั่วไป'),
(12, 'panuwat.lo@up.ac.th', 'นายภานุวัฒน์ โลมากุล', '1234', 'พนักงานฝ่ายบริหารทั่วไป'),
(13, 'pongsakorn.si@up.ac.th', 'นายพงศกร ศิริคำน้อย', '1234', 'พนักงานฝ่ายบริหารทั่วไป'),
(14, 'suwimon.kr@up.ac.th', 'นางสุวิมล นามจิต', '1234', 'พนักงานฝ่ายบริหารทั่วไป'),
(15, 'sirirat.bu@up.ac.th', 'นางสาวสิริรัตน์ บัวเทศ', '1234', 'พนักงานฝ่ายบริหารทั่วไป'),
(16, 'donticha.ch@up.ac.th', 'นางสาวดลทิชา เชี่ยวสุวรรณ', '1234', 'หัวหน้างานฝ่ายวิชาการ'),
(17, 'naphat.ch@up.ac.th', 'นางสาวนภัทร ไชยมงคล', '1234', 'พนักงานฝ่ายวิชาการ'),
(18, 'nut.kr@up.ac.th', 'นายณัฏฐ์ กรีธาชาติ', '1234', 'พนักงานฝ่ายวิชาการ'),
(19, 'kittikun.nu@up.ac.th', 'นายกิตติคุณ นุผัด', '1234', 'พนักงานฝ่ายวิชาการ'),
(20, 'tiwakorn.so@up.ac.th', 'นายทิวากร สมวรรณ', '1234', 'พนักงานฝ่ายวิชาการ'),
(21, 'thawatchai.sa@up.ac.th', 'นายธวัชชัย แสนแก้ว', '1234', 'พนักงานฝ่ายวิชาการ'),
(22, 'pranorm.kh@up.ac.th', 'นางสาวประนอม เครือวัลย์', '1234', 'พนักงานฝ่ายวิชาการ'),
(23, 'kamolthip.ra@up.ac.th', 'นางกมลทิพย์ รักเป็นไทย', '1234', 'หัวหน้างานฝ่ายแผนงาน'),
(24, 'khingkan.si@up.ac.th', 'นางสาวกิ่งกาญจน์ สิงห์ประดัง', '1234', 'พนักงานฝ่ายแผนงาน'),
(25, 'nootchararat.ya@up.ac.th', 'นางนุชรารัตน์ ถาวะดี', '1234', 'พนักงานฝ่ายแผนงาน'),
(26, 'warapongk.kl@up.ac.th', 'นายวราพงษ์ คล่องแคล่ว', '1234', 'หัวหน้างานฝ่ายพัฒนาทักษะดิจิทัล'),
(27, 'napatsawan.kh@up.ac.th', 'นางสาวนภัสวรรณ คำอิสสระ', '1234', 'พนักงานฝ่ายพัฒนาทักษะดิจิทัล');

-- --------------------------------------------------------

--
-- Table structure for table `work`
--

CREATE TABLE `work` (
  `id` int NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `department` varchar(255) NOT NULL,
  `dateTimeStart` date DEFAULT NULL,
  `dateTimeEnd` date DEFAULT NULL,
  `userUserId` int DEFAULT NULL,
  `optionsId` int DEFAULT NULL,
  `dateTimeNow` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workload`
--

CREATE TABLE `workload` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'รอดำเนินการ',
  `priority` varchar(255) NOT NULL DEFAULT 'medium',
  `username` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `assignedToUserId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `option`
--
ALTER TABLE `option`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `upload_file`
--
ALTER TABLE `upload_file`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_cc5a1bda61158963c16a97a0153` (`workId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `IDX_65d72a4b8a5fcdad6edee8563b` (`user_email`);

--
-- Indexes for table `work`
--
ALTER TABLE `work`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_8ce97a29bd77cf99beadfc07251` (`userUserId`),
  ADD KEY `FK_c65765546a142f3d39ef434e1bc` (`optionsId`);

--
-- Indexes for table `workload`
--
ALTER TABLE `workload`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_595b449a4f9ddc334046c32aa2a` (`assignedToUserId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `option`
--
ALTER TABLE `option`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `upload_file`
--
ALTER TABLE `upload_file`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `work`
--
ALTER TABLE `work`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `workload`
--
ALTER TABLE `workload`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `upload_file`
--
ALTER TABLE `upload_file`
  ADD CONSTRAINT `FK_cc5a1bda61158963c16a97a0153` FOREIGN KEY (`workId`) REFERENCES `work` (`id`);

--
-- Constraints for table `work`
--
ALTER TABLE `work`
  ADD CONSTRAINT `FK_8ce97a29bd77cf99beadfc07251` FOREIGN KEY (`userUserId`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FK_c65765546a142f3d39ef434e1bc` FOREIGN KEY (`optionsId`) REFERENCES `option` (`id`);

--
-- Constraints for table `workload`
--
ALTER TABLE `workload`
  ADD CONSTRAINT `FK_595b449a4f9ddc334046c32aa2a` FOREIGN KEY (`assignedToUserId`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;