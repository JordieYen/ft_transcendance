FROM node:14-alpine3.13

WORKDIR /app

COPY . /app

RUN npm install --verbose && npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

# CMD ["/bin/sh", "-c", "npm run start:prod"]
