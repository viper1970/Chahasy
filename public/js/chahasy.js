function setPage(url){
	var newPage = pageIdx[url];
	if (typeof(newPage) != 'undefined'){
		items=pages[newPage].items;
		//console.log(JSON.stringify(items));
		ractive.set({
			pages:pages,
			items:items,
			currentPage: url
		}).then ( function(){ 
			$('.btn-toggle').click(function() {
				var topic = $(this).data('topic');
			
				if (topicIdx[topic].value == "on"){
					topicIdx[topic].value = "off";
				}
				else{
					topicIdx[topic].value = "on";
				}
				console.log("Toggle event detected for", topicIdx[topic].label, " linked to topic ", topic, " now switching to ",topicIdx[topic].value);
				ractive.update();
			})
		});
	}
}

function setVal(topic,value){
	if (topicIdx[topic] != 'undefined'){
			console.log("Setting value for topic ", topic, " to ", value);
			topicIdx[topic].value = value;
			ractive.update();
		}
}
	

// load data via JSON, this should be replaced by listening to MQTT
function loadData(){
	$.getJSON('data/values.json').done(function (data) { 
		for(var i = 0; i < data.values.length ; i++) {
			var item = data.values[i];
			setVal(item.topic, item.value);
		}
	});
}



function init(data){
	var itemIdx={};
	// Index items 
	for(var i = 0; i < data.items.length ; i++) {
		var item = data.items[i];
		itemIdx[item.id] = item;
		topicIdx[item.topic] = item;
	}
	// Index pages by URL and replace items by links to items (if any)
	
	for(var i = 0; i < data.pages.length ; i++) {
		var page = data.pages[i];
		pages[i] = page;
		pageIdx[page.url] = i;
		if ( page.items ){
			for(var j = 0; j < page.items.length ; j++) {
				page.items[j] = itemIdx[ page.items[j] ];
			}
		}
	}
	// lets see what we got
	//console.log(JSON.stringify(pages));
	//console.log(JSON.stringify(pageIdx));
	//console.log(JSON.stringify(itemIdx));

	// start at page 0
	currentPage = pages[0].url;
	// did the user jump directly to a specific page ?
	if (typeof pageIdx[location.hash] != 'undefined'){
		currentPage = location.hash;
	}
	// mark this page as active
	setPage(currentPage);
	// listen for URL changes
	window.onhashchange = function(){ setPage(location.hash)};
	// start loading data, this should be replaced by listening to MQTT
	loadData();
}	

var currentPage, pages=[], items={}, pageIdx={}, topicIdx={}; 

// create the ractive object
var ractive = new Ractive({
	el: renderOutput,
	template: '#renderTemplate',
	data: {
		formatTemp: function(val){ if (val) { return val + '°' }}
	}
});

// load setup via JSON, this should be replaced by listening to MQTT
 $.getJSON('data/objects.json').done(function (data) { init(data)});
 