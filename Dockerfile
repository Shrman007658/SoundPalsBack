FROM node:19-bullseye
RUN mkdir /uploads
COPY ./  ./
RUN npm ci
EXPOSE 3000
CMD [ "npm", "start" ]

