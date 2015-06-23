// experiment to create a simple rule engine

var rules = require("./rules/demoRules.js");

function publish(topic,value){
	console.log('publishing topic:',topic,"value:",value);
	mqttClient.publish(topic, value);
}

var mqtt = require('mqtt');
var mqttClient = mqtt.connect();

mqttClient.on("connect", function(){
	// subscribe to events that trigger rules
	var ruleTopics=Object.keys(rules);
	ruleTopics.forEach(function(topic){
		console.log("Subscribing to:", JSON.stringify(topic));
	});
	mqttClient.subscribe(ruleTopics);
});

mqttClient.on("message", function(topic, payload) {
	// convert the payload to a string
	var message = payload.toString();
	// fire the rule for this topic and pickup the resulting actions (if any)
	var actions = rules[topic](topic,message);
	//  execute the resulting actions
	var actionTopics= Object.keys(actions);
	actionTopics.forEach(function(topic){
		publish(topic,actions[topic]);
	});
});






