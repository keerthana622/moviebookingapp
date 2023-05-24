import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ConfirmedValidator } from 'src/app/shared/ConfirmedValidator';
import ValidateForm from 'src/app/shared/validateform';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!:FormGroup;

  constructor(private fb: FormBuilder,private user:UserService,private router:Router,private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.registerForm=this.fb.group({
      username:['',Validators.required],
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email:['',Validators.required],
      loginId:['',Validators.required],
      password:['',Validators.required],
      confirmpassword:['',Validators.required],
      contactnumber:['',Validators.required],
      role:['',Validators.required]
    },{ 
      validator: ConfirmedValidator('password', 'confirmpassword')
    })
  }

  onRegister(){
    if(this.registerForm.valid)
    {
      //send the obj to db
      console.log(this.registerForm.value);
      this.user.register(this.registerForm.value).subscribe({
        next:(res)=>{
          console.log(res);
          this.registerForm.reset();
          this.toastrService.success('Registered successfully',res.message, {
            timeOut: 3000,
          });
          this.router.navigate(['login']);
        },
        error:(err)=>{
          this.toastrService.error('Registeration failed',err.message, {
            timeOut: 3000,
          });
          console.log(err);
        }
      });
    }
    else{
      //throw error through toaster with required fields
        ValidateForm.validateAllFormFields(this.registerForm);
        console.log("Form is not valid");
    }
  }

  

}
