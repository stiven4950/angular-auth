import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  formUser = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]]
  });

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [CustomValidators.MatchValidator('password', 'confirmPassword')]
  });
  status: RequestStatus = 'init';
  statusUser: RequestStatus = 'init';
  errorMessage: string = '';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  showFormRegister = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { }

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      this.authService.registerAndLogin(name, email, password)
        .subscribe({
          next: () => {
            this.status = 'success';
            this.router.navigate(['/app/boards']);
          },
          error: (e: HttpErrorResponse) => {
            this.errorMessage = e.error.message?.includes("UNIQUE") ? "Email already exists go to login" : "Your data is corrupt, look for errors";
            this.status = 'failed';
          }
        })
    } else {
      this.form.markAllAsTouched();
    }
  }

  validateUser() {
    if (this.formUser.valid) {
      this.statusUser = 'loading';
      const { email } = this.formUser.getRawValue();
      this.authService.isAvailable(email)
        .subscribe({
          next: (res) => {
            this.statusUser = "success";
            if (res.isAvailable) {
              this.showFormRegister = true;
              this.form.controls.email.setValue(email);
            } else {
              this.router.navigate(["/login"], { queryParams: { email } });
            }
          }
        })
    } else {
      this.formUser.markAllAsTouched();
    }
  }
}
