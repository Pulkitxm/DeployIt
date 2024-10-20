# Use a specific version for better reproducibility
FROM node:18.17.1-alpine3.18

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install pnpm and dependencies
RUN apk add --no-cache python3 make g++ \
    && npm install -g pnpm \
    && pnpm install \
    && pnpm store prune \
    && apk del python3 make g++

# Copy application files
COPY --chown=nodejs:nodejs . .

# Use non-root user
USER nodejs

# Expose port
EXPOSE 8000

# Start the application
CMD ["node", "src/index.js"]