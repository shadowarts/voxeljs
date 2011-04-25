function voxel() { 
	var _voxel = {};

	_voxel.map = function(_dim) {
		var _map;
	
		function _to_cursor(vector) {
			return vector[0] + _dim[1] * (vector[1] + _dim[2] * vector[2]);
		};

		function _to_vector(cursor) {
			var x,y,z;

			z = (cursor / (_dim[1] * _dim[2])) >> 0;
			y = ((cursor - _dim[1] * _dim[2] * z) / w) >> 0;
			x = (cursor - _dim[1] * _dim[2] * z) % w;

			return [x, y, z];
		};

		function _scalar_multiply(vector) {
			var cursor = _to_cursor(vector);

			return function(n) {
				return cursor * n;
			};
		};
		
		/* initialize */
		_map = [];

		return {
			/* cursor constants */
			Up: _scalar_multiply([0,0,1]),
			Down: _scalar_multiply([0,0,-1]),
			North: _scalar_multiply([0,1,0]),
			South: _scalar_multiply([0,-1,0]),
			East: _scalar_multiply([1,0,0]),
			West: _scalar_multiply([-1,0,0]),
			
			cursor: _to_cursor,
			vector: _to_vector,

			get: function(cursor) {
				return _map[cursor];
			},

			set: function(cursor, value) {
				var ret;

					ret = _map[cursor];
				_map[cursor] = value;

				return ret;
			},

			each: function(options, callback) {
				var cursor;

				for(var d = 0; d < options.distance; ++d) {
					for(var dir in options.directions) {
						cursor = options.origin + (d * _to_cursor(options.directions[dir]));
						callback.apply(callback, [cursor, _map[cursor]]);
					}
				}
			}
		};
	};

	return _voxel;
}

/* vim: set ts=2 sw=2 tw=80: */

