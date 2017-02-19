Requires Docker: https://www.docker.com/products/overview  
  
Build new Docker Image from this repo  
1. Copy Dockerfile_example to Dockerfile  
2. Edit Dockerfile  
  a. Replace 'name' and 'email' with yours in the 'MAINTAINER' entry  
  b. Replace 'internal_port' with your Node.js server port in teh 'EXPOSE'  
  c. add your 'bitbucket_username' and 'bitbucket_password' to 'RUN git clone' url  
3. Open Terminal  
  a. navigate to this directory (with the Dockerfile)  
  b. Run 'docker build -t docker_hub_organization/repo_name .'  
  c. Wait... for a while  
4. Verify Image was created by running 'docker images'  
  a. (You can also verify the Image was created in the Kitematic app)  
  
Start Container from Docker Image  
1. Open Terminal  
  a. Run 'docker run -d -p external_port:internal_port docker_hub_organization/repo_name'  
2. Verify Container is running by running 'docker ps'  
  a. (You can also verify the Container is running in the Kitematic app)  
3. Open browser  
  a. Navigate to 'http://localhost:external_port'  
  
Upload Docker Image to Docker Hub  
1. Go to hub.docker.com  
  a. Create new repository  
    i. Enter repo_name  
2. Open Terminal  
  a. Run 'docker commit repo_name'  
  b. Run 'docker tag repo_name docker_hub_organization/repo_name'  
  c. Run 'docker login --username="docker_hub_username"'  
  d. Enter your Docker Hub password  
  e. Run 'docker push docker_hub_organization/repo_name'  
  f. Wait... for a while  
  
Deploy on AWS  
1. Log in to AWS Console  
2. Create New Instance  
  a. Find "Amazon ECS-Optimized Amazon Linux AMI" on AWS Marketplace. It has Docker preinstalled.  
  b. Security group must have external_port on the incoming port list  
3. Download and install Docker Container from Docker Hub  
  a. SSH into new AWS instance  
  b. Run 'docker pull docker_hub_organization/repo_name'  
  c. Wait... for a while  
  c. Run 'docker run -d -p external_port:internal_port docker_hub_organization/repo_name'  

Handy Docker Commands  
1. Remove all Images  
  a. Run 'docker rmi $(docker images -q)'  
2. Remove all Containers  
  b. Run 'docker rm $(docker ps -a -q)'  