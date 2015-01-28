var timeloop = require('../lib/timeloop');

var tester = tester || {};

tester.loop = function ( )
{
	console.log( 'time =', timeloop.time );
	console.log( 'deltaTime =', timeloop.deltaTime );
};


timeloop.subscribe('tester', tester.loop, 1.0);