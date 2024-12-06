FROM node:22.7

WORKDIR /app

RUN touch .env 

COPY src .

RUN npm install && npm rebuild bcrypt --build-from-source 

EXPOSE 3000

CMD ["node", "app.js"]