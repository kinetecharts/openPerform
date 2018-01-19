import React from 'react';
import ConsoleLogHTML from 'console-log-html';

import 'bootstrap/dist/css/bootstrap.css';

import InputMenu from './../menus/InputMenu';
import PerformerMenu from './../menus/PerformerMenu';
import EnvironmentMenu from './../menus/EnvironmentMenu';
import CameraMenu from './../menus/CameraMenu';
import StatsMenu from './../menus/StatsMenu';
import VRMenu from './../menus/VRMenu';

import KeyboardHelpModal from './../modals/KeyboardHelpModal';
import PerformerEffectsModal from './../modals/PerformerEffectsModal';
import GroupEffectsModal from './../modals/GroupEffectsModal';
import EnvironmentSettingsModal from './../modals/EnvironmentSettingsModal';

import Scene from './../../three/scene';
import InputManager from './../../inputs';

import Performers from './../../performers/Performers';

import BVHPlayer from './../../performers/BVHPlayer';

import colors from './../../styles/colors.css';
import fonts from './../../styles/fonts.css';
import main from './../../styles/main.css';
import upperDisplay from './../../styles/upperDisplay.css';
import lowerDisplay from './../../styles/lowerDisplay.css';
import login from './../../styles/login.css';

import config from '../../config';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = config;
    this.BVHFiles = [
      config.debugBVH,
    ];
    this.BVHPlayers = [];
    this.lastTracked = null;
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

    this.performers = new Performers();

    // once the dom has mounted, initialize threejs
    this.state.scene.initScene(
      this.state.inputs,
      this.state.stats,
      this.performers,
      this.state.backgroundColor,
    );

    this.performers.init(this.state.scene.scene);
    this.state.environments = this.state.scene.environments;

    if (this.state.debug) {
      this.BVHPlayer = this.addBVHPerformer(this.BVHFiles[0]);
    }

    if (this.state.console2html) {
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

      // once a second
      setInterval(() => {
        div.scrollTop = div.scrollHeight;
      }, 1000);
    }
  }

  addBVHPerformer(modelPath) {
    const bvhPlayer = new BVHPlayer(
      modelPath,
      this.state.scene.scene,
      this.updatePerformers.bind(this),
    );
    this.BVHPlayers.push(bvhPlayer);
    return bvhPlayer;
  }

  toggleGUI() { // toggle loading overlay visablity
    if ($('#lowerDisplay').css('display') === 'none') {
      $('#lowerDisplay').fadeIn(1000);
    } else {
      $('#lowerDisplay').fadeOut(1000);
    }
    if ($('#upperDisplay').css('display') === 'none') {
      $('#upperDisplay').fadeIn(1000);
    } else {
      $('#upperDisplay').fadeOut(1000);
    }
  }

  toggleStartOverlay() { // toggle start overlay visablity
    if ($('#startOverlay').css('display') === 'none') {
      if (!$('#startOverlay:animated').length) {
        $('#startOverlay').fadeIn(1000);
      }
    } else if (!$('#startOverlay:animated').length) {
      $('#startOverlay').fadeOut(1000);
    }
  }

  toggleBlackOverlay() { // toggle black overlay visablity
    if ($('#blackOverlay').css('display') === 'none') {
      if (!$('#blackOverlay:animated').length) {
        $('#blackOverlay').fadeIn(1000);
      }
    } else if (!$('#blackOverlay:animated').length) {
      $('#blackOverlay').fadeOut(1000);
    }
  }

  toggleEndOverlay() { // toggle end overlay visablity
    if ($('#endOverlay').css('display') === 'none') {
      if (!$('#endOverlay:animated').length) {
        $('#endOverlay').fadeIn(1000);
      }
    } else if (!$('#endOverlay:animated').length) {
      $('#endOverlay').fadeOut(1000);
    }
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
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  updatePerformers(id, data, type, actions) {
    if (this.performers) {
      if (!this.performers.exists(id)) {
        this.performers.add(id, type, actions);
      } else {
        this.performers.update(id, data);
      }

      this.setState({
        performers: this.performers,
      });
    }
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

  openPerformerModal(content) {
    if (this.state.performerModal === false) {
      this.setState({
        performerModal: true,
        performerContent: content,
      });
    }
  }

  closePerformerModal() {
    if (this.state.performerModal === true) {
      this.setState({
        performerModal: false,
        performerContent: document.createElement('div'),
      });
    }
  }

  openGroupModal() {
    if (this.state.groupModal === false) {
      this.setState({
        groupModal: true,
      });
    }
  }

  closeGroupModal() {
    if (this.state.groupModal === true) {
      this.setState({
        groupModal: false,
      });
    }
  }

  openEnvironmentModal(content) {
    if (this.state.environmentModal === false) {
      this.setState({
        environmentModal: true,
        environmentContent: content,
      });
    }
  }

  closeEnvironmentModal() {
    if (this.state.environmentModal === true) {
      this.setState({
        environmentModal: false,
        environmentContent: document.createElement('div'),
      });
    }
  }

  trackPerformer(performer) {
    const distance = 19.999990045581438;
    if (
      !this.state.scene.cameraControl.trackingObj ||
      this.lastTracked.inputId !== performer.inputId
    ) {
      const target = performer.performer.meshes.robot_spine1;

      const pos = target.position;
      pos.y = 1;

      this.state.scene.cameraControl.track(//track(target, look, offset) {
        target,
        pos,
        new THREE.Vector3(0, 0, distance),
      );
      this.state.performers.clearTracking();
      performer.setTracking(true);
      this.lastTracked = performer;
    } else {
      this.state.performers.clearTracking();
      this.state.scene.cameraControl.clearTrack();
    }
  }
  changePreset(val) {
    this.setState({
      currentPreset:this.state.presets[val],
    });
    this.state.inputManger.connectCallbacks(this.state.presets[val]);
  }

  render() {
    return (
      <div className="container-fluid" id="page">
        <div id="consoleOutput" />
        <div id="scenes" />
        <div id="upperDisplay">
          <table><tbody><tr>
            <td valign="top" width="33.33"><StatsMenu/></td>
            <td valign="top" width="33.33%" align="center"><CameraMenu/></td>
            <td valign="top" width="33.33%"><InputMenu openKeyboardModal={this.openKeyboardModal.bind(this)} changePreset={this.changePreset.bind(this)} currentPreset={this.state.currentPreset} presets={this.state.presets} inputs={this.state.inputs}></InputMenu></td>
          </tr></tbody></table>
        </div>
        <div id="lowerDisplay">
          <table><tbody><tr>
            <td valign="bottom" width="40%"><PerformerMenu trackPerformer={this.trackPerformer.bind(this)} performers={this.state.performers} openPerformerModal={this.openPerformerModal.bind(this)} /></td>
            <td valign="bottom" width="20%" align="center"><VRMenu/></td>
            <td valign="bottom" width="40%"><EnvironmentMenu environments={this.state.environments} openEnvironmentModal={this.openEnvironmentModal.bind(this)} /></td>
          </tr></tbody></table>
        </div>
        <div id="startOverlay" />
        <div id="blackOverlay" />
        <div id="endOverlay" />
        <KeyboardHelpModal show={this.state.keyboardModal} closeKeyboardModal={this.closeKeyboardModal.bind(this)} keyboardList={(this.state.inputManger) ? this.state.inputManger.inputs.keyboard : {}} />
        <PerformerEffectsModal content={this.state.performerContent} show={this.state.performerModal} closePerformerModal={this.closePerformerModal.bind(this)} keyboardList={(this.state.inputManger) ? this.state.inputManger.inputs.keyboard : {}} />
        <GroupEffectsModal show={this.state.groupModal} closeGroupModal={this.closeGroupModal.bind(this)} keyboardList={(this.state.inputManger) ? this.state.inputManger.inputs.keyboard : {}} />
        <EnvironmentSettingsModal content={this.state.environmentContent} show={this.state.environmentModal} closeEnvironmentModal={this.closeEnvironmentModal.bind(this)}/>
      </div>
    );
  }
}

module.exports = Main;
