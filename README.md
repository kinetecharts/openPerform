#First Run Setup  
1. In Ternimal, run "npm install"  
2. Copy ./server/config_example.js to ./server/config.js  
3. In Ternimal, run "gulp build"
4. In Ternimal, run "gulp"
  1. Browser will automatically open to webserver when running.

#Normal Use  
1. In Ternimal, run "gulp"
  1. Browser will automatically open to webserver when running.

#Input with the Perpection Neuron  
1. Install and run Axis Neuron app on Windows: https://www.neuronmocap.com/downloads  
2. On Windows, run Fabien's stream convertion app  
3. Update ./src/config/index.js
  1. Add "perceptionNeuron" to inputs list in
3. Update ./server/config.js
  1. Set Perception Neuron enabled setting to true  
  2. Add IP address of Windows Computer / streaming app  
4. In Ternimal, quit and restart gulp process  
5. Callback functions available in the ./src/inputs/index.js  

#Input with the Myo  
1. Open Myo Connect app (https://www.myo.com/start/)  
2. Add "myo" to inputs list in ./src/config/index.js  
3. Callback functions available in the ./src/inputs/index.js  
  
#Input with the Kinect  
1. Install and run Kinect Transport app on Windows: https://github.com/stimulant/MS-Cube-SDK/tree/research/KinectTransport  
2. Run, point IP address at the computer running this code.  
3. Enable kinect server in ./server/config.js  
4. Add "kinecttransport" to inputs list in ./src/config/index.js  
5. Callback functions available in the ./src/inputs/index.js  

#Use MongoDB  
1. Create ./data/db directories in main project directory  
2. In ./server/config.js, update mongodb.dbName  

#Use Mapzen API (Requires MongoDB)  
1. Obtain Mapzen crendentials: https://mapzen.com/developers  
2. Update ./server/config.js
  1. Update mapzen.api_key  