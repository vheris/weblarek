import { ProductData } from "../../types";
import { IEvents } from "../base/Events";

export class Catagol {
  private products: ProductData[] = [];
  private selectedProduct: ProductData | null = null;
  event: IEvents;

  constructor(event: IEvents) {
    this.event = event;
  }

  getProducts(): ProductData[] {
    return this.products;
  }

  setProducts(products: ProductData[]) {
    this.products = products;
    this.event?.emit('products.update');
  }

  selectProduct(product: ProductData) {
    this.selectedProduct = product;
    this.event?.emit('product.current');

  }

  getSelectedProduct(): ProductData | null {
    return this.selectedProduct;
  }

  getProductById(productId: string): ProductData | null {
    return this.products.find((p) => p.id === productId) ?? null;
  }
}
