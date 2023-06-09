FROM node:18.16-alpine3.16

WORKDIR /backend

COPY package.json .
COPY package-lock.json .

RUN npm ci

# COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:debug"]

# ENTRYPOINT ["node", "dist/main"]
