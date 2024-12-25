import { NextFunction, Request, Response } from "express";
import { db } from "../untils/db";
import bcrypt from "bcrypt";

declare module "express-session" {
  interface Session {
    user?: { email: string; token: string };
  }
}

async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (req.session.user) {
    res.status(200).json({
      message: "Already logged in",
    });

    return;
  }

  const userExist = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!userExist) {
    res.status(401).json({
      message: "Invalid email",
    });

    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, userExist.password);

  if (isPasswordCorrect) {
    const token = await bcrypt.hash(email, 10);

    req.session.user = {
      email: userExist.email,
      token,
    };

    console.log(token);

    req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 day
    res.status(200).json({
      message: "Login successful",
    });
  } else {
    res.status(401).json({
      message: "Invalid username or password",
    });
  }
}

async function logout(req: Request, res: Response): Promise<void> {
  // ลบ session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      message: "Logout successful",
    });
  });
}

async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.session.user) {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token || typeof token !== "string") {
      res.status(401).json({
        message: "Unauthenticated",
      });
      return;
    }

    const isTokenValid = await bcrypt.compare(req.session.user.email, token);

    if (!isTokenValid) {
      res.status(401).json({
        message: "Unauthenticated",
      });
      return;
    }

    next();

    return;
  }

  res.status(401).json({
    message: "Unauthenticated",
  });
}

export default {
  login,
  logout,
  checkAuth,
};
