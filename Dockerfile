FROM node
WORKDIR /app

COPY package*.json ./
RUN npm install  # Install dependencies

COPY . .  # Copy all files

EXPOSE 3000
CMD ["npm", "start"]
