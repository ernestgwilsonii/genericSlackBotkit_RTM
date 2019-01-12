FROM node:11.6.0

# Install Utils
RUN apt-get update && apt-get -y upgrade && \
    apt-get -y install apt-utils && \
    apt-get -y install traceroute mtr iputils-tracepath iputils-ping telnet mc whois dnsutils tcpdump nmap python-pip snmp jq lsof htop expect-dev bridge-utils graphicsmagick

# Create app directory structure
RUN mkdir -p /opt/perceptron/help
RUN mkdir -p /opt/perceptron/lib
RUN mkdir -p /opt/perceptron/skills

# Set Docker working directory
WORKDIR /opt/perceptron

# Copy in app dependencies
COPY *.js /opt/perceptron/
COPY *.json /opt/perceptron/
COPY help/*.js /opt/perceptron/help/
COPY lib/*.js /opt/perceptron/lib/
COPY skills/*.js /opt/perceptron/skills/

# Install Node.js modules
RUN npm install

CMD [ "npm", "start" ]