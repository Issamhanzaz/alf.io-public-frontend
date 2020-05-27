FROM node:12.16.1-alpine As node

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:1.15.8-alpine

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY ../default.conf /etc/nginx/conf.d

COPY --from=node /usr/src/app/dist/alfio-public-frontend /usr/share/nginx/html