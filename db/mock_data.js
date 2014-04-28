var fs = require('fs'),
	geojson = require('../node_modules/geojson2wkt/Geojson2Wkt.js'),
	moment = require('../public/js/moment.js'),
	lines = fs.readFileSync('foo.txt', 'utf8').split('\n'),
	config = getConfig(),
	values = [],
	todayTimestamp = getToday();

lines.pop(); //remove gabage

// lines.forEach(function(line){
// 	values.push(getValue(line));
// });

for (var i=0; i<config.days; i++) {
	todayTimestamp -= (config.secondsInDay*i);
	nameItLater(todayTimestamp);
}

fs.writeFileSync('../db/mock_data.sql', generateSQL(values));

function nameItLater(todayTimestamp){
	lines.forEach(function(line){
		values.push(getValue(line, config, todayTimestamp));
	});
}

function getToday(){
	var nowSec = Date.now(),
		arrayOfDate = moment(nowSec).utc().format("YYYY-MM-DD").split('-');
	return new Date(arrayOfDate).getTime();
}

function getConfig(){
	var param = process.argv[2],
		number = parseInt(process.argv[3], 10),
		config = {
			days : 1,
			timezone: 7,
			landmark_id: 1,
			secondsInDay: 86400000
		};
		if ((process.argv[2] && process.argv[3])){
			if (param === '-d' && number){ config.days = number; }
		}
	return config;
}


function generateSQL(values){
	var lock = 'LOCK TABLES `checkin` WRITE;\n',
		unlock = ';\nUNLOCK TABLES;',
		column = '(timezone,landmark_id,location,accuracy,visibility,timestamp)',
		header = 'INSERT INTO `checkin` ' + column +' VALUES \n';

	return lock + header + values.join(',\n') + unlock;
}

function getValue(line, config, todayTimestamp){
	var sec = 0;
	var values = [ config.timezone, config.landmark_id, getLocation(line), getAccuracy(), getVisibility() ,getTimeStamp(todayTimestamp) ];
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

function getTimeStamp(todayTimestamp){
	var rndTimestampInday = todayTimestamp + Math.floor(Math.random()*config.secondsInDay);
	return "'" + moment(rndTimestampInday).format("YYYY-MM-DD HH:MM:SS") + "'";
}

function timeConverter(ictDate){
	var hour = ictDate.getHours() + Math.floor(Math.random()*7),
    min = ictDate.getMinutes(),
    sec = ictDate.getSeconds();
		hour = (''+hour).length < 2 ? '0'+hour : hour;
		min = (''+min).length < 2 ? '0'+min : min;
		sec = (''+sec).length < 2 ? '0'+sec : sec;
	return hour+':'+min+':'+sec ;
}

function dateConverter(ictDate){
	var day = ictDate.getDate(),
		month = (ictDate.getMonth()+1),
		year = ictDate.getFullYear();
		day = (''+day).length < 2 ? '0'+day : day;
		month = (''+month).length < 2 ? '0'+month : month;
	return year + '-' + month + '-' + day;
}
