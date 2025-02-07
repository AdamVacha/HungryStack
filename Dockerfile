# Build stage
FROM node:20-slim AS builder
RUN npm install -g pnpm@8
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build

# Production stage
FROM node:20-slim
WORKDIR /app
RUN npm install -g pnpm@8
COPY --from=builder /app/build build/
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
RUN pnpm install --prod
EXPOSE 5173 
CMD ["pnpm", "dev", "--host"]