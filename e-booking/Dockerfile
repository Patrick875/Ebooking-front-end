FROM node:latest
WORKDIR /app
COPY package*.json ./
COPY ./ ./
RUN npm update && npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]