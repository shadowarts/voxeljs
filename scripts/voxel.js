define(['jquery'], function($, undefined) {
	var _display;

	/* 
	 * constructor 
	 */
	var voxel = function(id, fn) {
		_display = $(id);
		fn.apply(voxel);
	};

	voxel.map = function(_dim) {
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
			get: function(vector) {
				return _map[_to_cursor(vector)];
			},

			set: function(vector, value) {
				var ret;
				var cursor;

				cursor = _to_cursor(vector);

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

	/* state system */
	voxel.state = (function() {
		var _states = {};

		return (function(name, fn) {
			if(undefined !== fn) {
				return (_states[name] = fn);
			}

			setTimeout(function() {
				var state = _states[name];
				if(undefined !== name) {
					state.apply(fn);
				}
			}, 1);
		});
	})();

	/* drawing layer */
	voxel.layer = (function() {
		var _layers = {};
		var _zindex = 0;

		function __layer__(name, opts) {
			var _layer = $('<div/>', {
				'id': '__layer_' + name + '__',
				'class': '__layer__',
			}).css('z-index', _zindex++);

			/* add to display */
			_display.append(_layer);

			return (_layer = $.extend(_layer, {
				add: function(sprite) {
					_layer.append(sprite);
				},
				clear: function() {
					_layer.html('');
				}
			}));
		};

		return (function(name, opts) {
			var layer = _layers[name];
			if(undefined === layer) {
				layer = _layers[name] = __layer__(name, opts);
			}

			return layer;
		});
	})();

	return voxel;
});

/* vim: set ts=2 sw=2 tw=80: */

