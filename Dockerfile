# ใช้ Node.js เป็น base image
FROM node:18-alpine

# กำหนด working directory
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --save-dev nodemon && npm cache clean --force && npm install && npm install ts-node

# คัดลอกโค้ดทั้งหมด
COPY . .

RUN npx prisma generate

# เปิดพอร์ต 3000
EXPOSE 3000

CMD ["npm", "run", "dev"]
