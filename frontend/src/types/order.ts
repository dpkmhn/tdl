export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'NEW' | 'FILLED' | 'CANCELLED';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderRequest {
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
}

export interface OrderSummary {
  totalOrders: number;
  openOrders: number;
  cancelledOrders: number;
  filledOrders: number;
  notionalOpenValue: number;
}

export type OrderFilter = 'ALL' | OrderStatus;
