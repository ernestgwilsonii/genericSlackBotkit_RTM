
#!/bin/bash

DOCKER_REPOSITORY_USERNAME=ernestgwilsonii

# Build the docker image
echo " "
echo "Building a new Slack Botkit Docker image"
echo "########################################"
docker build --no-cache -t ernestgwilsonii/perceptron:v$(jq .version package.json | sed s/\"//g) .
echo "done"

# Display the results
echo " "
echo "Docker image created locally:"
echo "REPOSITORY                              TAG                 IMAGE ID            CREATED                  SIZE"
docker images | grep $DOCKER_REPOSITORY_USERNAME/perceptron
echo " "
