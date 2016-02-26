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
        ST_GeogFromText('POINT(98.92092343750006 18.812967110868183)'),
        ST_GeogFromText('POLYGON((98.68743896484375 19.094823935787016,
                                  99.239501953125 19.094823935787016,
                                  99.239501953125 18.567113311390806,
                                  98.68743896484375 18.567113311390806,
                                  98.68743896484375 19.094823935787016))'));
