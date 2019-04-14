
const mqtt = require('mqtt')
const WebSocket = require('ws');

const config = require('./../config.js').mqtt;

class MQTTServer {
  constructor() {
    this.mqttServer  = mqtt.connect('mqtt://192.168.148.235');
    this.mqttServer.on('connect', () => {
      this.mqttServer.subscribe('audience_gaze', (err) => {
        if (!err) {
          this.mqttServer.on('message', this.onBroadcastMessage.bind(this))
        }
      })
    })
    
    // this.mqttServer.publish('audience_gaze', 'Hello mqtt')
    this.wss = new WebSocket.Server({ port: config.ports.outgoing });
    this.wss.on('connection', this.onBroadcastConnection.bind(this));
    this.wss.on('error', this.onBroadcastError.bind(this));
    this.wss.on('listening', this.onBroadcastListening.bind(this));
  }

  onBroadcastConnection(ws) {
    console.log('MQTT  Connected!');
    
  }

  onBroadcastError(err) {
    // console.log('OSC Controller Error! ', err);
  }

  onBroadcastListening() {
    console.log('MQTT Listening!');
  }

  onBroadcastMessage(topic, message) {
    this.broadcast(message.toString());
  }

  broadcast(data, rinfo) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify(data), this.onBroadcastError);
        } catch (err) {
          // this.onBroadcastError(err);
        } finally {
          // console.log('Something broke. :(', client);
        }
      }
    });
  }
}

module.exports = MQTTServer;
