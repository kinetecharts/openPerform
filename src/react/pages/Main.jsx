/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 08:00:36
 * @modify date 2018-08-26 08:00:36
 * @desc [This is where the magic happens. The main React class where all things are initialized.]
*/

import React from 'react';
import ConsoleLogHTML from 'console-log-html';

import WEBVR from './../../three/vr/WebVR';

import { Grid, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

// require('three/examples/js/libs/inflate.min.js');
// require('three/examples/js/loaders/FBXLoader.js');

import IOMenu from './../menus/IOMenu';
import PerformerMenu from './../menus/PerformerMenu';
import EnvironmentMenu from './../menus/EnvironmentMenu';
import CameraMenu from './../menus/CameraMenu';
import DebugMenu from './../menus/DebugMenu';
import VRMenu from './../menus/VRMenu';
import ARMenu from './../menus/ARMenu';

import KeyboardHelpModal from './../modals/KeyboardHelpModal';
import BVHChooserModal from '../modals/BVHChooserModal';

import Scene from './../../three/scene';
import InputManager from './../../inputs';
import OutputManager from './../../outputs';

import Performers from './../../performers/Performers';

import BVHPlayer from './../../performers/BVHPlayer';

require('./../../styles/colors.css');
require('./../../styles/fonts.css');
require('./../../styles/main.css');
require('./../../styles/upperDisplay.css');
require('./../../styles/lowerDisplay.css');
require('./../../styles/login.css');

import config from '../../config';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = config;
    this.BVHFiles = config.debug.bvh.files;
    this.BVHPlayers = [];
  }

  componentWillMount() {
    // initialize the threejs scene class
    this.setState({
      scene: new Scene(),
    });
  }

  componentDidMount() {
    // coordinate input data and callbacks.
    // Add / remove inputs in src/config/index.js
    // (Includes keyboard and mouse control)
    this.state.inputManger = new InputManager(this.state.inputs, this.state.scene, this);
    this.state.outputManger = new OutputManager(this.state.scene, this);

    this.performers = new Performers(this.state.inputManger, this.state.outputManger);

    // once the dom has mounted, initialize threejs
    this.state.scene.initScene(
      this.state.inputs,
      this.state.debug.stats,
      this.performers,
      this.state.defaults,
      this.sceneInit.bind(this),
    );
  }

  setColor(id) {
    this.setState({
      colorIdx: id,
    });
    this.updateColors(this.state.colorSet[id]);
  }

  sceneInit(scene) {
    this.performers.init(this.state.scene.sceneGroup);
    this.state.environments = this.state.scene.environments;
    this.state.availEnvironments = this.state.scene.availEnvironments;
    this.state.currentEnvironment = this.state.scene.currentEnvironment;

    if (this.state.debug.bvh.enabled) {
      // _.each(this.BVHFiles, (file) => {
        this.addBVHPerformer(this.BVHFiles, this.state.debug.bvh.autoplay);
      // });
    }

    

    if (this.state.debug.console2html) {
      const con = document.createElement('ul');
      con.style.color = '#FFFFFF';

      const div = document.getElementById('consoleOutput');
      div.appendChild(con);
      document.getElementsByTagName('BODY')[0].appendChild(div);

      ConsoleLogHTML.connect(
        con,
        {},
        true,
        false,
        true,
      ); // Redirect log messages

      // follow end of scroll
      setInterval(() => {
        div.scrollTop = div.scrollHeight;
      }, 1000);
    }

    this.setState({
      isVR: WEBVR.isAvailable()
    });
  }

  clearCycleColors() {
    if (this.colorInterval !== null) {
      clearInterval(this.colorInterval);
    }
  }

  cycleColors(speed) {
    if (this.colorInterval !== null) {
      clearInterval(this.colorInterval);
    }
    this.colorInterval = setInterval(
      this.nextColors.bind(this),
      speed,
    );
    this.nextColors();
  }

  prevColors() {
    this.colorIdx--;
    if (this.colorIdx < 0) { this.colorIdx = this.state.colorSet.length - 1; }
    this.updateColors(this.state.colorSet[this.colorIdx]);
  }

  nextColors() {
    this.colorIdx++;
    if (this.colorIdx >= this.state.colorSet.length) { this.colorIdx = 0; }
    this.updateColors(this.state.colorSet[this.colorIdx]);
  }

  updateColors(colors) {
    if (this.state.scene.environments && this.performers) {
      this.state.scene.environments.updateColors(colors.background);
      this.performers.updateColors(colors.performers);
    }
  }

  switchColorSet(setName) {
    switch (setName) {
      case 'darkColors':
        return this.state.colorSet = this.state.darkColors;
        break;
      case 'colors1':
        return this.state.colorSet = this.state.colors1;
        break;
      case 'colors2':
        return this.state.colorSet = this.state.colors2;
        break;
      default:
        return this.state.colorSet = this.state.dark;
        break;
    }
  }

  addBVHPerformer(modelPaths, autoplay) {
    const bvhPlayer = new BVHPlayer(
      modelPaths,
      this.state.scene.sceneGroup,
      autoplay,
      this.updatePerformers.bind(this),
    );
    this.BVHPlayers.push(bvhPlayer);
    return bvhPlayer;
  }

  rawBvhUpload(result, autoplay) {
    const bvhPlayer = new BVHPlayer(
      result,
      this.state.scene.sceneGroup,
      autoplay,
      this.updatePerformers.bind(this),
    );
    bvhPlayer.loadRaw(result);
    this.BVHPlayers.push(bvhPlayer);
    this.closeBVHChooser();
  }

  urlBvhUpload(url) {
    this.addBVHPerformer(url, true);
    this.closeBVHChooser();
  }

  openBVHChooser() {
    this.setState({
      bvhChooserModal: true,
    });
  }

  closeBVHChooser() {
    this.setState({
      bvhChooserModal: false,
    });
  }

  toggleGUI() { // toggle loading overlay visablity
    if ($('#page').css('display') === 'none') {
      $('#page').fadeIn(1000);
    } else {
      $('#page').fadeOut(1000);
    }
    return this;
  }

  toggleStartOverlay() { // toggle start overlay visablity
    if ($('#startOverlay').css('display') === 'none') {
      if (!$('#startOverlay:animated').length) {
        $('#startOverlay').fadeIn(1000);
      }
    } else if (!$('#startOverlay:animated').length) {
      $('#startOverlay').fadeOut(1000);
    }
    return this;
  }

  toggleBlackOverlay() { // toggle black overlay visablity
    if ($('#blackOverlay').css('display') === 'none') {
      if (!$('#blackOverlay:animated').length) {
        $('#blackOverlay').fadeIn(1000);
      }
    } else if (!$('#blackOverlay:animated').length) {
      $('#blackOverlay').fadeOut(1000);
    }
    return this;
  }

  toggleEndOverlay() { // toggle end overlay visablity
    if ($('#endOverlay').css('display') === 'none') {
      if (!$('#endOverlay:animated').length) {
        $('#endOverlay').fadeIn(1000);
      }
    } else if (!$('#endOverlay:animated').length) {
      $('#endOverlay').fadeOut(1000);
    }
    return this;
  }

  toggleFullscreen() { // toggle fullscreen window
    if (
      !document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) { // current working methods
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  enterFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    return this;
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    return this;
  }

  openKeyboardModal() {
    if (this.state.keyboardModal === false) {
      this.setState({
        keyboardModal: true,
      });
    }
  }

  closeKeyboardModal() {
    if (this.state.keyboardModal === true) {
      this.setState({
        keyboardModal: false,
      });
    }
  }

  updatePerformers(id, data, type, leader, actions) {
    if (this.performers) {
      if (!this.performers.exists(id)) {
        this.performers.add(id, type, leader, actions, _.cloneDeep(config.defaults.performer));
        this.setState({
          performers: this.performers,
          performerNames: _.map(this.performers.getPerformers(), 'name'),
        });
        this.closeBVHChooser();
      } else {
        this.performers.update(id, data);
      }
    }
  }

  togglePerformerTrack(performer) {
    if (
      !this.state.scene.cameraControl.trackingTarget ||
      this.state.trackedPerformer.inputId !== performer.inputId
    ) {
      this.trackPerformer(performer, 20);
    } else {
      this.clearTrackedPeformer();
    }
  }

  trackPerformer(performer, distance) {
    const target = performer.performer.meshes.robot_spine1;

    const pos = target.position;
    pos.y = 1;

    this.state.scene.cameraControl.track(// track(target, look, offset) {
      target,
      pos,
      new THREE.Vector3(0, 0, distance),
    );
    this.state.performers.clearTracking();
    performer.setTracking(true);
    this.setState({
      trackedPerformer: performer,
    });
  }

  clearTrackedPeformer() {
    this.state.performers.clearTracking();
    this.state.scene.cameraControl.clearTrack();
    this.setState({
      trackedPerformer: null,
    });
  }

  selectTrackedPerformer(key) {
    if (key == 1) {
      this.clearTrackedPeformer();
    } else {
      this.trackPerformer(this.state.performers.getPerformers()[key - 2], 20);
    }
  }

  changeInputPreset(val) {
    this.setState({
      currentInputPreset: this.state.inputPresets[val],
    });
    this.state.inputManger.connectCallbacks(this.state.inputPresets[val]);
  }

  changeOutputPreset(val) {
    this.setState({
      currentOutputPreset: this.state.outputPresets[val],
    });
    this.state.outputManger.connectCallbacks(this.state.outputPresets[val]);
  }

  updateMidiOutputs(deviceNames, currentDeviceName) {
    this.setState({
      midiDevices: deviceNames,
      currentMidiDevice: currentDeviceName,
    });
  }

  changeMidiDevice(key) {
    let device = null;
    if (key !== 0) {
      device = this.state.midiDevices[key - 1];
    }
    this.setState({
      currentMidiDevice: device,
    });
    this.state.outputManger.outputs.midicontroller.changeDevice(this.state.midiDevices[key - 1]);
  }

  changeMidiChannel(key) {
    this.setState({
      currentMidiChannel: key,
    });
    this.state.outputManger.outputs.midicontroller.changeChannel(key);
  }

  sendMidiTest() {
    this.state.outputManger.outputs.midicontroller.sendTest();
  }

  render() {
    return (
      <Grid className="container-no-padding" fluid>
        <Row className="row-no-margin">
          <Grid className="container-no-padding" fluid>
            <Row className="row-no-margin">
              <Col id="scenes" xs={12} md={12} />
            </Row>
          </Grid>
          <Grid fluid><Row><Col id="consoleOutput" xs={12} md={12} /></Row></Grid>
          <Grid fluid id="page">
            <Row className="row-third-height" id="upperDisplay">
              <Col xs={2} md={2}>
                <DebugMenu fileUpload={this.urlBvhUpload.bind(this)} arGui={(this.state.scene.scene) ? this.state.scene.getARGUI() : null} />
              </Col>
              <Col xs={2} md={2}>
                <ARMenu active={this.state.isAR} />
              </Col>
              <Col xs={4} md={4}>
                <CameraMenu
                  selectTrackedPerformer={this.selectTrackedPerformer.bind(this)}
                  trackPerformer={this.trackPerformer.bind(this)}
                  performers={this.state.performerNames}
                  trackedPerformer={this.state.trackedPerformer}
                  
                  flyTop={(this.state.inputManger) ? this.state.inputManger.flyTop.bind(this.state.inputManger) : null}
                  
                  firstPerson={(this.state.inputManger) ? this.state.inputManger.firstPerson.bind(this.state.inputManger) : null}
                  snorryCam={(this.state.inputManger) ? this.state.inputManger.snorryCam.bind(this.state.inputManger) : null}
                  
                  cutClose={(this.state.inputManger) ? this.state.inputManger.cutClose.bind(this.state.inputManger) : null}
                  cutThreeQ={(this.state.inputManger) ? this.state.inputManger.cutThreeQ.bind(this.state.inputManger) : null}
                  cutMedium={(this.state.inputManger) ? this.state.inputManger.cutMedium.bind(this.state.inputManger) : null}
                />
              </Col>
              <Col xs={4} md={4}>
                <IOMenu
                  // inputs
                  openKeyboardModal={this.openKeyboardModal.bind(this)}
                  changeInputPreset={this.changeInputPreset.bind(this)}
                  currentInputPreset={(this.state.currentInputPreset === null) ?
                    this.state.defaults.inputPreset :
                    this.state.currentInputPreset}
                  inputPresets={this.state.inputPresets}
                  inputs={this.state.inputs}

                  // outputs
                  changeOutputPreset={this.changeOutputPreset.bind(this)}
                  currentOutputPreset={(this.state.currentOutputPreset === null) ?
                    this.state.defaults.outputPreset :
                    this.state.currentOutputPreset}
                  outputPresets={this.state.outputPresets}
                  changeMidiDevice={this.changeMidiDevice.bind(this)}
                  currentMidiDevice={this.state.currentMidiDevice}
                  midiDevices={this.state.midiDevices}
                  currentMidiChannel={this.state.currentMidiChannel}
                  changeMidiChannel={this.changeMidiChannel.bind(this)}
                  sendMidiTest={this.sendMidiTest.bind(this)}
                  />
              </Col>
            </Row>
            <Row className="row-third-height" />
            <Row className="row-third-height" id="lowerDisplay">
              <Col className="bottom-column" xs={4} md={4}>
                <PerformerMenu
                  openBVHChooser={this.openBVHChooser.bind(this)}
                  togglePerformerTrack={this.togglePerformerTrack.bind(this)}
                  performers={this.state.performers}
                />
              </Col>
              <Col className="bottom-column" xs={4} md={4}>
                <VRMenu active={this.state.isVR}/>
              </Col>
              <Col className="bottom-column" xs={4} md={4}>
                <EnvironmentMenu
                  availEnvironments={this.state.environments.availEnvironments}
                  environment={this.state.environments.currentEnvironment}
                  environments={this.state.environments}
                  updateEnvironment={this.state.environments.updateEnvironment}
                />
              </Col>
            </Row>
          </Grid>
          <Grid fluid><Row><Col id="startOverlay" xs={12} md={12} /></Row></Grid>
          <Grid fluid><Row><Col id="blackOverlay" xs={12} md={12} /></Row></Grid>
          <Grid fluid><Row><Col id="endOverlay" xs={12} md={12} /></Row></Grid>
          <KeyboardHelpModal
            show={this.state.keyboardModal}
            closeKeyboardModal={this.closeKeyboardModal.bind(this)}
            keyboardList={(this.state.inputManger) ? this.state.inputManger.inputs.keyboard : {}}
          />
          <BVHChooserModal
            performers={this.state.performers}
            bvhFiles={this.state.bvhFiles}
            show={this.state.bvhChooserModal}
            closeBVHChooser={this.closeBVHChooser.bind(this)}
            rawBvhUpload={this.rawBvhUpload.bind(this)}
            urlBvhUpload={this.urlBvhUpload.bind(this)}
          />
        </Row>
      </Grid>
    );
  }
}

module.exports = Main;
