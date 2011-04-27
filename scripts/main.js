define(['jquery', 'voxel'], function($, voxel, undefined) {
	
	var _map = [];

function pause(millis)
 {
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < millis);
}

	voxel('#map', function() {
		voxel.state('initialize', function() {
			console.log('initializing...');

			voxel.layer('map');
			voxel.layer('gui');

			/* display loading screen */
			voxel.layer('gui').html('<h1>Loading...</h1>');

			voxel.state('load');
		});

		voxel.state('load', function() {
			console.log('loading...');
			
			/* create map */
			_map = voxel.map([20, 20, 5]);
			for(var z = 0; z < 5; ++z) {
				for(var x = 0; x < 20; ++x) {
					for(var y = 0; y < 20; ++y) {
						if(z < 1) {
							_map.set([x,y,z], 'tile');
						} else if(x*y < z) {
							_map.set([x,y,z], 'tile');
						}
					}
				}
			}

			pause(5000);
			voxel.state('game');
		});

		voxel.state('loop', function() {
			console.log('loop');
		})

		voxel.state('game', function() {
			console.log('game');
			//voxel.layer('gui').clear();

		/* render map */
			var cx = $('#map').width() / 2;
			var cy = $('#map').height() / 2;
			
			var html = '';
			var cursor;
			var tile;

			for(var z = 0; z < 5; ++z) {
				for(var x = 0; x < 20; ++x) {
					for(var y = 0; y < 20; ++y) {
						tile = _map.get([x,y,z]);
						
						if(tile === undefined) {
							continue;
						}

						var vx, vy;
						vx = (x - y) * 16;
						vy = ((x/2) + (y/2)) * 18 - z * 8;

						html += '<div title=\'' + x + ', ' + y + ', ' + z + 
								'\' class=\'tile\' style=\'top:' + (cy + vy) + 
								'px;left:' + (cx + vx) + 'px;\'></div>';
					}
				}
			}
			console.log('map');
			pause(5000);
			voxel.layer('map').html(html);

			voxel.state('loop');
		});

		voxel.state('initialize');
	});

});
/* vim: set ts=2 sw=2 tw=80: */

