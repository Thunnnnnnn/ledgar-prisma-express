import { NextFunction, Request, Response } from "express";
import { Pagination } from "../type/pagination.type";

declare global {
  namespace Express {
    interface Request {
      pagination?: Pagination;
    }
  }
}

export function paginationMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = limit === -1 ? undefined : (page - 1) * limit;
  const take = limit === -1 ? undefined : limit;

  req.pagination = { skip, take, page, limit };

  next();
}
