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
  const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
  const skip = itemsPerPage === -1 ? undefined : (page - 1) * itemsPerPage;
  const take = itemsPerPage === -1 ? undefined : itemsPerPage;

  req.pagination = { skip, take, page, itemsPerPage };

  next();
}
