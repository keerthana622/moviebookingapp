import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm=this.fb.group({
      username:['',Validators.required],
      email:['',Validators.required],
      loginId:['',Validators.required],
      password:['',Validators.required],
    })
  }

  
  onSubmit(){
    if(this.loginForm.valid)
    {
      //send the obj to db
      console.log(this.loginForm.value);
    }
    else{
      //throw error through toaster with required fields
        this.validateAllFormFields(this.loginForm);
        console.log("Form is not valid");
    }
  }

  private validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control=formGroup.get(field);
      if(control instanceof FormControl){
          control?.markAsDirty({onlySelf:true})
      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
  }

}
