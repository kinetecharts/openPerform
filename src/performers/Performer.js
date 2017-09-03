//Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js

var THREE = require('three');
var bvhLoader = require('./../libs/three/loaders/BVHLoader.js');
var sceneLoader = require('./../libs/three/loaders/SceneLoader.js');

import TWEEN from 'tween'

import Common from './../util/Common'

import PerformerEffects from './../effects/performer'

import _ from 'lodash'
import dat from 'dat-gui'

class Performer {
	constructor(parent, inputId, performerId, type, color) {
		this.colors = [ "#036B75", "#0x0AFCE8", "#0xFCE508", "#0xFA0AE3", "#0x260C58" ];


		this.parent = parent;
		this.inputId = inputId;
		this.type = type;
		this.name = "Performer " + performerId;
		this.color = color;
		this.wireframe = true;
		this.visible = true;

		console.log("New Performer: ", this.inputId);

		this.scene = null;
		this.modelShrink = 100;
		this.loadSceneBody('./models/json/avatar.json');

		this.gui = new dat.GUI();
		this.guiDOM = this.gui.domElement;
		this.guiFolder = this.gui.addFolder(this.name + ' Effects');
		this.guiFolder.open()

		this.performerEffects = new PerformerEffects(this.parent, parseInt(this.color, 16), this.guiFolder);
		// this.addEffects(['datatags']);//defaults

		this.scaleInterval = null;
		this.colorInterval = null;
	}

	

	loadSceneBody(filename) {
		var loader = new THREE.SceneLoader();
		
		loader.callbackProgress = function( progress, result ) {
			console.log(progress);
		};
		loader.load( filename, function ( result ) {
			this.scene = result.scene;
			this.scene.scale.set(1/this.modelShrink,1/this.modelShrink,1/this.modelShrink);

			this.scene.traverse( function ( object ) {
				if ( object.name.toLowerCase().match(/robot_/g)) {
					if (!this.performer) {
						this.performer = {};
						this.performerKeys = {};
					}
					this.performer[object.name.toLowerCase()] = object;
					this.performerKeys[object.name.toLowerCase()] = object.name.toLowerCase();

					object.castShadow = true;
					object.receiveShadow = true;
					object.visible = this.visible;
				} else {
					if(object.hasOwnProperty("material")){ 
						object.material = new THREE.MeshPhongMaterial();
						object.material.wireframe = this.wireframe;
						object.material.color.set(parseInt(this.color,16));
						
						object.material.needsUpdate = true;
					}
				}
			}.bind(this) );
			
			this.performerKeys= Common.getKeys(this.performerKeys, "");
			
			this.parent.add(this.scene);

		}.bind(this) );
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

		this.performerEffects.update(this.scene);
	}

	updateFromPN(data) {
		for (var i=0; i<data.length; i++) {
			var jointName = "robot_" + data[i].name;
			if (this.performer[jointName]) {
				this.performer[jointName].position.set(
					data[i].position.x,
					data[i].position.y,
					data[i].position.z
				);

				this.performer[jointName].quaternion.copy(data[i].quaternion);
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
		this.scene.traverse( function ( part ) {
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
			this.scene.traverse( function ( part ) {
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
			var part = this.performer["robot_" + partname];
			part.scale.set(1,1,1);
		});
	}

	scalePart(partname, scale, animTime) {
		var part = this.performer["robot_" + partname];
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

	rotatePart(partname, rotation) {
		var part = this.performer["robot_" + partname];
		
		if (part) {
			part.rotation.set(rotation.x,rotation.y,rotation.z);
		}
	}

	unParentPart(partname, freeze) {
		var part = this.performer["robot_" + partname];
		
		if (part) {
			part.position.add(this.performer["robot_hips"].position);
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
						this.performer = _.omit(this.performer, parts);
					break;
					case 'rightshoulder':
						var parts = ['robot_rightshoulder',
						'robot_rightarm', 'robot_rightforearm', 'robot_righthand',
						'robot_righthandthumb1', 'robot_righthandthumb2', 'robot_righthandthumb3',
						'robot_rightinhandindex', 'robot_righthandindex1', 'robot_righthandindex2', 'robot_righthandindex3',
						'robot_rightinhandmiddle', 'robot_righthandmiddle1', 'robot_righthandmiddle2', 'robot_righthandmiddle3',
						'robot_rightinhandring', 'robot_righthandring1', 'robot_righthandring2', 'robot_righthandring3',
						'robot_rightinhandpinky', 'robot_righthandpinky1', 'robot_righthandpinky2', 'robot_righthandpinky3'];
						this.performer = _.omit(this.performer, parts);
					break;
					case 'leftupleg':
						var parts = ['robot_leftupleg', 'robot_leftleg', 'robot_leftfoot'];
						this.performer = _.omit(this.performer, parts);
					break;
					case 'rightupleg':
						var parts = ['robot_rightupleg', 'robot_rightleg', 'robot_rightfoot'];
						this.performer = _.omit(this.performer, parts);
					break;
					case 'head':
						var parts = ['robot_head'];
						this.performer = _.omit(this.performer, parts);
					break;

				}
			}
		}
	}

	showWireframe() {
		this.wireframe = true;
		_.each(this.performer, (parent) => {
			parent.traverse( ( object ) => {
				if(object.hasOwnProperty("material")){ 
					object.material.wireframe = this.wireframe;
				}
			});
		});
	}

	hideWireframe() {
		this.wireframe = false;
		_.each(this.performer, (parent) => {
			parent.traverse( ( object ) => {
				if(object.hasOwnProperty("material")){ 
					object.material.wireframe = this.wireframe;
				}
			});
		});
	}

	toggleWireframe() {
		this.wireframe = !this.wireframe;
		_.each(this.performer, (parent) => {
			parent.traverse( ( object ) => {
				if(object.hasOwnProperty("material")){ 
					object.material.wireframe = this.wireframe;
				}
			});
		});
	}

	distanceBetween(part1, part2) {
		var part1 = this.performer["robot_" + part1]; //find first body part by name
		var part2 = this.performer["robot_" + part2]; //find second body part by name
		if (part1 && part2) { //do they both exist?
			var joint1Global = new THREE.Vector3().setFromMatrixPosition( part1.matrixWorld );//we need the global position
			var joint2Global = new THREE.Vector3().setFromMatrixPosition( part2.matrixWorld );//we need the global position
			return joint1Global.distanceTo(joint2Global);//how far apart are they?
		}
		return 0;
	}
}

module.exports = Performer;