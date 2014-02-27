CREATE TABLE `landmark` (
	`id` int(10) unsigned not null auto_increment,
	`name` varchar(150),
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE `checkin` (
	`timestamp` datetime,
	`landmark_id` int(10) unsigned,
	`lat` float,
	`lng` float,
	`accuracy` int(10),
	`visibility` int(10) unsigned,
	PRIMARY KEY `id` (`timestamp`,`landmark_id`,`lat`,`lng`),
	FOREIGN KEY (landmark_id) REFERENCES landmark(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO landmark (name) VALUES ("Doi Suthep");


