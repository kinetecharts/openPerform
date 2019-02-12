Setup Instructions for OpenPerform - Kinect Skeleton Dance
------------

Hardware
1. Plug everything in
2. Plug in HDMI before turning the machine on!
    1. Use lower HDMI port on the graphics cards
3. Kinect goes on tripod.
    1. Tripod should be 2 feet off the floor (bottom edge of Kinect)
    2. Tripod should be directly below screen
4. Near distance ~40 inches (From front edge of Kinect)
5. Far distance ~12 feet (From front edge of Kinect)
6. Make sure the Kinect is level

Software
1. Make sure windows is connected to the internet
2. Open Sourcetree
    1. Pull latest code from KinectSkeleton
3. Open Kinectron
    1. Check for IP
    2. Click All Bodies
    3. Check that you see yourself as red dots (scroll to bottom)
        1. Not working?
        2. Try a different (blue) usb 3 port
4. Open Ubuntu
    1. Navigate to directory (press up arrow to go through previous commands)
        1. I believe it’s ‘/mnt/c/users/travi/documents/repositories/openperform’
    2. Run:
        > yarn
    3. Then run:
        > npm run build
    4. Then run:
        > npm run start
5. Open Chrome
    1. Navigate to:
        > localhost:8080
    2. Press the +/= key to enter fullscreen
6. Not working?
    1. Does Kinectron show an IP address?
        No? Connect to interent!
    2. Can you see yourself in Kinectron?
    3. Are there any errors in the terminal?
    4. Are there any errors in the console?
    5. Did you try a different usb port?

Update
1. In Ubuntu
    Stop webserver:
    >Control + C
1. In Sourcetree
    1. Pull latest code from KinectSkeleton
3. Then run:
    >npm run build
4. Then run:
    >npm run start