# Multi-stage Dockerfile for Lucky Draw Application
# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build

WORKDIR /frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Set API URL to relative path (since frontend and backend are on same server)
ENV REACT_APP_API_URL=/api

# Build frontend (production build)
RUN npm run build

# Stage 2: Build Backend and Combine
FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies (production only)
RUN npm install --production

# Copy backend source code
COPY backend/ ./

# Copy built frontend from stage 1
COPY --from=frontend-build /frontend/build ./public

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
