import { ProductData } from "../../types";

export class Catagol {
  private products: ProductData[] = [];
  private selectedProduct: ProductData | null = null;

  getProducts(): ProductData[] {
    return this.products;
  }

  setProducts(products: ProductData[]) {
    this.products = products;
  }

  selectProduct(product: ProductData) {
    this.selectedProduct = product;
  }

  getSelectedProduct(): ProductData | null {
    return this.selectedProduct;
  }

  getProductById(productId: string): ProductData | null {
    return this.products.find((p) => p.id === productId) ?? null;
  }
}
