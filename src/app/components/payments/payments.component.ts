import { Component, OnInit } from '@angular/core';
import { Paymant } from '../../module/pament';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit {
  paymantForm: FormGroup;
  minDate: string;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.paymantForm = this.formBuilder.group({
      creditCardNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]*$/)],
      ],
      cardHolder: ['', Validators.required],
      expirationDate: [undefined, Validators.required],
      securityCode: [
        '',
        [
          Validators.maxLength(3),
          Validators.minLength(3),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      amount: [undefined, [Validators.min(1), Validators.required]],
    });

    this.dinamicDate();
  }

  dinamicDate() {
    const today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    const yy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    this.minDate = yy + '-' + mm + '-' + dd;
  }

  handleCardNumberError(): string {
    if (
      this.paymantForm.get('creditCardNumber').hasError('required') &&
      this.paymantForm.get('creditCardNumber').touched
    ) {
      return 'Te rog sa introduci un numar de card!';
    } else if (this.paymantForm.get('creditCardNumber').hasError('pattern')) {
      return 'Te rog sa introduci doar numere';
    } else {
      return '';
    }
  }

  handleCardHolder(): string {
    if (
      this.paymantForm.get('cardHolder').invalid &&
      this.paymantForm.get('cardHolder').touched
    ) {
      return 'Te rog sa introduci un nume!';
    } else {
      return '';
    }
  }

  handleSecurityCode(): string {
    if (this.paymantForm.get('securityCode').hasError('pattern')) {
      return 'Te rog sa introduci un cod format din 3 cifre.';
    } else if (
      this.paymantForm.get('securityCode').hasError('maxlength') ||
      this.paymantForm.get('securityCode').hasError('minlength')
    ) {
      return 'Te rog sa introduci 3 cifre pentru codul de securitate';
    } else {
      return '';
    }
  }

  handleExpirationDate(): string {
    if (
      this.paymantForm.get('expirationDate').invalid &&
      this.paymantForm.get('expirationDate').touched
    ) {
      return 'Te rog sa introduci o data de expirare';
    } else {
      return '';
    }
  }

  handleAmountError(): string {
    if (
      this.paymantForm.get('amount').touched &&
      this.paymantForm.get('amount').invalid
    ) {
      return 'Te rog sa introduci o suma mai mare de 1';
    } else {
      '';
    }
  }

  subtmitForm() {
    this.paymantForm.markAllAsTouched();

    if (this.paymantForm.valid) {
      console.log(123);
    }
  }
}
