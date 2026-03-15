import {
  IApi,
  OrderRequest,
  OrderResponse,
  ProductListResponse,
} from "../../types";

export class App {
  private api: IApi;
  constructor(api: IApi) {
    this.api = api;
  }
  getProducts(): Promise<ProductListResponse> {
    return this.api.get<ProductListResponse>("/product/");
  }

  createOrder(order: OrderRequest): Promise<OrderResponse> {
    return this.api.post<OrderResponse>("/order/", order);
  }
}
