FROM node:14.18.1-alpine as node-angular-cli
 
# Building Angular app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
 
# Creating bundle
RUN npm run prod
 
WORKDIR /app/dist/moviebookingapp
EXPOSE 80
ENV PORT 80
RUN npm install http-server -g
CMD [ "http-server" ]