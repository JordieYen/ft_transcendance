FROM node:18.16-alpine3.16

# RUN apk update && apk upgrade

# RUN apk add --no-cache bash got openssh

WORKDIR /app

COPY . /app

RUN npm install --verbose && npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# ENTRYPOINT ["node", "dist/main"]
