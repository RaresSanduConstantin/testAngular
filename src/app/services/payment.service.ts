import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paymant, RaspunsPostPaymant } from '../module/pament';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  submitPayment(body: Paymant): Observable<RaspunsPostPaymant> {
    const url = 'http://';

    return this.http.post<RaspunsPostPaymant>(url, body);
  }
}
