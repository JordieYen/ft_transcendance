FROM node:14-alpine3.13

WORKDIR /app

COPY . /app

RUN npm install --verbose

EXPOSE 3000

# SHELL ["/bin/bash", "-c"]

CMD ["npm", "run", "start:prod"]

# CMD ["/bin/sh", "-c", "npm run start:prod"]
