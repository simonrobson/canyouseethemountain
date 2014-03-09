CREATE TABLE `landmark` (
	`id` int(10) unsigned not null auto_increment,
	`name` varchar(150),
	`location` point,
	`area` polygon,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE `checkin` (
	`timestamp` timestamp default current_timestamp,
	`timezone` int(2),
	`landmark_id` int(10) unsigned,
	`location` point,
	`accuracy` int(10),
	`visibility` int(10) unsigned,
	PRIMARY KEY `id` (`timestamp`,`location`),
	FOREIGN KEY (landmark_id) REFERENCES landmark(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO landmark (name, location, area)
VALUES ("Doi Suthep",
	GeomFromText('POINT(18.804139 98.922234)'),
	GeomFromText('POLYGON((18.862617 98.932743,
						  18.862617 99.233322,
						  18.725037 99.233322,
						  18.725037 98.932743,
						  18.862617 98.932743))'));


