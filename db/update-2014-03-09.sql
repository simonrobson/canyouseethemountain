SET time_zone = "UTC";

ALTER TABLE checkin ADD COLUMN new_timestamp timestamp default current_timestamp;
UPDATE checkin SET new_timestamp = FROM_UNIXTIME(timestamp);

ALTER TABLE checkin DROP PRIMARY KEY;
ALTER TABLE checkin DROP COLUMN timestamp;

ALTER TABLE checkin CHANGE new_timestamp timestamp timestamp default current_timestamp;

ALTER TABLE checkin ADD PRIMARY KEY (timestamp, location);
