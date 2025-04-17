FROM node:18

WORKDIR /app
COPY package*.json ./

# Remove request and install axios
RUN npm uninstall request && \
    npm install axios

COPY . .
EXPOSE 3000
CMD ["node", "index.js"]