/*
 Navicat Premium Data Transfer

 Source Server         : localhost_gomyck
 Source Server Type    : MySQL
 Source Server Version : 80015
 Source Host           : localhost
 Source Database       : demo

 Target Server Type    : MySQL
 Target Server Version : 80015
 File Encoding         : utf-8

 Date: 10/11/2019 08:48:37 AM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `t_comment`
-- ----------------------------
DROP TABLE IF EXISTS `t_comment`;
CREATE TABLE `t_comment` (
  `oid` int(11) NOT NULL,
  `posts_id` int(11) DEFAULT NULL,
  `msg_content` varchar(50) DEFAULT NULL,
  `create_time` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `t_comment`
-- ----------------------------
BEGIN;
INSERT INTO `t_comment` VALUES ('1', '1', '留言A1', '2019-09-10'), ('2', '1', '留言A2', '2019-09-11'), ('3', '2', '留言B1', '2019-09-01'), ('4', '2', '留言B2', '2019-09-09');
COMMIT;

-- ----------------------------
--  Table structure for `t_posts`
-- ----------------------------
DROP TABLE IF EXISTS `t_posts`;
CREATE TABLE `t_posts` (
  `oid` int(11) NOT NULL,
  `posts_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `t_posts`
-- ----------------------------
BEGIN;
INSERT INTO `t_posts` VALUES ('1', 'posts1'), ('2', 'posts2');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
