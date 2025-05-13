FROM node:22

# Copy the files required for build
COPY ./ /backend-js

# Set the working directory in the container
WORKDIR /backend-js

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "backend"]

