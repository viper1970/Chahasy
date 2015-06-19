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
			// remove existing handlers if any
			$('.btn-toggle').unbind('click');
			// and add a click handler
			$('.btn-toggle').click(function() {
				var topic = $(this).data('topic');
				// setting the value should not be done in the use interface, 
				// the ui should send the command and pickup the result
				// for now we do this in the browser
				
				if (topicIdx[topic].value == "on"){
					topicIdx[topic].value = "off";
				}
				else{
					topicIdx[topic].value = "on";
				}
				console.log("Toggle event detected for", topicIdx[topic].label, " linked to topic ", topic, " now switching to ",topicIdx[topic].value);
				client.publish(topic, topicIdx[topic].value);
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
	
function initUI(data){
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
	// subscribe to all topics found
	mqttClient.subscribe(Object.keys(topicIdx));
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

// start MQTT
var mqttClient = mqtt.connect();

// setup the listener for connect messages
mqttClient.on("connect", function(){
	mqttClient.subscribe("config/chahasy/ui");
});

// setup the listener for published messages
mqttClient.on("message", function(topic, payload) {
	var message = payload.toString();
	if (topic == "config/chahasy/ui"){
		console.log("Received config message:", message);
		var configData= JSON.parse(message);
		initUI(configData);
	}
	else{ 
		setVal(topic,message);
	}
});








 