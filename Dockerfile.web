# build React
FROM node:20-alpine AS build

WORKDIR /src

ARG REACT_APP_API_BASE_URL=/api
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

COPY client/package*.json ./client/

WORKDIR /src/client
RUN npm ci

COPY client/ .
RUN npm run build


# nginx
FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/client/build /usr/share/nginx/html
