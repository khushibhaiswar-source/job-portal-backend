# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json first (if you have one) otherwise skip
COPY package*.json ./

# Install dependencies (if package.json exists)
RUN npm install

# Copy rest of code
COPY . .

# Expose port
EXPOSE 3000

# Run server
CMD ["node", "server.js"]
