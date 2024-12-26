import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../untils/db";
import { User } from "../type/users.type";
import * as XLSX from "xlsx";
import moment from "moment"

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // จำนวนรอบในการสร้าง salt
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw new Error("Error hashing password");
  }
};

async function getUsers(req: Request, res: Response): Promise<void> {
  const { skip = 0, take = 10 } = req.pagination || {};
  try {
    const users = await db.user.findMany({
      skip,
      take,
    });

    res.status(200).json({
      message: "Get user success",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Invalid id",
    });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "Get user success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function createUser(req: Request, res: Response): Promise<void> {
  const { body } = req as {
    body: User;
  };

  if (!body) {
    res.status(400).json({
      message: "Invalid body",
    });

    return;
  }

  if (!body.email || !body.password) {
    res.status(400).json({
      message: "Invalid email or password",
    });

    return;
  }

  const userExist = await db.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (userExist) {
    res.status(400).json({
      message: "Email already exist",
    });
    return;
  }

  try {
    const user = await db.user.create({
      data: {
        name: body.name ? body.name : undefined,
        email: body.email,
        password: await hashPassword(body.password),
      },
    });

    res.status(201).json({
      message: "Create user success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updateUser(req: Request, res: Response): Promise<void> {
  const { body } = req as {
    body: User;
  };

  if (!body) {
    res.status(400).json({
      message: "Invalid body",
    });

    return;
  }

  if (!body.id) {
    res.status(400).json({
      message: "Invalid id",
    });

    return;
  }

  try {
    const user = await db.user.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name ? body.name : undefined,
        email: body.email ? body.email : undefined,
        password: body.password ? body.password : undefined,
      },
    });

    res.status(200).json({
      message: "Update user success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function deleteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Invalid id",
    });
  }

  try {
    const user = await db.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "Delete user success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function sumPaymentPerDate(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const summaryPayment = await db.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!summaryPayment) {
      res.status(400).json({
        message: "User not found",
      });

      return;
    }

    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysRemaining =
      (endOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    const paymentPerDate = Number(summaryPayment?.cashBalance) / daysRemaining;

    res.status(200).json({
      message: "Get payment per date success",
      data: {
        remainMoney: parseFloat(summaryPayment?.cashBalance.toFixed(2)),
        paymentPerDate: parseFloat(paymentPerDate.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function exportPayment(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const userPayment = await db.payment.findMany({
    where: {
      userId: parseInt(id),
    },
    include: {
      transactionSlip: true,
      user: true,
      paymentType: true
    },
  });

  let exportExcel : any;

  if (userPayment) {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        userPayment.map((payment: any) => {
          return {
            user: payment.user.name,
            paymentType: payment.paymentType.increment ? "รายรับ" : "รายจ่าย",
            amount: payment.amount.toString(),
            createdAt: moment(payment.createdAt).format('DD/MM/YYYY')
          };
        })
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
      const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([buffer], { type: "application/octet-stream" });

      const formData = new FormData();
      formData.append("file", blob, "payments.xlsx");

      exportExcel = await fetch("http://localhost:3000/upload", {
        headers: {
          authorization: `${req.headers.authorization?.split("Bearer ")[1]}`,
        },
        method: "POST",
        body: formData,
      }).then(async (res) => {
        return await res.json();
      });


      res.status(200).send({
        message: "Get data payment success",
        data: exportExcel.data
      })
    } catch (error) {
      res.status(500).send({
        message: "Something error when export",
      });
    }
  } else {
    res.status(200).json({
      message: "No data payment in this user",
    });
  }

  
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  sumPaymentPerDate,
  exportPayment,
};
