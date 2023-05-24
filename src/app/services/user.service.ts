import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ILoginModel } from '../models/loginModel';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser:any;
  private baseUrl:string="https://localhost:7108/user/api/v1.0/moviebooking";
  public user!: Observable<ILoginModel>;
  // This will be used to save data locally for token usages.
   private userSubject!:BehaviorSubject<ILoginModel>;

  constructor(private http:HttpClient,private router:Router) {
    // Returns the localstored user and added in userSubject.
    this.userSubject =  new BehaviorSubject<ILoginModel>(JSON.parse(localStorage.getItem('user')!));
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
            return  user;
      })) ;
  }

  getToken(){
   this.currentUser=JSON.parse(localStorage.getItem('user')|| '{}');
    return this.currentUser.token;
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('user');
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['login']);
    
  }

}
