import _ from 'lodash';

class Gamepads {
  constructor(url) {
    this.callbacks = {};
    this.connected = false;
    this.websocket = null;

    this.showDebugger = true;
    this.debugEls = {};

    this.buttonKeys = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT'];
    this.axesKeys = ['Left X', 'Left Y', 'Right X', 'Right Y', 'DPad X', 'DPad Y'];

    this.initializeWebSocket(url);
    this.update();
  }

  initializeWebSocket(url) {
    console.log('Gamepad Server connecting to: ', url);

    this.websocket = new WebSocket(url);
    this.websocket.onopen = this.onOpen.bind(this);
    this.websocket.onclose = this.onClose.bind(this);
    this.websocket.onmessage = this.onMessage.bind(this);
    this.websocket.onerror = this.onError.bind(this);
  }


  onOpen(evt) {
    console.log('Gamepad Server connected:', evt);
    this.connected = true;
  }

  onClose(evt) {
    console.log('Gamepad Server disconnected:', evt);
    this.connected = false;
  }

  onMessage(msg) {
    const inputs = JSON.parse(msg.data);
    _.each(inputs, (i, key) => {
      this.callbacks.message(i, key);

      if (this.showDebugger) {
        if (!this.debugEls[key]) {
          this.debugEls[key] = document.createElement('div');
          this.debugEls[key].className = 'controllerDebug';
          document.getElementById('lowerDisplay').appendChild(this.debugEls[key]);
        }
        this.updateDebugger(this.debugEls[key], i, key);
      }
    });
  }

  onError(evt) {
    console.log('Gamepad Server error:', evt);
  }

  on(name, cb) {
    this.callbacks[name] = cb;
  }

  send(msg, gamepadId) {
    if (this.connected) {
      try {
        const obj = {};
        obj[gamepadId] = msg;
        this.websocket.send(JSON.stringify(obj), this.onError);
      } catch (err) {
        this.onError(err);
      } finally {}
    }
  }

  buttonPressed(b) {
    if (typeof (b) === 'object') {
      return b.pressed;
    }
    return b == 1.0;
  }

  update() {
    _.each(navigator.getGamepads(), (g) => {
      if (g !== null) {
        const inputs = _.concat(
          _.compact(_.map(g.buttons, (b, idx) => {
            if (this.buttonPressed(b.pressed)) {
              return {
                id: this.buttonKeys[idx],
                pressed: b.pressed,
                value: b.value,
              };
            }
          })),
          _.compact(_.map(g.axes, (a, idx) => {
            if (a !== 0) {
              return {
                id: this.axesKeys[idx],
                pressed: (a > 0),
                value: a,
              };
            }
          })),
        );

        if (inputs.length > 0) {
          this.send(inputs, g.index + 1);
        }
      }
    });

    requestAnimationFrame(this.update.bind(this));
  }

  updateDebugger(container, inputs, id) {
    container.innerHTML = '';
    const title = document.createElement('h5');
    title.innerHTML = `Gamepad #${id}`;
    container.appendChild(title);

    const list = document.createElement('ul');
    _.each(inputs, (input, idx) => {
      const i = document.createElement('li');
      i.innerHTML = `${input.id}: ${input.value} (${input.pressed})`;
      list.appendChild(i);
    });

    container.appendChild(list);
  }
}

module.exports = Gamepads;
