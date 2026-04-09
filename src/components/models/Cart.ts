import { ProductData } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  private items: ProductData[] = [];
  event: IEvents;

  constructor(event: IEvents) {
    this.event = event;
  }

  addItem(product: ProductData): void {
    this.items.push(product);
    this.event.emit('cart.update');
  }

  deleteItem(productId: string): void {
    this.items = this.items.filter((i) => i.id !== productId);
    this.event.emit('cart.update');
  }

  cleanCart(): void {
    this.items.splice(0, this.items.length);
    this.event.emit('cart.update');
  }

  getQuantity(): number {
    return this.items.length;
  }

  getItems(): ProductData[] {
    return [...this.items];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
