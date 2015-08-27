'use strict';

let geolib = require('geolib');
let airports = require('./data/us-airports.json').airports;
let latlonRegex = /([^:]+):([^:]+):([^:]+):([NU])/;

let position = {
  latitude: geolib.useDecimal("40° 41' N"),
  longitude: geolib.useDecimal("73° 38' W")
};

function convertToDecimal(airport) {
  let latMins = airport.latitude.replace(latlonRegex, '$1° $2\' $3" $4')
  let lonMins = airport.longitude.replace(latlonRegex, '$1° $2\' $3" W')

  return {
    latitude: geolib.useDecimal(latMins),
    longitude: geolib.useDecimal(lonMins)
  };
}

airports = airports.map(function (item) {
  let newPos = convertToDecimal(item);
  item.latitude = newPos.latitude;
  item.longitude = newPos.longitude;

  return item;
});

let bigAirports = [];
let x = 0;

while(bigAirports.length < 15000) {
  bigAirports.push(airports[x % airports.length]);
  x++;
}

console.time('nearest');
let nearest = geolib.findNearest(position, bigAirports, 0, 20);

nearest.forEach(function (item) {
  console.log(bigAirports[item.key]);
});

console.timeEnd('nearest');
