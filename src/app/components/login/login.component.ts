import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import ValidateForm from 'src/app/shared/validateform';
import {ILoginModel} from 'src/app/models/loginModel'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!:FormGroup;
  public resetPassword!:string;
  public isValidEmail!:boolean;


  constructor(private fb: FormBuilder,private user:UserService,private router:Router,private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.loginForm=this.fb.group({
      loginId:['',Validators.required],
      username:['',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required]
    })
  }

  
  async onLogin(model:ILoginModel){
    if(this.loginForm.valid)
    {
      //send the obj to db
      console.log(this.loginForm.value);
      (await this.user.login(model)).subscribe({
        next:(res)=>{
          console.log(res);
          this.loginForm.reset();
          this.toastrService.success('login successfull','', {
            timeOut: 3000,
          });
          this.router.navigate(['dashboard']);
        },
        error:(err)=>{
          this.toastrService.error('login failed',err.message, {
            timeOut: 3000,
          });
          console.log(err);
        }
      });
    }
    else{
      //throw error through toaster with required fields
        ValidateForm.validateAllFormFields(this.loginForm);
        console.log("Form is not valid");
    }
  }

  checkValidEmail(event:string){
    const value=event;
    const pattern=/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    this.isValidEmail=pattern.test(value);
    return this.isValidEmail;
  }



}
