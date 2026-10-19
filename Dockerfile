# Stage 1: Build React App
FROM node:18-alpine AS builder
WORKDIR /app

# Copy root test/package manifests if needed, and frontend manifests
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code and build production assets
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve with lightweight Nginx web server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default static assets
RUN rm -rf ./*

# Copy production build artifacts from builder stage
COPY --from=builder /app/build ./

# Expose HTTP port
EXPOSE 80

# Start Nginxs
CMD ["nginx", "-g", "daemon off;"]