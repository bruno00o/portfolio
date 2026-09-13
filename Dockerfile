# syntax=docker/dockerfile:1

FROM node:lts-alpine AS build
WORKDIR /app
RUN corepack enable

# Typst renders the CV PDFs at build time (src/pages/**/cv.pdf.ts).
ARG TYPST_VERSION=0.15.1
ARG TARGETARCH
RUN case "$TARGETARCH" in amd64) arch=x86_64 ;; arm64) arch=aarch64 ;; *) echo "unsupported arch: $TARGETARCH" >&2; exit 1 ;; esac \
  && wget -qO- "https://github.com/typst/typst/releases/download/v${TYPST_VERSION}/typst-${arch}-unknown-linux-musl.tar.xz" \
  | tar -xJ -C /usr/local/bin --strip-components=1 "typst-${arch}-unknown-linux-musl/typst"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine-slim AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
