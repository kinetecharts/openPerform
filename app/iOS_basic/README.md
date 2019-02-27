# OpenPerform for iOS

This project is based the [`Node.js on Mobile`]( https://github.com/janeasystems/nodejs-mobile) shared library.

## Prerequisites
To run the sample on iOS you need:
 - A macOS device with the latest Xcode (Xcode version 9 or greater) with the iOS SDK version 11.0 or higher.
 - One iOS device with arm64 architecture, running iOS version 11.0 or higher.
 - A valid Apple Developer Account.

## How to run
 - Run `npm run build-ios` inside `/` to build and copy project files to `/app/iOS_basic/nodejs-project/`.
 - Run `npm install` inside `/app/iOS_basic/nodejs-project/` to install server modules.
 - Download the Node.js on Mobile shared library from [here](https://github.com/janeasystems/nodejs-mobile/releases/download/nodejs-mobile-v0.1.7/nodejs-mobile-v0.1.7-ios.zip).
 - Copy the `NodeMobile.framework` file inside the zip's `Release-universal` path to this project's `/app/iOS_basic/NodeMobile/` folder (there's a `copy-NodeMobile.framework-here` empty file inside the project's folder for convenience).
 - In Xcode import the `/app/iOS_basic/openPerform.xcodeproj` project.
 - Select one physical iOS device as the run target.
 - In the project settings (click on the project main node), in the `Signing` portion of the `General` tab, select a valid Team and handle the provisioning profile creation/update. If you get an error that the bundle identifier cannot be used, you can simply change the bundle identifier to a unique string by appending a few characters to it.
 - Run the app. If the build process doesn't start the app right away, you might have to go to `Settings>General` in the device and enter `Device Management` or `Profiles & Device Management` to manually accept the profile.