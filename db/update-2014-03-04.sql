ALTER TABLE landmark ADD area POLYGON;

UPDATE landmark
SET area = GeomFromText('POLYGON((18.862617 98.932743,
                                  18.862617 99.233322,
                                  18.725037 99.233322,
                                  18.725037 98.932743,
                                  18.862617 98.932743))')
WHERE id = 1;
