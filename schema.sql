CREATE TABLE `landmark` (
	`id` int(10) unsigned not null auto_increment,
	`name` varchar(150),
	`location` point,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE `checkin` (
	`timestamp` int(11) unsigned,
	`timezone` int(2),
	`landmark_id` int(10) unsigned,
	`location` point,
	`accuracy` int(10),
	`visibility` int(10) unsigned,
	PRIMARY KEY `id` (`timestamp`,`landmark_id`,`location`),
	FOREIGN KEY (landmark_id) REFERENCES landmark(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO landmark (name, location)
	VALUES ("Doi Suthep", GeomFromText("POINT(18.804139 98.922234)"));


