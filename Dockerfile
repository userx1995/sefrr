FROM node:16 AS builder
#FROM node:latest as node
# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
#RUN npm ci --force

# Copy the Angular app source code
COPY . .

# Build the Angular app

ARG ENV_CONFIG
ENV ENV_CONFIG="${ENV_CONFIG}"

RUN npm install --force
RUN npm run build:${ENV_CONFIG}

FROM nginx:alpine
COPY --from=builder /app/dist/ /usr/share/nginx/html
#COPY --from=node /app/dist/ /usr/share/nginx/html
