FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .
RUN npx ng build --configuration=production

FROM nginx:stable-alpine
COPY --from=build /app/dist/booking-ui/browser /usr/shared/nginx/html

EXPOSE 80
