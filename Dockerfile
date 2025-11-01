#Base Image
FROM node:18

#set work directory
WORKDIR /backend

# copy package files first
COPY backend/package*.json ./

#Install dependencies
RUN npm install

#copy rest of the code
COPY backend/ .

#Export port
EXPOSE 3000

# Start your app
CMD ["npm", "start"]