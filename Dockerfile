FROM node:20-alpine AS build

ENV VITE_BASE_DOMAIN=$VITE_BASE_DOMAIN
ENV VITE_HOST=$VITE_HOST

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
