define(function(require,exports,module){
	var $=require('jquery');
	
	require('waterfall')($);
	var oWaterfall=$('.waterfall');

	oWaterfall.waterfall({
		'width':140,
		'space':5,
		'minCells':3,
		'maxCells':9,
	});
	
});