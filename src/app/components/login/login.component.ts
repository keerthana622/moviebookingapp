import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import ValidateForm from 'src/app/shared/validateform';
import { ILoginModel } from 'src/app/models/loginModel'
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;


  constructor(private fb: FormBuilder, private user: UserService,
    private router: Router,
    private toastrService: ToastrService,
    private resetService: ResetPasswordService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      loginId: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }


  onLogin() {
    if (this.loginForm.valid) {
      this.user.login(this.loginForm.value).subscribe({
        next: res => {
          if (res) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('username',res.username);
            localStorage.setItem('role',res.role);
            this.toastrService.success('login successfull', res.loginMessage, {
              timeOut: 3000,
            });
            this.router.navigate(['dashboard']);
          }
        },
        error: err => {
          this.toastrService.error('login failed', err.message, {
            timeOut: 3000,
          });
          console.log(err);
        }
      });
    }
    else {
      //throw error through toaster with required fields
      ValidateForm.validateAllFormFields(this.loginForm);
      console.log("Form is not valid");
    }
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      console.log(this.resetPasswordEmail);


      //api call for forgotpassword
      this.resetService.sendPasswordResetLink(this.resetPasswordEmail)
        .subscribe({
          next: (res) => {
            this.toastrService.success('ResetToken has been sent successfully', res.message, {
              timeOut: 3000,
            });
            this.resetPasswordEmail = "";
            const buttonRef = document.getElementById("closeBtn");
            buttonRef?.click();
          },
          error: (err) => {
            this.toastrService.error('Email not found', err.message, { timeOut: 3000 });
          }
        })
    }
  }

}
