# Built by uak deploy: Next.js (Vercel needs no file; this is for Render, Fly or Cloud Run).
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund --loglevel=error; else npm install --no-audit --no-fund --loglevel=error; fi
COPY . .
RUN npm run build
ENV PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "npx next start -p ${PORT}"]
