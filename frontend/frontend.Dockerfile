# Stage 1: Build the React Application (node.js/npm)
FROM node:22 AS node-builder

# Copy the files required for build
COPY ./ /frontend

# Set the working directory in the container
WORKDIR /frontend

# Install Node.js dependencies
RUN npm install

# Building the React application with vite
RUN npm run build

# Stage 2: Build apache-http image containing static resources
FROM httpd:2.4
COPY --from=node-builder /frontend/dist /usr/local/apache2/htdocs/
