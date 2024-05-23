# etapa de compilación
FROM node:18.19.0-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# etapa de producción
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/dist/portalplus-app/browser /usr/share/nginx/html
COPY nginx /etc/nginx/conf.d/
EXPOSE 9001
CMD ["nginx", "-g", "daemon off;"]