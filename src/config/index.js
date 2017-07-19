var THREE = require('three');

import config from './../../server/config.js'

var defaults = {
	debug: true,
	scene:null,
	camera: {
		closeShot: {
			position: new THREE.Vector3(0,1.5,5),
			look: new THREE.Vector3(0,1.5,0)
		},
		mediumShot: {
			position: new THREE.Vector3(0,1.5,10),
			look: new THREE.Vector3(0,1.5,0)
		},
		wideShot: {
			position: new THREE.Vector3(0,1.5,20),
			look: new THREE.Vector3(0,1.5,0)
		}
	},
	stats: true,
	keyboardHelp: false,
	inputs:['keyboard', 'mouse', 'perceptionNeuron', 'midiController'], //keyboard, kinecttransport, myo, neurosky, perceptionNeuron, gamepads, midiController
	performers:[],
	performerColors: ['FFFFFF', 'CB2402', 'F0F7FA', '5992AE', 'FF009B'],
	// performerColors: ['FF0000', '00FF00', '0000FF'],
	myo:null,
	kinectTransport:{
		port:config.kinectTransport.ports.outgoing
	},
	perceptionNeuron:{
		port:config.perceptionNeuron.ports.outgoing
	},
	gamepads:{
		ports: {
			incoming: config.gamepads.ports.incoming,
			outgoing: config.gamepads.ports.outgoing
		}
	},
	midiController:{
		ports: {
			incoming: config.midiController.ports.incoming,
			outgoing: config.midiController.ports.outgoing
		}
	},
	data: [],
	home: {
		target: {lat: 24.525961, lon: 15.255119},
		look: new THREE.Vector3(0,0,0),
		center:{lat: 48.425555, lon: 11.777344},
		zoom: 1835,
		data:[],
		title: "Europe",
		key: "europe"
	},
	defaultLocation: {
		lat: 37.795546, //Ferry Building
		lon: -122.393420
		// lat: 37.783378, //CounterPulse
		// lon: -122.410404
		// lat: 37.7740, //San Francisco, Center
		// lon: -122.4388
		// lat: 40.7141667,//NYC
		// lon: -74.0063889
		// lat: 41.594232, //Des Moines, Home
		// lon: -93.662504
		// lat: 41.600545, //Des Moines, Center
		// lon: -93.609106
		// lat: 41.587455, //801 Grand
		// lon: -93.628604
	},
	area:1, //31
	colorScheme:{
		buildings:{
			building:0x999999,
			building_part:0x999999,
			address:0x999999,
			closed:0x999999
		},
		places:0x999999,
		pois:0x999999,
		roads:{
			aerialway:0x000000,
			aeroway:0x000000,
			ferry:0x000000,
			highway:0x000000,
			major_road:0x000000,
			minor_road:0x000000,
			path:0x000000,
			piste:0x000000,
			racetrack:0x000000,
			rail:0x000000
		},
		earth:{
			archipelago:0x5C483A,
			arete:0x5C483A,
			cliff:0x5C483A,
			continent:0x5C483A,
			earth:0x5C483A,
			island:0x5C483A,
			islet:0x5C483A,
			ridge:0x5C483A,
			valley:0x5C483A
		},
		landuse:{
			aerodrome:0x33FF99,
			allotments:0x33FF99,
			amusement_ride:0x33FF99,
			animal:0x33FF99,
			apron:0x33FF99,
			aquarium:0x33FF99,
			artwork:0x33FF99,
			attraction:0x33FF99,
			aviary:0x33FF99,
			battlefield:0x33FF99,
			beach:0x33FF99,
			breakwater:0x33FF99,
			bridge:0x33FF99,
			camp_site:0x33FF99,
			caravan_site:0x33FF99,
			carousel:0x33FF99,
			cemetery:0x33FF99,
			cinema:0x33FF99,
			city_wall:0x33FF99,
			college:0x0A0298,
			commercial:0x203970,
			common:0xFFEFB5,
			cutline:0x33FF99,
			dam:0x33FF99,
			dike:0x33FF99,
			dog_park:0x8A3E20,
			enclosure:0x33FF99,
			farm:0x33FF99,
			farmland:0x8DBD0C,
			farmyard:0x8DBD0C,
			fence:0xFFFFFF,
			footway:0x33FF99,
			forest:0x33FF99,
			fort:0x33FF99,
			fuel:0xFFC803,
			garden:0x8DBD0C,
			gate:0x33FF99,
			generator:0x33FF99,
			glacier:0x33FF99,
			golf_course:0x8DBD0C,
			grass:0x8DBD0C,
			grave_yard:0xB8B3AD,
			groyne:0x33FF99,
			hanami:0x33FF99,
			hospital:0xD10000,
			industrial:0x33FF99,
			land:0x33FF99,
			library:0x33FF99,
			maze:0x33FF99,
			meadow:0x8DBD0C,
			military:0x33FF99,
			national_park:0x33FF99,
			nature_reserve:0x33FF99,
			natural_forest:0x33FF99,
			natural_park:0x33FF99,
			natural_wood:0x33FF99,
			park:0x8DBD0C,
			parking:0x000000,
			pedestrian:0xC5CDC8,
			petting_zoo:0x33FF99,
			picnic_site:0x33FF99,
			pier:0x33FF99,
			pitch:0x000000,
			place_of_worship:0x33FF99,
			plant:0x33FF99,
			playground:0x896D3C,
			prison:0x999999,
			protected_area:0x33FF99,
			quarry:0x33FF99,
			railway:0x33FF99,
			recreation_ground:0x33FF99,
			recreation_track:0x33FF99,
			residential:0xECF3F7,
			resort:0x33FF99,
			rest_area:0x33FF99,
			retail:0xFFFFFF,
			retaining_wall:0x999999,
			rock:0x33FF99,
			roller_coaster:0x33FF99,
			runway:0x33FF99,
			rural:0x33FF99,
			school:0xECA723,
			scree:0x33FF99,
			scrub:0x33FF99,
			service_area:0x33FF99,
			snow_fence:0x33FF99,
			sports_centre:0xB8B3AD,
			stadium:0xB8B3AD,
			stone:0x33FF99,
			substation:0x33FF99,
			summer_toboggan:0x33FF99,
			taxiway:0x33FF99,
			theatre:0x33FF99,
			theme_park:0x33FF99,
			tower:0xB8B3AD,
			trail_riding_station:0x33FF99,
			university:0x000000,
			urban_area:0x33FF99,
			urban:0x33FF99,
			village_green:0x33FF99,
			wastewater_plant:0x33FF99,
			water_park:0x33FF99,
			water_slide:0x33FF99,
			water_works:0x33FF99,
			wetland:0x33FF99,
			wilderness_hut:0x33FF99,
			wildlife_park:0x33FF99,
			winery:0x33FF99,
			winter_sports:0x33FF99,
			wood:0x33FF99,
			works:0x33FF99,
			zoo:0x33FF99
		},
		transit:0x999999,
		water:{
			basin:0x6B98D3,
			bay:0x6B98D3,
			canal:0x6B98D3,
			ditch:0x6B98D3,
			dock:0x6B98D3,
			drain:0x6B98D3,
			fjord:0x6B98D3,
			lake:0x6B98D3,
			ocean:0x6B98D3,
			playa:0x6B98D3,
			river:0x6B98D3,
			riverbank:0x6B98D3,
			sea:0x6B98D3,
			stream:0x6B98D3,
			strait:0x6B98D3,
			swimming_pool:0x6B98D3,
			water:0x6B98D3
		}
	},
	allowedLayers: [ //buildings, places, pois, roads, earth, landuse, transit, water
		{featureType:'buildings', drawType:'extrude', visible:true}, //extrude, shapes, segments, geo, buffer
		// {featureType:'places', drawType:'shapes', visible:true}, //extrude, shapes, segments, geo, buffer
		// {featureType:'pois', drawType:'shapes', visible:true}, //extrude, shapes, segments, geo, buffer
		{featureType:'roads', drawType:'buffer', visible:true}, //extrude, shapes, segments, geo, buffer
		{featureType:'landuse', drawType:'shapes', visible:true}, //extrude, shapes, segments, geo, buffer
		{featureType:'earth', drawType:'extrude', visible:true}, //extrude, shapes, segments, geo, buffer
		// {featureType:'transit', drawType:'shapes', visible:true}, //extrude, shapes, segments, geo, buffer
		{featureType:'water', drawType:'extrude', visible:true} //extrude, shapes, segments, geo, buffer
	] //extrude, shapes, segments, geo, buffer
};

module.exports = defaults;
