import { ProductData } from "../../types";

export class Cart {
  private items: ProductData[] = [];

  addItem(product: ProductData): void {
    this.items.push(product);
  }

  deleteItem(productId: string): void {
    this.items = this.items.filter((i) => i.id !== productId);
  }

  cleanCart(): void {
    this.items.splice(0, this.items.length);
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
