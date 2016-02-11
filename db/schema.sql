CREATE TABLE landmark (
	id SERIAL NOT NULL,
	name varchar(150),
	location GEOGRAPHY(POINT, 4326),
	area GEOGRAPHY(POLYGON, 4326),
	PRIMARY KEY (id)
);

CREATE TABLE checkin (
	timestamp timestamp default current_timestamp,
	timezone integer,
	landmark_id integer,
	location GEOGRAPHY(POINT, 4326),
	accuracy integer,
	visibility integer,
	PRIMARY KEY (timestamp,location),
	FOREIGN KEY (landmark_id) REFERENCES landmark(id)
);

INSERT INTO landmark (name, location, area)
VALUES ('Doi Suthep',
	    ST_GeogFromText('POINT(18.812967110868183 98.92092343750006)'),
	    ST_GeogFromText('POLYGON((19.100399437472912 98.92092343750006,
                                  19.100399437472912 99.23472043457038,
                                  18.599583760233884 99.23472043457038,
                                  18.599583760233884 98.92092343750006,
                                  19.100399437472912 98.92092343750006))'));


