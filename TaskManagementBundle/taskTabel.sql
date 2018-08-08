DROP TABLE IF EXISTS `task_managment`;
CREATE TABLE `task_managment` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `description` text,
  `due_date` datetime NOT NULL,
  `priority` enum('High','Normal','Low') NOT NULL,
  `status` enum('Not started','In Progress','Completed') NOT NULL,
  `start_date` datetime NOT NULL,
  `completion_date` datetime NOT NULL,
  `associated_element` enum('object','document','asset') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;
