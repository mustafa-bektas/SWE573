FROM node:18-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm uninstall -g @angular/cli
RUN npm install -g @angular/cli
RUN npm install
COPY . .


CMD ["ng","serve","--host", "0.0.0.0"]