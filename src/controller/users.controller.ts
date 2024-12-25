import { Request, Response } from "express";
import { db } from "../untils/db";
import { User } from "../type/users.type";

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
  }

  if (!body.email || !body.password) {
    res.status(400).json({
      message: "Invalid email or password",
    });
  }
  try {
    const user = await db.user.create({
      data: {
        name: body.name ? body.name : undefined,
        email: body.email!,
        password: body.password!,
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
  }

  if (!body.id) {
    res.status(400).json({
      message: "Invalid id",
    });
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

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
