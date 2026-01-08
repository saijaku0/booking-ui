FROM node:24-alpine AS build
WORKDIR /app

COPY app/booking-ui/package*.json ./
RUN npm install --ignore-scripts 

COPY app/booking-ui/ .
RUN npx ng build --configuration=production

FROM nginx:stable-alpine
COPY --from=build /app/dist/booking-ui/browser /usr/share/nginx/html

EXPOSE 80
