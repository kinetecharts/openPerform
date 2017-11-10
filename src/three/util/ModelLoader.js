import AppendScripts from '../util/AppendScripts'

class ModelLoader {
	constructor() {
		this.appendScripts = new AppendScripts();
		this.baseUrl = 'libs/three/loaders/';
	}
	loadModelArray(modelUrls, callback) {
		var scope = this;

		var manager = new THREE.LoadingManager();
		manager.onProgress = this.managerProgress;

		_.forEach(modelUrls, function(modelUrl) {
			scope.loadSingleModel(modelUrl, callback);
		});
	}
	loadSingleModel(modelUrl, callback) {
		var ext = modelUrl.substr((~-modelUrl.lastIndexOf('.') >>> 0) + 2);
		switch (ext.toLowerCase()) {

		case 'fbx':
			this.appendScripts.appendOne(this.baseUrl + 'FBXLoader.js');
			this.loadFBX(modelUrl, callback);
			break;

		case 'obj':
			this.appendScripts.appendOne(this.baseUrl + 'OBJLoader.js');
			this.loadOBJ(modelUrl, callback);
			break;

		}
	}
	managerProgress( item, loaded, total ) {
		console.log( item, loaded, total );
	}
	onProgress( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
		}
	}
	onError( xhr ) {}
	loadOBJ(modelUrl, callback) {
		var loader = new THREE.OBJLoader( this.loadingManager );
		loader.load( modelUrl, function( object ) {
			callback(object);
		}, this.onProgress, this.onError );
	}
	loadFBX(modelUrl, callback) {
		var loader = new THREE.FBXLoader( this.loadingManager );
		loader.load( modelUrl, function( object ) {
			callback(object);
		}, this.onProgress, this.onError );
	}
}

export default ModelLoader;