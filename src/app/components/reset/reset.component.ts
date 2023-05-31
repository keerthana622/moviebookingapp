import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { ConfirmedValidator } from 'src/app/shared/ConfirmedValidator';
import ValidateForm from 'src/app/shared/validateform';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  resetPasswordForm!:FormGroup;
  resetToken!:string;
  resetPasswordObj = new ResetPassword();

  constructor(private fb:FormBuilder,
    private activatedRoute:ActivatedRoute,
    private resetService:ResetPasswordService,
    private toastrService: ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.resetPasswordForm=this.fb.group({
      password:['',Validators.required],
      confirmpassword:['',Validators.required],
    },{ 
      validator: ConfirmedValidator('password', 'confirmpassword')
    });
    this.activatedRoute.queryParams.subscribe(val=>{
      this.resetToken = val['token'] || '{}';
    });
    console.log(this.resetToken);
  }
 
  reset(){
    if(this.resetPasswordForm.valid){
        this.resetPasswordObj.token=this.resetToken;
        this.resetPasswordObj.newPassword=this.resetPasswordForm.value.password;


        this.resetService.resetPassword(this.resetPasswordObj)
        .subscribe({
        next:(res)=>{
          this.toastrService.success('Password reset success',res.message, {
            timeOut: 3000,
          });
          this.router.navigate(['/']);
        },
        error:(err)=>{  
          this.toastrService.error('Token invalid',err.message, {timeOut: 3000});
        }
      })
    }
    else{
      //throw error through toaster with required fields
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
      console.log("Form is not valid");
    }
  }

}
