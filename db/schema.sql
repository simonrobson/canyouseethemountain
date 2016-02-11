CREATE TABLE landmark (
	id int(10) unsigned not null auto_increment,
	name varchar(150),
	location point,
	area polygon,
	PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE checkin (
	timestamp timestamp default current_timestamp,
	timezone int(2),
	landmark_id int(10) unsigned,
	location point,
	accuracy int(10),
	visibility int(10) unsigned,
	PRIMARY KEY id (timestamp,location),
	FOREIGN KEY (landmark_id) REFERENCES landmark(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO landmark (name, location, area)
VALUES ("Doi Suthep",
	GeomFromText('POINT(18.812967110868183 98.92092343750006)'),
	GeomFromText('POLYGON((19.100399437472912 98.92092343750006,
                           19.100399437472912 99.23472043457038,
                           18.599583760233884 99.23472043457038,
                           18.599583760233884 98.92092343750006,
                           19.100399437472912 98.92092343750006))'));


