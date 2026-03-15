import { BuyerData } from "."

type BuyerValidationResult = {
  isValid: boolean;
  fields: {
    payment: boolean;
    address: boolean;
    email: boolean;
    phone: boolean;
  };
  errors: Partial<Record<keyof BuyerData, string>>;
};

export class Buyer{
    private data: BuyerData = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    }
    setData(data: Partial<BuyerData>) : void {
        this.data = {...this.data, ...data}
    }

    getData() : BuyerData {
        return {...this.data}
    }

    clear() : void {
        this.data = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        }
    }

    validate(): BuyerValidationResult {
    const fields = {
      payment: this.data.payment.trim() !== "",
      address: this.data.address.trim() !== "",
      email: this.data.email.trim() !== "",
      phone: this.data.phone.trim() !== "",
    };

    const errors: Partial<Record<keyof BuyerData, string>> = {};

    if (!fields.payment) errors.payment = "Выберите способ оплаты";
    if (!fields.address) errors.address = "Введите адрес";
    if (!fields.email) errors.email = "Введите email";
    if (!fields.phone) errors.phone = "Введите телефон";

    return {
      isValid: Object.values(fields).every(Boolean),
      fields,
      errors,
    };
  }
}