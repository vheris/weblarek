import { BuyerData, BuyerValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private data: BuyerData = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };
  protected event: IEvents;

  constructor(event: IEvents) {
    this.event = event;
  }

  setData(data: Partial<BuyerData>): void {
    this.data = { ...this.data, ...data };
    this.event?.emit('buyer.changed');
  }

  getData(): BuyerData {
    return { ...this.data };
  }

  clear(): void {
    this.data = {
      payment: "",
      address: "",
      email: "",
      phone: "",
    };
    this.event?.emit('buyer.changed');
  }

  validate(): BuyerValidationErrors {
    const fields = {
      payment: this.data.payment.trim() !== "",
      address: this.data.address.trim() !== "",
      email: this.data.email.trim() !== "",
      phone: this.data.phone.trim() !== "",
    };

    const errors: BuyerValidationErrors = {};

    if (!fields.payment) errors.payment = "Выберите способ оплаты";
    if (!fields.address) errors.address = "Введите адрес";
    if (!fields.email) errors.email = "Введите email";
    if (!fields.phone) errors.phone = "Введите телефон";

    return errors;
  }
}
