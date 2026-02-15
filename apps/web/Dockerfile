FROM node:20-alpine

WORKDIR /workspace

COPY apps/web/package.json apps/web/package-lock.json* ./apps/web/
RUN cd apps/web && npm install

COPY apps/web ./apps/web
COPY config ./config

WORKDIR /workspace/apps/web

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
