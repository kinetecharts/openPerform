//Creates websocket, this.callbacks["message"](bones); should call the updateFromPN in Performer.js
var THREE = require('three');
var _ = require('lodash').mixin(require('lodash-keyarrange'));

import Common from './../util/Common'

class PerceptionNeuron {
	constructor(url) {
		this.callbacks = {};

		this.websocket = null;
		this.initializeWebSocket(url);
	}

	initializeWebSocket(url) {
		console.log("Connecting to: ", url);

		this.websocket = new WebSocket(url);
		this.websocket.onopen = this.onOpen.bind(this);
		this.websocket.onclose = this.oClose;
		this.websocket.onmessage = this.onMessage.bind(this);
		this.websocket.onerror = this.onError;
	}

	onOpen(evt) {
		console.log('PerceptionNeuron connected:', evt)
	}

	onClose(evt) {
		console.log('PerceptionNeuron disconnected:', evt);
	}
	
	onMessage(msg) {
		var bvhStructure = {
			Hips: {
				RightUpLeg: {
					RightLeg: {
						RightFoot: {}
					}
				},
				LeftUpLeg: {
					LeftLeg: {
						LeftFoot: {}
					}
				},
				Spine: {
					Spine1: {
						Spine2: {
							Spine3: {
								Neck: {
									Head: {}
								},
								RightShoulder: {
									RightArm: {
										RightForeArm: {
											RightHand: {
												RightHandThumb1: {
													RightHandThumb2: {
														RightHandThumb3: {}
													}
												},
												RightInHandIndex: {
													RightHandIndex1: {
														RightHandIndex2: {
															RightHandIndex3: {}
														}
													}
												},
												RightInHandMiddle: {
													RightHandMiddle1: {
														RightHandMiddle2: {
															RightHandMiddle3: {}
														}
													}
												},
												RightInHandRing: {
													RightHandRing1: {
														RightHandRing2: {
															RightHandRing3: {}
														}
													}
												},
												RightInHandPinky: {
													RightHandPinky1: {
														RightHandPinky2: {
															RightHandPinky3: {}
														}
													}
												}
											}
										}
									}
								},
								LeftShoulder: {
									LeftArm: {
										LeftForeArm: {
											LeftHand: {
												LeftHandThumb1: {
													LeftHandThumb2: {
														LeftHandThumb3: {}
													}
												},
												LeftInHandIndex: {
													LeftHandIndex1: {
														LeftHandIndex2: {
															LeftHandIndex3: {}
														}
													}
												},
												LeftInHandMiddle: {
													LeftHandMiddle1: {
														LeftHandMiddle2: {
															LeftHandMiddle3: {}
														}
													}
												},
												LeftInHandRing: {
													LeftHandRing1: {
														LeftHandRing2: {
															LeftHandRing3: {}
														}
													}
												},
												LeftInHandPinky: {
													LeftHandPinky1: {
														LeftHandPinky2: {
															LeftHandPinky3: {}
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

		this.boneNames = Common.getKeys(bvhStructure, "");

		var datas = JSON.parse(msg.data);
		_.each(datas,function(data, key) {
			var data = data.split( ' ' );
			var bones = [];

			bones.push(this.parseFrameData(data.slice(0, 6), this.boneNames[0]));

			var idx = 1;
			for (var i = idx*6; i < data.length; i+=6) {
				bones.push(this.parseFrameData(data.slice(i, i+6), this.boneNames[idx]));
				idx++;
			}

			this.callbacks["message"]('PN_User_' + key, bones, 'perceptionNeuron');
		}.bind(this));
	}

	onError(evt) {
		console.log('PerceptionNeuron error:', evt);
	}

	on(name, cb) {
		this.callbacks[name] = cb;
	}

	parseFrameData( data, name ) {

		var keyframe = {
			name: name,
			position: { x:0, y:1, z:2 },
			quaternion: new THREE.Quaternion(),
			rotation: new THREE.Vector3(data[4],data[5],data[6])
		};

		var quat = new THREE.Quaternion();

		var vx = new THREE.Vector3( 1, 0, 0 );
		var vy = new THREE.Vector3( 0, 1, 0 );
		var vz = new THREE.Vector3( 0, 0, 1 );

		// parse values for each channel in node
		
		keyframe.position.x = parseFloat( data[0] );
		keyframe.position.y = parseFloat( data[1] );
		keyframe.position.z = parseFloat( data[2] );
		
		quat.setFromAxisAngle( vx, parseFloat( data[4] ) * Math.PI / 180 );
		keyframe.quaternion.multiply( quat );
		
		quat.setFromAxisAngle( vy, parseFloat( data[3] ) * Math.PI / 180 );
		keyframe.quaternion.multiply( quat );
		
		quat.setFromAxisAngle( vz, parseFloat( data[5] ) * Math.PI / 180 );
		keyframe.quaternion.multiply( quat );

		return keyframe;
	}
}

module.exports = PerceptionNeuron;