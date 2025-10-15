export interface SinglePriceServiceData {
  name: string;
  price: number;
}

export interface MultiPriceServiceData {
  name: string;
  prices: Record<string, number>;
}
