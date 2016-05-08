#!/usr/bin/env node

var fs = require('fs'),
    xml2js = require('xml2js'),
    argv = require('yargs').argv,
    assert = require('assert'),
    path = require('path');

var trimmedDir = 'trimmed';

console.log('# pipe this to bash! or save it for later.');

argv._.forEach(function(fcpXmlPath) {
	var clip = path.basename(fcpXmlPath, '.xml');
	console.log('mkdir -p ', path.join(trimmedDir, clip));

	fs.readFile(fcpXmlPath, {encoding:'utf8'}, function(err, data) {
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

				var filename = path.basename(filePath, '.MP4');

				console.log('avconv -i "' + filePath + '" -ss ' + inSeconds + ' -t ' + duration / timebase + ' -vcodec libx264 -preset veryfast -crf 18 -acodec copy ' + path.join(trimmedDir, clip, filename) + '.mp4');
			});
		});
	});
});
