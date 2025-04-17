FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production  # Install only production deps
COPY . .
EXPOSE 3000
CMD ["npm", "start"]