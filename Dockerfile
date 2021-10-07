FROM node:latest

RUN npm install -g --unsafe-perm node-red

WORKDIR /loyalty

COPY . .

WORKDIR /root/.node-red

RUN npm install /loyalty

EXPOSE 1880

ENTRYPOINT ["node-red"]
