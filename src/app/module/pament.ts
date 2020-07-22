export interface Paymant {
  creditCardNumber: string;
  cardholder: string;
  expirationDate: Date;
  securityCode?: string;
  amount: number;
}
