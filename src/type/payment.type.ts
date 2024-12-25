import type { User } from "./users.type";
import type { PaymentType } from "./paymentType.type";
import type { TransactionSlip } from "./transactionSlip.type";

export interface Payment {
  id?: number;
  amount?: number;
  paymentType?: PaymentType;
  paymentTypeId?: number;
  user?: User;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  transactionSlip?: TransactionSlip;
}
