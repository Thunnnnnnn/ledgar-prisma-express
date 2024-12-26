# ใช้ Node.js เป็น base image
FROM node:18

# กำหนด working directory
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install && npm install @prisma/client ts-node

# คัดลอกโค้ดทั้งหมด
COPY . .

# เปิดพอร์ต 3000
EXPOSE 3000

# RUN npm run db:push

CMD ["npm", "run", "dev"]
