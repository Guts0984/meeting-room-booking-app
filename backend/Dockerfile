# Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate
RUN npm run build

# Production
# FROM node:24-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# COPY package*.json ./
# RUN npm ci --omit=dev && npm cache clean --force
# COPY --from=builder --chown=node:node /app/dist ./dist
# USER node
# EXPOSE 3000
# CMD ["node", "dist/server.js"]
# --- Production Stage ---
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy generated Prisma client from builder if needed, or let it generate/resolve
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/dist ./dist

USER node
EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --url=\"$DATABASE_URL\" && node dist/server.js"]
