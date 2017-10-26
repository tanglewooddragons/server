FROM node:8.7.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install -quiet

# Bundle app source
COPY . .

CMD [ "npm", "start" ]
