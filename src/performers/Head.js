import FileLoader from '../loaders';

class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.head = null;

    this.loader = new FileLoader();
  }

  loadHead() {
    console.log('Loading fbx head....');
    this.loader.loadFBX('/models/fbx/SlothCharacter/sloth_head_blendshapes5.fbx', {}, (object) => {
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
}

module.exports = Head;
