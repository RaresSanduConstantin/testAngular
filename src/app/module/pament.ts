// Deoarece folosim TypeScript folosim interfate pentru a ne fi mai usor atunci cand definim anumite variabile, in cazul de fata exportam doua interfete una definind valorile inputurilor noastre si una fiind mesajul de la server.

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
