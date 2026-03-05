FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY logger.js .
# Create the directory for the shared JSON file
RUN mkdir -p /var/www/html
CMD ["node", "logger.js"]