import React from 'react';
import $ from 'jquery';
import TWEEN from 'tween';

const _ = require('lodash').mixin(require('lodash-keyarrange'));

import InputList from './../components/InputList';
import PerformerList from './../components/PerformerList';
import EnvironmentList from './../components/EnvironmentList';
import KeyboardHelpModal from './../components/KeyboardHelpModal';
import PerformerEffectsModal from './../components/PerformerEffectsModal';
import GroupEffectsModal from './../components/GroupEffectsModal';
import EnvironmentSettingsModal from './../components/EnvironmentSettingsModal';

import Common from './../../util/Common';

import Scene from './../../three/scene';
import InputManager from './../../inputs';

import Performers from './../../performers/Performers';

import BVHPlayer from './../../performers/BVHPlayer';

import 'bootstrap/dist/css/bootstrap.css';
import colors from './colors.css';
import fonts from './fonts.css';
import main from './main.css';
import upperDisplay from './upperDisplay.css';
import lowerDisplay from './lowerDisplay.css';
import login from './login.css';

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
    // coordinate input data and callbacks. Add / remove inputs in src/config/index.js (Includes keyboard and mouse control)
    this.setState({
      inputManger: new InputManager(this.state.inputs, this.state.scene, this),
    });

    this.performers = new Performers();

    // once the dom has mounted, initialize threejs
    this.state.scene.initScene(this.state.home.target, this.state.inputs, this.state.stats, this.performers, this.state.backgroundColor);

    this.performers.init(this.state.scene.scene);
    this.setState({
      environments: this.state.scene.environments,
    });

    if (this.state.debug) {
      this.BVHPlayer = this.addBVHPerformer(this.BVHFiles[0]);
    }

    if (this.state.console2html) {
      const ConsoleLogHTML = require('console-log-html');

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
    const bvhPlayer = new BVHPlayer(modelPath, this.state.scene.scene, this.updatePerformers.bind(this));
    this.BVHPlayers.push(bvhPlayer);
    return bvhPlayer;
  }

  toggleGUI() { // toggle loading overlay visablity
    if ($('#lowerDisplay').css('display') == 'none') {
      $('#lowerDisplay').fadeIn(1000);
    } else {
      $('#lowerDisplay').fadeOut(1000);
    }
    if ($('#upperDisplay').css('display') == 'none') {
      $('#upperDisplay').fadeIn(1000);
    } else {
      $('#upperDisplay').fadeOut(1000);
    }
  }

  toggleStartOverlay() { // toggle start overlay visablity
    if ($('#startOverlay').css('display') == 'none') {
      if (!$('#startOverlay:animated').length) {
        $('#startOverlay').fadeIn(1000);
      }
    } else if (!$('#startOverlay:animated').length) {
      $('#startOverlay').fadeOut(1000);
    }
  }

  toggleBlackOverlay() { // toggle black overlay visablity
    if ($('#blackOverlay').css('display') == 'none') {
      if (!$('#blackOverlay:animated').length) {
        $('#blackOverlay').fadeIn(1000);
      }
    } else if (!$('#blackOverlay:animated').length) {
      $('#blackOverlay').fadeOut(1000);
    }
  }

  toggleEndOverlay() { // toggle end overlay visablity
    if ($('#endOverlay').css('display') == 'none') {
      if (!$('#endOverlay:animated').length) {
        $('#endOverlay').fadeIn(1000);
      }
    } else if (!$('#endOverlay:animated').length) {
      $('#endOverlay').fadeOut(1000);
    }
  }

  toggleFullscreen() { // toggle fullscreen window
    if (!document.fullscreenElement && // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
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
    if (this.state.keyboardModal == false) {
      this.setState({
        keyboardModal: true,
      });
    }
  }

  closeKeyboardModal() {
    if (this.state.keyboardModal == true) {
      this.setState({
        keyboardModal: false,
      });
    }
  }

  openPerformerModal(content) {
    if (this.state.performerModal == false) {
      this.setState({
        performerModal: true,
        performerContent : content
      });
    }
  }

  closePerformerModal() {
    if (this.state.performerModal == true) {
      this.setState({
        performerModal: false,
        performerContent : document.createElement("div")
      });
    }
  }

  openGroupModal() {
    if (this.state.groupModal == false) {
      this.setState({
        groupModal: true,
      });
    }
  }

  closeGroupModal() {
    if (this.state.groupModal == true) {
      this.setState({
        groupModal: false,
      });
    }
  }

  openEnvironmentModal(content) {
    if (this.state.environmentModal == false) {
      this.setState({
        environmentModal: true,
        environmentContent : content
      });
    }
  }

  closeEnvironmentModal() {
    if (this.state.environmentModal == true) {
      this.setState({
        environmentModal: false,
        environmentContent : document.createElement("div")
      });
    }
  }

  trackPerformer(performer) {
    var distance = 19.999990045581438;
    if (!this.state.scene.cameraControl.trackingObj || this.lastTracked.inputId !== performer.inputId) {
      var target = performer.performer.meshes.robot_spine1;
      
      var pos = target.position;
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

  render() {
    return (
      <div className="container-fluid" id="page">
        <div id="consoleOutput" />
        <div id="scenes" />
        <div id="upperDisplay">
          <table><tbody><tr>
            <td valign="top"><div id="cameraBox"><h5>Camera Controls</h5>
            <table><tbody><tr><td></td></tr></tbody></table>
            </div></td>
            <td valign="top"><div id="statsBox"><h5>Stats</h5></div></td>
          </tr></tbody></table>
        </div>
        <div id="lowerDisplay">
          <table><tbody><tr>
            {/*<td><InputList inputs={this.state.inputs}></InputList></td>*/}
            <td valign="bottom" width="40%"><PerformerList trackPerformer={this.trackPerformer.bind(this)} performers={this.state.performers} openPerformerModal={this.openPerformerModal.bind(this)} /></td>
            <td valign="bottom" width="20%" id="vrTD" align="center"></td>
            <td valign="bottom" width="40%"><EnvironmentList environments={this.state.environments} openEnvironmentModal={this.openEnvironmentModal.bind(this)} /></td>
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
