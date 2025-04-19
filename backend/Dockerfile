FROM node:alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN mkdir -p /app/uploads && chmod 777 /app/uploads

EXPOSE 3000

CMD ["npm", "start"]
