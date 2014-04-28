var fs = require('fs'),
  geojson = require('../node_modules/geojson2wkt/Geojson2Wkt.js'),
	lines = fs.readFileSync('../db/foo.txt', 'utf8').split('\n'),
	areaOption = {
		timezone: 7,
		landmark_id: 1
	};
	values = [];

lines.pop(); //remove gabage

lines.forEach(function(line){
	values.push(getValue(line));
});

fs.writeFileSync('../db/mock_data.sql', generateSQL(values));

function generateSQL(values){
	var lock = 'LOCK TABLES `checkin` WRITE;\n',
		unlock = ';\nUNLOCK TABLES;',
		column = '(timezone,landmark_id,location,accuracy,visibility,timestamp)',
		header = 'INSERT INTO `checkin` '+ column +' VALUES \n';

	return lock + header + values.join(',\n') + unlock;
}

function getValue(line){
	var sec = 0;
	var values = [ areaOption.timezone, areaOption.landmark_id, getLocation(line), getAccuracy(), getVisibility() ,getTimeStamp() ];
	return '(' + values.join(',') + ')';
}

function getCoordinate(line){
	var latLong = line.split('\t');
	return [latLong[1], latLong[3]];
}

function getLocation(line){
	var point = {"type": "Point", coordinates: getCoordinate(line)};
	return "GeomFromText('" + geojson.convert(point) + "')";
}

function getVisibility(){	return Math.floor((Math.random()*3))*50; }//rand 0,50,100

function getAccuracy(){	return Math.floor(Math.random()*60)+20; }//rand 20-80

function getTimeStamp(){
	var	ictDate = new Date(Date.now()),
		dateTimeStr =  dateConverter(ictDate) + ' ' + timeConverter(ictDate);
		console.log('time', dateTimeStr);
	return "'" + dateTimeStr + "'";
}

function timeConverter(ictDate){
	var hour = ictDate.getHours() + Math.floor(Math.random()*7),
    min = ictDate.getMinutes(),
    sec = ictDate.getSeconds();
    if ((hour+'').length < 2) { hour = '0' + hour; }
    if ((min+'').length < 2) { min = '0' + min; }
    if ((sec+'').length < 2) {sec = '0' + sec; }

	return hour+':'+min+':'+sec ;
 }

function dateConverter(ictDate){
	var day = ictDate.getDate(),
		month = (ictDate.getMonth()+1),
		year = ictDate.getFullYear();
    if ((day+'').length < 2) { day = '0' + day; }
    if ((month+'').length < 2) { month = '0' + month; }

	return year + '-' + month + '-' + day;
}
