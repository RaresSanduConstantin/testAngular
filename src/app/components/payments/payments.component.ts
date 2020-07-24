import { Component, OnInit } from '@angular/core';
import { Paymant } from '../../module/pament';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

// Pentru a putea genera un component folosim comanda "ng generate component <numele-componentului>"
// In decoratorul @Component avem un obiect cu trei valori importante, selector ne indica numele tag-ului cu care putem sa accesam acest component in html, template sau templateUrl indica componentului ce html reprezinta si style sau styleUrls spre ce fisier sau fisiere css sa asculte.
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})

// aici exportam clasa de interes, in ea setam metode sau variabile. OnInit este un lifecycle hook, si este apelat dupa ce Angular a initializat datele.
export class PaymentsComponent implements OnInit {
  paymantForm: FormGroup;
  minDate: string;
  paymantSubscribe: Subscription;

  // Constructorul este o functie care se apeleaza la initializarea aplicatiei
  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private tostr: ToastrService
  ) {}

  //metoda ngOnInit() este apelata inainte ca orice component sa fie afisat, aceasta este invocata o singura data.
  ngOnInit(): void {
    // variabila paymantForm care este de tipul FormGroup este definita de catre formBuilder.group(), valorile atribuite lui paymantForm sunt cele din interfata, acestora li se atribuie valoarea initiala si Validatorii pe care trebuie sa ii respecte
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

  // Aceasta metoda ne returneaza dinamic ziua si anul curent, si o seteaza in input-ul de type="date" pentru a nu putea selecta in calendar o data mai mica de ziua curenta.
  dinamicDate() {
    const today = new Date();
    let mm: number = today.getMonth() + 1;
    const yy = today.getFullYear();
    if (mm < 10) {
      this.minDate = yy + '-0' + mm;
    } else {
      this.minDate = yy + '-' + mm;
    }
    console.log(this.minDate);
  }

  // metodele handleError de mai jos ne verifica daca valorile din input-uri se potrivesc cu validatorii setati in metoda ngOnInit, daca acestea nu sunt corecte ne returneaza un string cu eroarea acesta fiind trimis in html.
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
      return 'Te rog sa introduci 3 cifre';
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

  // Metoda submitForm() verifica in prima faza daca toate inputurile sunt "atinse", astfel sa impiedice sa trimita catre server un obiect gol.
  subtmitForm() {
    this.paymantForm.markAllAsTouched();

    if (this.paymantForm.valid) {
      const body: Paymant = {
        creditCardNumber: this.paymantForm.get('creditCardNumber').value,
        cardholder: this.paymantForm.get('cardHolder').value,
        expirationDate: new Date(this.paymantForm.get('expirationDate').value),
        securityCode: this.paymantForm.get('securityCode').value,
        amount: this.paymantForm.get('amount').value,
      };

      this.paymantSubscribe = this.paymentService.submitPayment(body).subscribe(
        (res) => {
          // resetare form dupa primirea raspunsului
          this.paymantForm.get('creditCardNumber').setValue('');
          this.paymantForm.get('cardHolder').setValue('');
          this.paymantForm.get('expirationDate').setValue(undefined);
          this.paymantForm.get('securityCode').setValue('');
          this.paymantForm.get('amount').setValue(undefined);

          //  marcarea inputurilor ca untouched dupa primirea raspunsului cu succes
          this.paymantForm.markAsUntouched();
          // Am folosit pachetul toastr, care a fost instalat cu comanda "ngx-toastr" urmat apoi de importarea acestuia in app.module.ts si angular.json. Raspunsul cu succes este primit de la server.
          this.tostr.success(res.message);
        },
        (error) => {
          // Daca raspunsul nu este primit apare o eroare de la server, aceasta eroare este prinsa si folosind tostr o putem afisa in UI.
          this.tostr.error(
            // Daca exista eroarea si exista si mesajul erorii atunci sa se afiseze mesajul erorii daca nu sa se afiseze stringul de mai jos
            error.error && error.error.message
              ? error.error.message
              : "The payment wasn't succesfull"
          );
        }
      );
    }
  }
  // Pentru a distruge componenta folosim metoda ngOnDsetroy(), in care verificat daca variabila patmantSubscribe exista, si daca da ii spunem sa faca unsubscribe.
  ngOnDestroy() {
    if (this.paymantSubscribe) {
      this.paymantSubscribe.unsubscribe();
    }
  }
}
