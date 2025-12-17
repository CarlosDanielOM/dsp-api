# Use Node.js LTS version as base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]
