import { Request, Response } from "express";
import { db } from "../untils/db";
import { PaymentType } from "../type/paymentType.type";

async function getPaymentTypes(req: Request, res: Response): Promise<void> {
  const { skip = 0, take = 10 } = req.pagination || {};
  try {
    const paymentTypes = await db.paymentType.findMany({
      skip,
      take,
    });

    res.status(200).json({
      message: "Get payment type success",
      data: paymentTypes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getPaymentType(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Invalid id",
    });

    return;
  }

  try {
    const paymentType = await db.paymentType.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "Get payment type success",
      data: paymentType,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function createPaymentType(req: Request, res: Response): Promise<void> {
  const { body } = req as {
    body: PaymentType;
  };

  if (!body) {
    res.status(400).json({
      message: "Invalid body",
    });

    return;
  }

  if(!body.name) {
    res.status(400).json({
      message: "Invalid name",
    });

    return;
  }

  try {
    const paymentType = await db.paymentType.create({
      data: {
        name: body.name,
      },
    });

    res.status(200).json({
      message: "Create payment type success",
      data: paymentType,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updatePaymentType(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { body } = req as {
    body: PaymentType;
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
    const paymentType = await db.paymentType.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: body.name ? body.name : undefined,
      },
    });

    res.status(200).json({
      message: "Update payment type success",
      data: paymentType,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function deletePaymentType(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: "Invalid id",
    });

    return;
  }

  try {
    await db.paymentType.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "Delete payment type success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export const paymentTypeController = {
  getPaymentTypes,
  getPaymentType,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
};