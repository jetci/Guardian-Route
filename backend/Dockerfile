FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache bash python3 make g++ libc6-compat

# Copy package manifests for caching
COPY package.json package-lock.json ./

# Install full dev dependencies for build
RUN npm ci --production=false

# Copy prisma and generate client early
COPY prisma ./prisma
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /usr/src/app

# Create a non-root user
RUN addgroup -S app && adduser -S -G app app

# Install minimal runtime deps
RUN apk add --no-cache ca-certificates

# Copy production deps and built output from builder
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

USER app

EXPOSE 3001

CMD ["node", "dist/src/main.js"]
