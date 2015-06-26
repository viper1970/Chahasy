// Startup Script for Mosca
// start this using "node run mosca"
// if you want to run the rule enigne as well use "node run rules"
// see package.json for details

var mosca = require("mosca");
var server = new mosca.Server({
  persistence:{
	path: "./mqttdb",
	factory: mosca.persistence.LevelUp
  },
  http: {
    port: 8080,
    bundle: true,
    static: './public'
  },
  logger:{
	  level:30
  }
  
});

