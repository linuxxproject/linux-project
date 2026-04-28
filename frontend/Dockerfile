# ---- Stage: Development ----
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better cache usage
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Start Angular dev server accessible from outside the container
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
