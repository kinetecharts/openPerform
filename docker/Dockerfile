FROM node:latest
MAINTAINER Travis Bennett "travis@kineviz.com"

#Increment before building or updating image
LABEL version="1.0"

# Open internal port (This is the port the node.js server is running on.)
EXPOSE 8000

# Clone our private GitHub Repository (Temporary solution. Needs encyrption key.)
RUN git clone https://Jerknose:ZV9-Jf5-pkv-koP@bitbucket.org/kineviz/lobbycallglobe.git /home/node/app

# Change to new repo directory
WORKDIR /home/node/app

# Install dependancies
RUN npm install gulp -g
RUN npm install

# Copy default server conifig (Temporary solution. Config may need to be updated.)
RUN cp server/config_example.js server/config.js

# Build and run project
RUN gulp build
CMD ["node", "server/server.js"]