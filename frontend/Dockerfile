FROM node:22

WORKDIR /frontend

COPY frontend/package.json ./package.json 
COPY frontend/package-lock.json ./package-lock.json

RUN npm install

COPY frontend/ .

ENV PATH ./node_modules/.bin:$PATH

CMD ["npm", "start"]

