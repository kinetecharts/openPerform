
Requires nodejs and mongodb.  
  
First Run Setup  
1. Run "npm install"  
2. If DB needed, create ./data/db directories in main project directory  
3. Copy ./server/config_example.js to ./server/config.js  
  a. If DB needed, update mongodb.dbName  
5. Run "gulp"  
  
Use Mapzen API  
1. Obtain Mapzen crendentials: https://mapzen.com/developers  
2. Update ./server/config.js  
  a. Update mapzen.api_key  
  
Input with the Myo  
1. Open Myo Connect app (https://www.myo.com/start/)  
2. Add "myo" to inputs list in ./src/config/defaults.js  
3. Callback functions available in the ./src/react/inputs/InputManager  
  
Input with the Kinect  
1. Install Kinect Transport at on Windows: https://github.com/stimulant/MS-Cube-SDK/tree/research/KinectTransport  
2. Run, point IP address at the computer running this code.  
3. Enable kinect server in ./server/config.js  
4. Add "kinecttransport" to inputs list in ./src/config/defaults.js  
4. Callback functions available in the ./src/react/inputs/InputManager  