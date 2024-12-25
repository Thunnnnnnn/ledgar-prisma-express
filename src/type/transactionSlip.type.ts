import { Payment } from "./payment.type";

export interface TransactionSlip {
  id?: number;
  slipUrl?: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
  paymentId?: number;
  payment?: Payment;
}
