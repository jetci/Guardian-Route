FROM node:18-alpine

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache bash python3 make g++

# Copy package manifests first for caching
COPY package.json package-lock.json ./

# Install deps
RUN npm ci --production=false

# Copy prisma schema and generate client early
COPY prisma ./prisma
RUN npx prisma generate

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/src/main.js"]
