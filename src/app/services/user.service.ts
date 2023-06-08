import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ILoginModel } from '../models/loginModel';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { getLocaleDateTimeFormat } from '@angular/common';
import { ILoginModelResponse } from '../models/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //public currentUser:any=JSON.parse(localStorage.getItem('user')|| '{}');
  private baseUrl:string="https://localhost:7108/user/api/v1.0/moviebooking";
  public user!: Observable<ILoginModelResponse>;
  // This will be used to save data locally for token usages.
   private userSubject!:BehaviorSubject<ILoginModelResponse>;

  constructor(private http:HttpClient,private router:Router) {
    // Returns the localstored user and added in userSubject.
    this.userSubject =  new BehaviorSubject<ILoginModelResponse>(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
   }

  register(userobj:any){
      return this.http.post<any>(`${this.baseUrl}/register`,userobj);
  }

  async login(loginobj:ILoginModel):Promise<Observable<ILoginModel>>{
    const illuminateNils = JSON.parse(JSON.stringify(loginobj));
    const params = new HttpParams({
      fromObject: illuminateNils,
    });
      return  await this.http.get<ILoginModel>(`${this.baseUrl}/login`,{
        params,
      })
      .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user',JSON.stringify(user));
            this.userSubject.next(user);
            console.log(user);
            return  user;
      })) ;
  }

  getToken(){
    return this.userSubject.value.token;
  }

  getUserName()
  {
    return this.userSubject.value.username;
  }

  getUserEmail(){
    return this.userSubject.value.email;
  }

  getUserRole(){
    return this.userSubject.value.role;
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('user');
  }

  logout(){
    // const expires = new Date(this.currentUser.expiration);
    // let currentdate=new Date().toString();
    // if(expires.toString()==currentdate){
    //   localStorage.clear();
    //   this.router.navigate(['login']);
    // }
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
