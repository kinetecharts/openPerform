//Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js

var THREE = require('three');
var objLoader = require('./../libs/three/loaders/OBJLoader.js');
var bvhLoader = require('./../libs/three/loaders/BVHLoader.js');
var sceneLoader = require('./../libs/three/loaders/SceneLoader.js');
var colladaLoader = require('./../libs/three/loaders/ColladaLoader2.js');

require('./../libs/BufferGeometryMerge.js');

import TWEEN from 'tween'

import Common from './../util/Common'

import PerformerEffects from './../effects/performer'

import _ from 'lodash'
import dat from 'dat-gui'

class Performer {
	constructor(parent, inputId, performerId, type, color) {
		this.colors = [ "#036B75", "#0x0AFCE8", "#0xFCE508", "#0xFA0AE3", "#0x260C58" ];

		this.styleInt = null;
		this.modelGeos = {};
		
		this.parent = parent;
		this.inputId = inputId;
		this.type = type;
		this.performer = null;
		this.name = "Performer " + performerId;
		this.color = color;
		this.wireframe = true;
		this.visible = true;
		this.prefix = "robot_";

		this.styles = ["default", "chairs", "hands", "heads", "spheres", "planes", "boxes", "robot", "discs", "oct"];
		this.styleId = 0;
		this.style = this.styles[this.styleId];
		this.intensity = 1;

		this.scene = null;
		this.modelShrink = 100;

		var bvhStructure = {
			hips: {
				rightupleg: {
					rightleg: {
						rightfoot: {}
					}
				},
				leftupleg: {
					leftleg: {
						leftfoot: {}
					}
				},
				spine: {
					spine1: {
						spine2: {
							spine3: {
								neck: {
									head: {}
								},
								rightshoulder: {
									rightarm: {
										rightforearm: {
											righthand: {
												righthandthumb1: {
													righthandthumb2: {
														righthandthumb3: {}
													}
												},
												rightinhandindex: {
													righthandindex1: {
														righthandindex2: {
															righthandindex3: {}
														}
													}
												},
												rightinhandmiddle: {
													righthandmiddle1: {
														righthandmiddle2: {
															righthandmiddle3: {}
														}
													}
												},
												rightinhandring: {
													righthandring1: {
														righthandring2: {
															righthandring3: {}
														}
													}
												},
												rightinhandpinky: {
													righthandpinky1: {
														righthandpinky2: {
															righthandpinky3: {}
														}
													}
												}
											}
										}
									}
								},
								leftshoulder: {
									leftarm: {
										leftforearm: {
											lefthand: {
												lefthandthumb1: {
													lefthandthumb2: {
														lefthandthumb3: {}
													}
												},
												leftinhandindex: {
													lefthandindex1: {
														lefthandindex2: {
															lefthandindex3: {}
														}
													}
												},
												leftinhandmiddle: {
													lefthandmiddle1: {
														lefthandmiddle2: {
															lefthandmiddle3: {}
														}
													}
												},
												leftinhandring: {
													lefthandring1: {
														lefthandring2: {
															lefthandring3: {}
														}
													}
												},
												leftinhandpinky: {
													lefthandpinky1: {
														lefthandpinky2: {
															lefthandpinky3: {}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		};




		this.hiddenParts = [
			
			// 'lefthandthumb',
			// 'leftinhandindex',
			// 'leftinhandmiddle',
			// 'leftinhandring',
			// 'leftinhandpinky',

			// 'righthandthumb',
			// 'rightinhandindex',
			// 'rightinhandmiddle',
			// 'rightinhandring',
			// 'rightinhandpinky',

			// 'leftfoot',
			// 'rightfoot'

			];

		console.log("New Performer: ", this.inputId);

		this.effects = ['cloner', 'datatags', 'trails', 'particleSystem'];

		this.gui = new dat.GUI();
		this.guiDOM = this.gui.domElement;
		this.guiFolder = this.gui.addFolder(this.name + ' Effects');
		this.guiFolder.open()

		this.performerEffects = new PerformerEffects(this.parent, parseInt(this.color, 16), this.guiFolder);
		
		// this.addEffects(this.effects[0]);//defaults

		this.scaleInterval = null;
		this.colorInterval = null;

		this.loadObjModel('hand', '/models/obj/hand.obj', (model) => {
			// object.geometry = model.geometry;
		});

		this.loadObjModel('head', '/models/obj/head.obj', (model) => {
			// object.geometry = model.geometry;
		});

		this.loadObjModel('chair', '/models/obj/chair.obj', (model) => {
			// object.geometry = model.geometry;
		});
	}

	loadPerformer(source, type, hide, size, style, intensity) {
		switch(type) {
			case 'bvhMeshGroup':
				this.loadSceneBody(source, './models/json/avatar.json', hide, size, style, intensity);
				break;
			case 'riggedMesh':
				this.loadColladaBody(source, './models/dae/neuron-bones.dae', hide, size, style, intensity);
				break;
		}
	}

	loadColladaBody(filename) {
		this.prefix = "";
		var loader = new THREE.ColladaLoader();
		// loader.options.convertUpAxis = true;
		loader.callbackProgress = function( progress, result ) {
			console.log(progress);
		};
		loader.load( filename, function ( result ) {
			this.scene = result.scene;
			this.getScene().scale.set(1/this.modelShrink,1/this.modelShrink,1/this.modelShrink);

			this.getScene().traverse( function ( object ) {
				if ( object.name.toLowerCase().match(/performer/g)) {
					object.traverse( function ( part ) {
						if (!this.performer) {
							this.performer = {};
							this.performerKeys = {};
						}
						this.performer[part.name.toLowerCase()] = part;
						this.performerKeys[part.name.toLowerCase()] = part.name.toLowerCase();

						part.castShadow = true;
						part.receiveShadow = true;
						part.visible = this.visible;
					}.bind(this));
				} /*else {
					if(object.hasOwnProperty("material")){ 
						object.material = new THREE.MeshPhongMaterial();
						object.material.wireframe = this.wireframe;
						object.material.color.set(parseInt(this.color,16));
						
						object.material.needsUpdate = true;
					}
				}*/
			}.bind(this) );
			
			this.performerKeys= Common.getKeys(this.performerKeys, "");
			
			this.parent.add(this.getScene());

		}.bind(this) );
	}

	loadSceneBody(source, filename, hide, size, style, intensity) {
		this.prefix = "robot_";
		var loader = new THREE.SceneLoader();
		
		loader.callbackProgress = ( progress, result ) => {
			console.log(progress);
		};
		loader.load( filename, ( result ) => {
			this.setScene(result.scene);
			switch (source) {
				case "bvh":
					this.getScene().scale.set(size, size, size);
					break;
			}

			this.setPerformer(this.parseBVHGroup(source, hide, style, intensity));
			this.parent.add(this.getScene());
			// this.addEffects([this.effects[Math.floor(Math.random()*this.effects.length)]]);//defaults

		});
	}

	setPerformer(performer) {
		this.performer = performer;
	}

	getPerformer() {
		return this.performer;
	}

	setScene(scene) {
		this.scene = scene;
	}

	getScene() {
		return this.scene;
	}

	getWireframe() {
		return this.wireframe;
	}

	getColor() {
		return this.color;
	}

	getStyleInt() {
		return this.styleInt;
	}

	setStyleInt(styleInt) {
		this.styleInt = styleInt;
	}

	getIntensity() {
		return this.intensity;
	}

	setIntensity(intensity) {
		this.intensity = intensity;
	}

	getStyles() {
		return this.styles;
	}

	getStyle() {
		return this.style;
	}

	getStyleId() {
		return this.styleId;
	}

	setStyleId(id) {
		this.styleId = id;
	}

	getNextStyle() {
		var styles = this.getStyles();
		var id = this.getStyleId();
		id++;
		if (id > styles.length-1) {
			id = 0;
		}
		this.setStyleId(id);
		return styles[id];
	}

	getPrevStyle() {
		var styles = this.getStyles();
		var id = this.getStyleId();
		id--;
		if (id < 0) {
			id = styles.length-1;
		}
		this.setStyleId(id);
		return styles[id];
	}

	setStyle(style) {
		this.style = style;
	}

	getHiddenParts() {
		return this.hiddenParts;
	}

	updateIntensity(intensity) {
		this.setIntensity(intensity);
		// this.parseBVHGroup("bvh", this.getHiddenParts(), this.getStyle(), intensity);
		_.each(this.getPerformer().newMeshes, (mesh) => {
			mesh.scale.set(intensity,intensity,intensity);
		});
	}

	updateStyle(style) {
		this.setStyle(style);
		this.parseBVHGroup("bvh", this.getHiddenParts(), style, this.getIntensity());
	}

	parseBVHGroup(source, hide, style, intensity) {
		var meshes = {};
		var newMeshes = [];
		var keys = {};

		if (this.getStyleInt()) {
			clearInterval(this.getStyleInt());
			this.setStyleInt(null);
		}
		this.setStyleInt(setTimeout(() => {
			this.getScene().traverse( ( object ) => {
				if ( object.name.toLowerCase().match(/robot_/g)) {
					meshes[object.name.toLowerCase()] = object;
					keys[object.name.toLowerCase()] = object.name.toLowerCase();

					if (_.some(hide, (el) => _.includes(object.name.toLowerCase(), el))) {
						object.visible = false;
					}

					object.castShadow = true;
					object.receiveShadow = true;
					// object.visible = this.visible;
				} else {
					if(object.hasOwnProperty("material")){ 
						object.material = new THREE.MeshPhongMaterial();
						object.material.wireframe = this.getWireframe();
						object.material.color.set(parseInt(this.getColor(),16));
						
						object.material.needsUpdate = true;
					}
				}
				if (object instanceof THREE.Mesh) {
					switch (source) {
						case "bvh":
							object.scale.set(2, 2, 2);
							break;
					}

					if (!object.srcBox) {
						object.geometry.computeBoundingBox();
						object.srcBox = object.geometry.boundingBox;
					}

					if (!object.srcSphere) {
						object.geometry.computeBoundingSphere();
						object.srcSphere = object.geometry.boundingSphere;
					}

					switch (style) {
						case "spheres":
							var scale = 0.01;//Common.mapRange(intensity, 1, 10, 0.01, 3)
							var geo = new THREE.SphereGeometry( 
								object.srcSphere.radius*scale,
							10, 10 );
							object.geometry = geo;
							break;

						case "planes":
							var scale = 0.01;//Common.mapRange(intensity, 1, 10, 0.01, 1)
							var geo = new THREE.BoxGeometry( 
								object.srcSphere.radius*scale,
							10, 10 );
							object.geometry = geo;
							break;

						case "boxes":
						var scale = 0.25;//Common.mapRange(intensity, 1, 10, 0.01, 5)
							var geo = new THREE.BoxGeometry( 
								object.srcSphere.radius*scale,
								object.srcSphere.radius*scale,
								object.srcSphere.radius*scale
							);
							object.geometry = geo;
							break;

						case "robot":
							var scale = 1;//Common.mapRange(intensity, 1, 10, 0.01, 2)
							var geo = new THREE.BoxGeometry( 
								object.srcBox.max.x*scale,
								object.srcBox.max.z*scale,
								object.srcBox.max.y*scale,
							);
							object.geometry = geo;
							break;

						case "discs":
							var scale = 1;//Common.mapRange(intensity, 1, 10, 0.01, 2)
							var geo = new THREE.CylinderGeometry(
								object.srcBox.max.x*scale,
								object.srcBox.max.x*scale,
								object.srcBox.max.y*scale,
								10
							);
							object.geometry = geo;
							break;

						case "oct":
							var scale = 0.1;//Common.mapRange(intensity, 1, 10, 0.01, 2)
							var geo = new THREE.TetrahedronGeometry(object.srcSphere.radius*scale, 1);
							object.geometry = geo;
							break;

						case "hands":
							object.geometry = this.getModelGeo("hand");
							// var scale = 0.1;//Common.mapRange(intensity, 1, 10, 0.01, 2)
							// var geo = new THREE.TetrahedronGeometry(object.srcSphere.radius*scale, 1);
							// object.geometry = geo;
							break;

						case "heads":
							object.geometry = this.getModelGeo("head");
							// var scale = 0.1;//Common.mapRange(intensity, 1, 10, 0.01, 2)
							// var geo = new THREE.TetrahedronGeometry(object.srcSphere.radius*scale, 1);
							// object.geometry = geo;
							break;

						case "chairs":
							object.geometry = this.getModelGeo("chair");
							// var scale = 0.1;//Common.mapRange(intensity, 1, 10, 0.01, 2)
							// var geo = new THREE.TetrahedronGeometry(object.srcSphere.radius*scale, 1);
							// object.geometry = geo;
							break;
					}

					object.geometry.needsUpdate = true;
					newMeshes.push(object);
				}
			});

		},
		250));
		return {
			keys: Common.getKeys(keys, ""),
			meshes: meshes,
			newMeshes: newMeshes,
			scene: scene
		};
	}

	getModelGeo(id) {
		// console.log("Fetching geometry: ", id, this.modelGeos[id]);
		return this.modelGeos[id];
	}

	setModelGeo(id, model) {
		this.modelGeos[id] = model;
		// console.log("Adding geometry: " + id, this.modelGeos);
	}

	loadObjModel(id, url, callback) {
		if (this.getModelGeo(id) !== undefined) { console.log("Geometry already exists."); return this.getModelGeo(id); }

		// console.log("Loading...", typeof this.getModelGeo(id));

		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};

		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};

		var onError = function ( xhr ) {};

		var loader = new THREE.OBJLoader( manager );
		console.log(loader);
		loader.load( url, ( object ) => {
			let singleGeo = null
			object.traverse(( child ) => {
				console.log(child.name, child.type);
				if ( child instanceof THREE.Mesh ) {
					if (!singleGeo) {
						console.log("Before: ", child.geometry);
						// if (child.geometry.type.toLowerCase() == "buffergeometry") {
						// 	singleGeo = new THREE.BufferGeometry(child.geometry);
						// } else {
							// singleGeo = new THREE.Geometry(child.geometry);
						// }
						singleGeo = child.geometry;
					} else {
						console.log("Merging...");
						child.updateMatrix();
						singleGeo.merge(child.geometry, child.matrix);
					}
				}
			} );

			console.log("Final geo: ", singleGeo);
			this.setModelGeo(id, singleGeo);
			callback( this.getModelGeo(id) );
		}, onProgress, onError );
	}

	updateParameters(data) {
		switch(data.parameter) {
    		case 'rate':
    			this.performerEffects.updateParameters(data);
    			break;
    		case 'life':
				this.performerEffects.updateParameters(data);
    			break;
    	}
	}

	update(data) {
		switch(this.type) {
			case 'perceptionNeuron':
				this.updateFromPN(data);
			break;
		}

		this.performerEffects.update(this.getScene());
	}

	updateFromPN(data) {
		for (var i=0; i<data.length; i++) {
			var jointName = this.prefix + data[i].name.toLowerCase();
			if (!this.getPerformer()) {

				this.loadPerformer(
					"bvh",
					"bvhMeshGroup",
					this.hiddenParts,
					1/this.modelShrink,
					this.style,
					this.intensity);
			} else {
				if (this.getPerformer().meshes[jointName]) {
					this.getPerformer().meshes[jointName].position.set(
						data[i].position.x,
						data[i].position.y,
						data[i].position.z
					);

					this.getPerformer().meshes[jointName].quaternion.copy(data[i].quaternion);
				}
			}
		}
	}

	addEffects(effects) {
		_.each(effects, (effect) => {
			this.addEffect(effect);
		});
	}

	removeEffects(effects) {
		_.each(effects, (effect) => {
			this.removeEffect(effect);
		});
	}

	addEffect(effect) {
		this.performerEffects.add(effect);
	}

	removeEffect(effect) {
		this.performerEffects.remove(effect);
	}

	getScene() {
		return this.scene;
	}

	randomizeAll(switchTime) {
		// var parts = ['head', 'leftshoulder', 'rightshoulder', 'leftupleg',  'rightupleg'];
		var bvhStructure = {
			hips: {
				rightupleg: {
					rightleg: {
						rightfoot: {}
					}
				},
				leftupleg: {
					leftleg: {
						leftfoot: {}
					}
				},
				spine: {
					spine1: {
						spine2: {
							spine3: {
								neck: {
									head: {}
								},
								rightshoulder: {
									rightarm: {
										rightforearm: {
											righthand: {
												righthandthumb1: {
													righthandthumb2: {
														righthandthumb3: {}
													}
												},
												rightinhandindex: {
													righthandindex1: {
														righthandindex2: {
															righthandindex3: {}
														}
													}
												},
												rightinhandmiddle: {
													righthandmiddle1: {
														righthandmiddle2: {
															righthandmiddle3: {}
														}
													}
												},
												rightinhandring: {
													righthandring1: {
														righthandring2: {
															righthandring3: {}
														}
													}
												},
												rightinhandpinky: {
													righthandpinky1: {
														righthandpinky2: {
															righthandpinky3: {}
														}
													}
												}
											}
										}
									}
								},
								leftshoulder: {
									leftarm: {
										leftforearm: {
											lefthand: {
												lefthandthumb1: {
													lefthandthumb2: {
														lefthandthumb3: {}
													}
												},
												leftinhandindex: {
													lefthandindex1: {
														lefthandindex2: {
															lefthandindex3: {}
														}
													}
												},
												leftinhandmiddle: {
													lefthandmiddle1: {
														lefthandmiddle2: {
															lefthandmiddle3: {}
														}
													}
												},
												leftinhandring: {
													lefthandring1: {
														lefthandring2: {
															lefthandring3: {}
														}
													}
												},
												leftinhandpinky: {
													lefthandpinky1: {
														lefthandpinky2: {
															lefthandpinky3: {}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		};

		var parts = Common.getKeys(bvhStructure, "");
		_.each(parts, (part) => {
			this.scalePart(part, Common.mapRange(Math.random(), 0, 1, 0.25, 3),switchTime);	
		});
		if (this.scaleInterval) {
			clearInterval(this.scaleInterval);
		}
		this.scaleInterval  = setInterval(() => {
			_.each(parts, (part) => {
				this.scalePart(part, Common.mapRange(Math.random(), 0, 1, 0.25, 3),switchTime);	
			});
		}, switchTime)
	}

	randomizeColors(switchTime) {
		this.getScene().traverse( function ( part ) {
			if(part.hasOwnProperty("material")){ 
				// part.material = new THREE.MeshPhongMaterial();
				part.material.wireframe = this.wireframe;
				part.material.color.set(this.colors[Common.mapRange(Math.random(), 0, 1, 0, this.colors.length-1)]);
				
				part.material.needsUpdate = true;
			}
		}.bind(this));
		if (this.colorInterval) {
			clearInterval(this.colorInterval);
		}
		this.colorInterval  = setInterval(() => {
			this.getScene().traverse( function ( part ) {
				if(part.hasOwnProperty("material")){ 
					// part.material = new THREE.MeshPhongMaterial();
					part.material.wireframe = this.wireframe;
					part.material.color.set(this.colors[Common.mapRange(Math.random(), 0, 1, 0, this.colors.length-1)]);
					
					part.material.needsUpdate = true;
				}
			}.bind(this));
		}, switchTime)
	}

	randomizeLimbs(switchTime) {
		var parts = ['head', 'leftshoulder', 'rightshoulder', 'leftupleg',  'rightupleg'];
		_.each(parts, (part) => {
			this.scalePart(part, Common.mapRange(Math.random(), 0, 1, 0.75, 1.5),switchTime);	
		});
		if (this.scaleInterval) {
			clearInterval(this.scaleInterval);
		}
		this.scaleInterval  = setInterval(() => {
			_.each(parts, (part) => {
				this.scalePart(part, Common.mapRange(Math.random(), 0, 1, 0.75, 1.5), switchTime);	
			});
		}, switchTime)
	}

	resetScale() {
		if (this.scaleInterval) {
			clearInterval(this.scaleInterval);
		}
		var bvhStructure = {
			hips: {
				rightupleg: {
					rightleg: {
						rightfoot: {}
					}
				},
				leftupleg: {
					leftleg: {
						leftfoot: {}
					}
				},
				spine: {
					spine1: {
						spine2: {
							spine3: {
								neck: {
									head: {}
								},
								rightshoulder: {
									rightarm: {
										rightforearm: {
											righthand: {
												righthandthumb1: {
													righthandthumb2: {
														righthandthumb3: {}
													}
												},
												rightinhandindex: {
													righthandindex1: {
														righthandindex2: {
															righthandindex3: {}
														}
													}
												},
												rightinhandmiddle: {
													righthandmiddle1: {
														righthandmiddle2: {
															righthandmiddle3: {}
														}
													}
												},
												rightinhandring: {
													righthandring1: {
														righthandring2: {
															righthandring3: {}
														}
													}
												},
												rightinhandpinky: {
													righthandpinky1: {
														righthandpinky2: {
															righthandpinky3: {}
														}
													}
												}
											}
										}
									}
								},
								leftshoulder: {
									leftarm: {
										leftforearm: {
											lefthand: {
												lefthandthumb1: {
													lefthandthumb2: {
														lefthandthumb3: {}
													}
												},
												leftinhandindex: {
													lefthandindex1: {
														lefthandindex2: {
															lefthandindex3: {}
														}
													}
												},
												leftinhandmiddle: {
													lefthandmiddle1: {
														lefthandmiddle2: {
															lefthandmiddle3: {}
														}
													}
												},
												leftinhandring: {
													lefthandring1: {
														lefthandring2: {
															lefthandring3: {}
														}
													}
												},
												leftinhandpinky: {
													lefthandpinky1: {
														lefthandpinky2: {
															lefthandpinky3: {}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		};

		var parts = Common.getKeys(bvhStructure, "");
		_.each(parts, (partname) => {
			var part = this.getPerformer().meshes["robot_" + partname];
			part.scale.set(1,1,1);
		});
	}

	scalePart(partname, scale, animTime) {
		var part = this.getPerformer().meshes["robot_" + partname];
		var s = {x: part.scale.x};
		if (part) {
			var tween  = new TWEEN.Tween(s)
			.to({x:scale}, animTime)
			.onUpdate(()=>{
				part.scale.set(s.x,s.x,s.x);
			})
			.easing(TWEEN.Easing.Quadratic.InOut)
			.start();

			
		}
	}

	hidePart(partname) {
		var part = this.getPerformer().meshes["robot_" + partname];
		if (part) {
			part.visible = false;
		}
	}

	rotatePart(partname, rotation) {
		var part = this.getPerformer().meshes["robot_" + partname];
		
		if (part) {
			part.rotation.set(rotation.x,rotation.y,rotation.z);
		}
	}

	unParentPart(partname, freeze) {
		var part = this.getPerformer().meshes["robot_" + partname];
		
		if (part) {
			part.position.add(this.getPerformer().meshes["robot_hips"].position);
			part.parent = this.getScene();

			if (freeze) {
				switch(partname) {
					case 'leftshoulder':
						var parts = ['robot_leftshoulder',
						'robot_leftarm', 'robot_leftforearm', 'robot_lefthand',
						'robot_lefthandthumb1', 'robot_lefthandthumb2', 'robot_lefthandthumb3',
						'robot_leftinhandindex', 'robot_lefthandindex1', 'robot_lefthandindex2', 'robot_lefthandindex3',
						'robot_leftinhandmiddle', 'robot_lefthandmiddle1', 'robot_lefthandmiddle2', 'robot_lefthandmiddle3',
						'robot_leftinhandring', 'robot_lefthandring1', 'robot_lefthandring2', 'robot_lefthandring3',
						'robot_leftinhandpinky', 'robot_lefthandpinky1', 'robot_lefthandpinky2', 'robot_lefthandpinky3'];
						this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
					break;
					case 'rightshoulder':
						var parts = ['robot_rightshoulder',
						'robot_rightarm', 'robot_rightforearm', 'robot_righthand',
						'robot_righthandthumb1', 'robot_righthandthumb2', 'robot_righthandthumb3',
						'robot_rightinhandindex', 'robot_righthandindex1', 'robot_righthandindex2', 'robot_righthandindex3',
						'robot_rightinhandmiddle', 'robot_righthandmiddle1', 'robot_righthandmiddle2', 'robot_righthandmiddle3',
						'robot_rightinhandring', 'robot_righthandring1', 'robot_righthandring2', 'robot_righthandring3',
						'robot_rightinhandpinky', 'robot_righthandpinky1', 'robot_righthandpinky2', 'robot_righthandpinky3'];
						this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
					break;
					case 'leftupleg':
						var parts = ['robot_leftupleg', 'robot_leftleg', 'robot_leftfoot'];
						this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
					break;
					case 'rightupleg':
						var parts = ['robot_rightupleg', 'robot_rightleg', 'robot_rightfoot'];
						this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
					break;
					case 'head':
						var parts = ['robot_head'];
						this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
					break;

				}
			}
		}
	}

	showWireframe() {
		this.wireframe = true;
		_.each(this.getPerformer().meshes, (parent) => {
			parent.traverse( ( object ) => {
				if(object.hasOwnProperty("material")){ 
					object.material.wireframe = this.wireframe;
				}
			});
		});
	}

	hideWireframe() {
		this.wireframe = false;
		_.each(this.getPerformer().meshes, (parent) => {
			parent.traverse( ( object ) => {
				if(object.hasOwnProperty("material")){ 
					object.material.wireframe = this.wireframe;
				}
			});
		});
	}

	toggleWireframe() {
		this.wireframe = !this.wireframe;
		_.each(this.getPerformer().meshes, (parent) => {
			parent.traverse( ( object ) => {
				if(object.hasOwnProperty("material")){ 
					object.material.wireframe = this.wireframe;
				}
			});
		});
	}

	distanceBetween(part1, part2) {
		var part1 = this.getPerformer().meshes["robot_" + part1]; //find first body part by name
		var part2 = this.getPerformer().meshes["robot_" + part2]; //find second body part by name
		if (part1 && part2) { //do they both exist?
			var joint1Global = new THREE.Vector3().setFromMatrixPosition( part1.matrixWorld );//we need the global position
			var joint2Global = new THREE.Vector3().setFromMatrixPosition( part2.matrixWorld );//we need the global position
			return joint1Global.distanceTo(joint2Global);//how far apart are they?
		}
		return 0;
	}
}

module.exports = Performer;