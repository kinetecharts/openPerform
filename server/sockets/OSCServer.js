const osc = require('osc');
const WebSocket = require('ws');

const config = require('./../config.js').OSC;

class OSCServer {
  constructor() {
    this.udp = new osc.UDPPort({
      localAddress: config.localAddress,
      localPort: config.localPort,
      remoteAddress: config.remoteAddress,
      remotePort: config.remotePort,
    });

    this.udp.on('ready', this.udpReady.bind(this));
    this.udp.open();

    this.wss = new WebSocket.Server({
      port: config.ports.outgoing,
    });

    this.wss.on("connection", this.wssConnection);
  }

  getIPAddresses() {
    this.interfaces = require("os").networkInterfaces();
    let ipAddresses = [];

    for (let deviceName in this.interfaces){
        let addresses = this.interfaces[deviceName];

        for (let i = 0; i < addresses.length; i++) {
            let addressInfo = addresses[i];

            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
  }

  udpReady() {
    this.ipAddresses = this.getIPAddresses();

    console.log('Listening for OSC over UDP.');

    this.ipAddresses.forEach((address) => {
      console.log(' Host:', address + ', Port:', this.udp.options.localPort);
    });

    console.log('Broadcasting OSC over UDP to', this.udp.options.remoteAddress + ', Port:', this.udp.options.remotePort);
  }

  wssConnection(sock) {
    console.log('A Web Socket connection has been established!');

    this.socketPort = new osc.WebSocketPort({
      socket: sock,
    });

    this.relay = new osc.Relay(this.udp, this.socketPort, {
      raw: true,
    });
  }
}

module.exports = OSCServer;
