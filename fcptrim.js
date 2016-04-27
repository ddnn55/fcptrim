#!/usr/bin/env node

var fs = require('fs'),
    xml2js = require('xml2js'),
    argv = require('yargs').argv,
    assert = require('assert'),
    path = require('path');

console.log('# pipe this to bash! or save it for later.');

var clip = path.basename(argv._[0], '.xml');
console.log('mkdir -p ', path.join('trimmed', clip));

fs.readFile(argv._[0], {encoding:'utf8'}, function(err, data) {
	xml2js.parseString(data, function(err, project) {

		var duration = +project.xmeml.sequence[0].duration[0];

		project.xmeml.sequence[0].media[0].video[0].track.forEach(function(track) {
			
			var filePath = decodeURI(track.clipitem[0].file[0].pathurl[0].slice('file://localhost'.length));
			var _in = +track.clipitem[0].in[0];
			var out = +track.clipitem[0].out[0];
			var timebase = +track.clipitem[0].rate[0].timebase[0];
			
			assert.equal(0, +track.clipitem[0].start[0]);
			assert.equal(duration, out-_in);

			var inSeconds = _in / timebase;

			var filename = path.basename(filePath);

			console.log('avconv -i "' + filePath + '" -ss ' + inSeconds + ' -t ' + duration / timebase + ' -codec copy ' + path.join('trimmed', clip, filename));
		});
	});
});
