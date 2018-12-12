This document shows how to hook the Percpetion Neuron motion capture suit to OpenPerform.

# Setup Motion Streaming Software
These two pieces of software enable the suit software to talk to OpenPerform.

1. Download and install the Axis Neuron software
* > https://neuronmocap.com/downloads
2. Download, build, the PN Translator App (Windows Only)
* > https://github.com/kinetecharts/PNTransformer


# Configure Open Perform
OpenPeform needs to know where the suit data is coming from. So, find the target IP address and add it to the server config.

1. Enable Perception Neuron data streaming
* > /server/config.js, line 53

  > enabled: true
2. Add target IP address to the server config
* > /server/config.js, line 54

  > If PNTransformer is running on same computer, use 127.0.0.1

3. Restart OpenPerform Server


# First Run (Pre-recorded File)

1. Open Axis Neuron app.

2. Load a recorded capture session, hit play, and set it to loop.

3. Open PNTransformer app.

* Click "Broadcast" (You should see the numbers start changing rapidly)

# Live Motion Streaming

Once the the Axis Neuron and PNTranformer apps are connected to the OpenPerform server, swapping sources is easy.

1. Power up suit

2. Connect suit to the same network as the computer running Axis Neuron and PNTranformer apps.

3. In Axis Neuron app, click Connect.

4. Select suit from list of available devices

5. That's it! If the OpenPerform server is still connected, it will display the live avatar as soon as it's connected.