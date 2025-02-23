# Use official Node.js LTS Alpine base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Set environment variables correctly
ENV HOST=0.0.0.0  
ENV PORT=3000  

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Command to run the application
CMD ["npm", "start", "--", "-H", "0.0.0.0"]
