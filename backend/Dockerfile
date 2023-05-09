FROM node:18.16-alpine3.16

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# ENTRYPOINT ["node", "dist/main"]
