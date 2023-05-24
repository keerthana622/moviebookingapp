import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private user:UserService,private router:Router,private toastr:ToastrService){

  }
  canActivate() {
    if(this.user.isLoggedIn()){
      return true;
    }else{
      this.toastr.error("Please Login First!");
      this.router.navigate(['login']);
      return false;
    }
   
  }
  
}
