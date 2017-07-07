module.exports = config;

var config = {
	verticadb: {
		enabled: false,
		host: 'localhost',
		port: 5433,
		user: 'dbadmin',
		password: '',
		database: 'docker'
	},
	mongodb: {
		enabled: false,
		dbName:'databasName',
		port: 27017,
		files:'./data/db/'
	},
	app: {
		port: 8000
	},
	browserSync:{
		port: 8080
	},
	favicon: __dirname + './../build/images/favicon.ico',
	login: { //turn on to force user to login with shared password
		enabled: false,
		password: 'ringCentral2017'
	},
	kinectTransport: {
		enabled: false,
		ports: {
			incoming:3000,
			outgoing:9999
		}
	},
	perceptionNeuron: {
		enabled: true,
		ip:'192.168.1.250', //ip the Axis Neuron translation app is broadcasting from
		ports: {
			incoming:9000, //port the Axis Neuron translation app is broadcasting on
			outgoing:9100 //port the browser connects on
		}
	},
	gamepads: {
		enabled: false,
		ports: {
			outgoing:9101 //port the browser connects on
		}
	},
	midiController: {
		enabled: true,
		ports: {
			outgoing:9201 //port the browser connects on
		}
	},
	mapzen: {
		enabled: false,
		baseURL: 'https://tile.mapzen.com/mapzen/vector/v1',
		dataKind: 'all',
		fileFormat: 'json',
		zoom: 16,
		api_key:'xxxxxx-xxxxxx',
		freshness: 24 * 60 * 60 * 1000 // 24 hours
	}
};

module.exports = config;