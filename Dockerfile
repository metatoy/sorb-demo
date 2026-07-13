# syntax=docker/dockerfile:1
# Stage 1 — build the Vite static site (isolated from the pnpm workspace: @sorb/* resolve from npm)
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
# Build-time env (Vite inlines VITE_* at build; Coolify passes buildtime env vars as --build-arg)
ARG VITE_SORB_ORIGIN
ARG VITE_SORB_KEY
ARG VITE_SORB_PREVIEW
ARG VITE_SORB_DEMO_ORIGIN
ENV VITE_SORB_ORIGIN=$VITE_SORB_ORIGIN \
    VITE_SORB_KEY=$VITE_SORB_KEY \
    VITE_SORB_PREVIEW=$VITE_SORB_PREVIEW \
    VITE_SORB_DEMO_ORIGIN=$VITE_SORB_DEMO_ORIGIN
# Drop workspace lockfiles so npm resolves @sorb/leaf@^0.2.0 -> 0.2.1 (Bearer auth) from the registry
RUN rm -f pnpm-lock.yaml package-lock.json && npm install --no-audit --no-fund && npm run build

# Stage 2 — serve the built /dist via nginx (SPA fallback)
FROM nginx:alpine
RUN apk add --no-cache curl        # Coolify runs its healthcheck by exec'ing curl in-container
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
