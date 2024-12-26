import { Request, Response } from "express";
import { db } from "../untils/db";
import { Payment } from "../type/payment.type";

function censorBadWords(text: string): string {
  const badWords = ["bad", "words"];

  const badWordRegex = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");
  return text.replace(badWordRegex, (match) => "*".repeat(match.length));
}

async function getPayments(req: Request, res: Response): Promise<void> {
  const { skip = 0, take = 10 } = req.pagination || {};
  const { month, year, paymentTypeId, userId } = req.query as {
    month: string;
    year: string;
    paymentTypeId: string;
    userId: string;
  };
  let where = {};

  if (month && !year) {
    let setYear = new Date().getFullYear();
    if (month === '12') {
      setYear = setYear + 1;
    }
    where = {
      createdAt: {
        gte: new Date(`${new Date().getFullYear()}-${month}-01`),
        lt: new Date(`${setYear}-${month}-01`),
      },
    };
  }

  if (!month && year) {
    where = {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${parseInt(year) + 1}-01-01`),
      },
    };
  }

  if (month && year) {
    let setYear = parseInt(year)
    if (month === '12') {
      setYear = setYear + 1;
    }
    where = {
      createdAt: {
        gte: new Date(`${year}-${month}-01`),
        lt: new Date(`${setYear}-${month}-01`),
      },
    };
  }

  if (paymentTypeId) {
    where = {
      ...where,
      paymentTypeId: parseInt(paymentTypeId),
    };
  }

  if (userId) {
    where = {
      ...where,
      userId: parseInt(userId),
    };
  }

  try {
    const payments = await db.payment.findMany({
      skip,
      take,
      where,
    });

    res.status(200).json({
      message: "Get payment success",
      data: payments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getPayment(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Invalid id",
    });

    return;
  }

  try {
    const payment = await db.payment.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "Get payment success",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function createPayment(req: Request, res: Response): Promise<void> {
  const { body } = req as {
    body: Payment;
  };

  if (!body) {
    res.status(400).json({
      message: "Invalid body",
    });

    return;
  }

  if (!body.amount || !body.userId || !body.paymentTypeId) {
    res.status(400).json({
      message: "Invalid amount, userId or paymentTypeId",
    });

    return;
  }

  try {
    const payment = await db.payment.create({
      data: {
        amount: +body.amount,
        user: {
          connect: {
            id: +body.userId,
          },
        },
        paymentType: {
          connect: {
            id: +body.paymentTypeId,
          },
        },
        transactionSlip: {
          create: body.transactionSlip
            ? {
                slipUrl: body.transactionSlip.slipUrl, // ต้อง upload ไฟล์ก่อนเพื่อได้ URL ก่อน เพื่อนำมาใส่ในฐานข้อมูล ไม่สามารถส่งไฟล์มาตรงๆได้
                note: body.transactionSlip?.note
                  ? censorBadWords(body.transactionSlip?.note)
                  : undefined,
              }
            : undefined,
        },
      },
    });

    const paymentType = await db.paymentType.findUnique({
      where: {
        id: +body.paymentTypeId,
      },
    });

    if (paymentType?.increment) {
      try {
        await db.user.update({
          where: {
            id: +body.userId,
          },
          data: {
            cashBalance: {
              increment: +body.amount,
            },
          },
        });
      } catch (error) {
        res.send(500).json({
          message: "Internal server error",
        });

        return;
      }
    } else {
      try {
        await db.user.update({
          where: {
            id: +body.userId,
          },
          data: {
            cashBalance: {
              decrement: +body.amount,
            },
          },
        });
      } catch (error) {
        res.send(500).json({
          message: "Internal server error",
        });
        return;
      }
    }

    res.status(200).json({
      message: "Create payment success",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updatePayment(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { body } = req as {
    body: Payment;
  };

  if (!id) {
    res.status(400).json({
      message: "Invalid id",
    });

    return;
  }

  if (!body) {
    res.status(400).json({
      message: "Invalid body",
    });

    return;
  }

  try {
    const payment = await db.payment.update({
      where: {
        id: parseInt(id),
      },
      data: {
        amount: body.amount ? +body.amount : undefined,
        user: {
          connect: {
            id: body.userId ? +body.userId : undefined,
          },
        },
        paymentType: {
          connect: {
            id: body.paymentTypeId ? +body.paymentTypeId : undefined,
          },
        },
        transactionSlip: {
          create: body.transactionSlip
            ? {
                slipUrl: body.transactionSlip.slipUrl,
                note: body.transactionSlip?.note
                  ? censorBadWords(body.transactionSlip?.note)
                  : undefined,
              }
            : undefined,
        },
      },
    });

    res.status(200).json({
      message: "Update payment success",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function deletePayment(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Invalid id",
    });
  }

  try {
    const beforeDelete = await db.payment.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        paymentType: true,
      },
    });
    if (beforeDelete?.paymentType?.increment) {
      await db.user.update({
        where: {
          id: beforeDelete?.userId,
        },
        data: {
          cashBalance: {
            decrement: beforeDelete?.amount,
          },
        },
      });
    } else {
      await db.user.update({
        where: {
          id: beforeDelete?.userId,
        },
        data: {
          cashBalance: {
            increment: beforeDelete?.amount,
          },
        },
      });
    }

    const payment = await db.payment.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "Delete payment success",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
};
