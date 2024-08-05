# Base image
FROM node:20.9.0-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock (if available)
COPY main-service/package.json main-service/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the source code
COPY main-service .

# build prod
RUN yarn build
