import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paymant, RaspunsPostPaymant } from '../module/pament';

// Scopul service-ului este acela de a face fetch pentru componente, scopul componentelor este de a prezenta si delega informatii catre un serviciu. Pentru a genera un serviciu folosim comanda "ng generate service <nume-serviciu>"
// Atunci cand ai un serviciu la nivelul "root", Angular creeaza o singura instanta comuna pentru clasa pe care vrei sa o exporti si o injecteaza in orice alta clasa care o solicita.
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private header = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  // deoarece lucram cu un server avem nevoie de request-uri Http, acest serviciu este disponibil ca o clasă injectabilă, cu metode pentru a efectua solicitări HTTP
  constructor(private http: HttpClient) {}

  // aceasta functie primeste ca parametru un obiect de tip Paymant, aceesta fiind definit in /module/pamant.ts si returneaza un observabil cu ajutorul caruia asteptam raspunsul de la server, in functie de statusul raspunsului va apela prima functie din subscribe daca nu a doua functie
  submitPayment(body: Paymant): Observable<RaspunsPostPaymant> {
    const url = 'http://localhost:3000/paymant';

    return this.http.post<RaspunsPostPaymant>(url, body, {
      headers: this.header,
    });
  }
}
