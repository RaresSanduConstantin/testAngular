export interface Paymant {
  creditCardNumber: string;
  cardholder: string;
  expirationDate: Date;
  securityCode?: string;
  amount: number;
}

export interface RaspunsPostPaymant {
  message: string;
}
