import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ILoginModel } from '../models/loginModel';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public decodeToken!:any;
  //https://localhost:7108/user/api/v1.0/moviebooking
  private baseUrl:string="https://movieusermicroserviceapp.azurewebsites.net/api/v1.0/moviebooking";

  constructor(private http:HttpClient,private router:Router) {
   }

  register(userobj:any){
      return this.http.post<any>(`${this.baseUrl}/register`,userobj);
  }

  login(loginobj:ILoginModel){
    let queryParams = new HttpParams().append("email",loginobj.email).append("loginId",loginobj.loginId)
    .append("username",loginobj.username).append("password",loginobj.password);
    return this.http.get<any>(`${this.baseUrl}/login`,{params:queryParams});
  }

  isLoggedIn():boolean{
    if(localStorage.getItem('token')!=null){
      return true;
    }
    return false;
  }

  getUserData(){
    if(this.isLoggedIn()){
    var token = localStorage.getItem('token');
    this.decodeToken=jwt_decode(token!);
    return this.decodeToken.email;
    }
  }

  // getUserEmail(){
  //   return this.decodeToken.email;
  // }

  getUserName(){
    return localStorage.getItem('username')!;
  }

  getUserRole(){
    return localStorage.getItem('role')!;
  }


  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }
}


