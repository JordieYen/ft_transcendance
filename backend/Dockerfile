FROM node:18.16-alpine3.16

# RUN apk update && apk upgrade

# RUN apk add --no-cache bash got openssh

WORKDIR /app

COPY . /app

RUN npm install --verbose && npm run build

COPY ./initdb.sql /docker-entrypoint-initdb.d/initdb.sql

RUN chmod +x /docker-entrypoint-initdb.d/initdb.sql

EXPOSE 3000

# ENTRYPOINT ["node", "dist/main"]

ENTRYPOINT ["./docker-entrypoint.sh"]

CMD ["npm", "run", "start:dev"]
