// create the ractive object
var ractive = new Ractive({
	el: renderOutput,
	template: '#renderTemplate',
	data: {
		formatTemp: function(val){ if (val) { return val + '°' }}
	}
});

