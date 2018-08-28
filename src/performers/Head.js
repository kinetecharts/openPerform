class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.head = null;
  }

  loadHead() {
    console.log('Loading fbx head....');
    this.loadFBXModel('/models/fbx/SlothCharacter/sloth_head_blendshapes5.fbx', (object) => {
      this.head = object;
      console.log(this.head);
      this.state.scene.scene.add(this.head);
    });
  }

  updateHead(data) {
    console.log(data);
    if (this.head !== null) {
      // console.log(this.head.children[0]);
      _.each(data.blendShapes, (shp, idx) => {
        if (this.head.children[0].morphTargetDictionary[shp[0]] !== undefined) {
          this.head.children[0].morphTargetInfluences[this.head.children[0].morphTargetDictionary[shp[0]]] = parseFloat(shp[1]);
          this.head.children[0].geometry.verticesNeedUpdate = true;
        }
      });
      console.log(this.head.children[0].morphTargetInfluences);
    }
  }

  loadFBXModel(url, callback) {
    const manager = new THREE.LoadingManager();
    manager.onProgress = (item, loaded, total) => {
      // console.log( item, loaded, total );
    };
    const onProgress = (xhr) => {
      if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        // console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
      }
    };
    const onError = (xhr) => {
      console.error(xhr);
    };
    const loader = new THREE.FBXLoader(manager);
    loader.load(url, (object) => {
      callback(object);
    }, onProgress, onError);
  }
}

module.exports = Head;
