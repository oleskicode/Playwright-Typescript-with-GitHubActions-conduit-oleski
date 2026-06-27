FROM mcr.microsoft.com/playwright:v1.61.1-jammy
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p .auth
CMD ["npx", "playwright", "test"]