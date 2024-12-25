import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// ตั้งค่าโฟลเดอร์สำหรับไฟล์อัปโหลด
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // เก็บไฟล์ในโฟลเดอร์ uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่
  },
});

const upload = multer({ storage });

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

async function uploadFile(req: Request, res: Response): Promise<void> {
  try {
    upload.single("file")(req, res, (err: any) => {
      if (err) {
        res.status(400).json({
          message: "Upload file failed",
        });

        console.log(err);
      } else {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file!.filename}`;

        res.status(200).json({
          message: "Upload file success",
          data: fileUrl,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default uploadFile;
