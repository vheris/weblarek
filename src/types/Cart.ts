import { ProductData } from ".";

export class Cart {
    private items: ProductData[] = [];

    addItem(product: ProductData): void {
        this.items.push(product)
    }

    delItem(productId: string): void {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id == productId) {
                this.items.splice(i,1)
            }
        }
    }

    cleanCart(): void {
        this.items.splice(0,this.items.length)
    }

    getQuantity(): number {
        return this.items.length;
    }

    getItems(): ProductData[] {
        return [...this.items];
    }

    getTotalPrice(): number {
        let total = 0;
        for (let i = 0; i < this.items.length; i++) {
            for (const item of this.items) {
                if (item.price !== null) {
                total += item.price;
                }
            }
        }
        return total;
    }

    hasItem(productId: string): boolean {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id == productId) {
                return true;
            }
        }
        return false;
    }
}