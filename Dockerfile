FROM node:20-alpine
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

# copy source last to enable better layer caching on deps
COPY src ./src

ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "run", "dev"]
