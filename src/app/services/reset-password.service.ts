import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassword } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private baseUrl:string="https://localhost:7108/user/api/v1.0/moviebooking";
  //reset-passowrd
  //forgot-password?Email=sadhu%40gmail.com
  constructor(private http:HttpClient) { }

  sendPasswordResetLink(email:string){
    let queryParams = new HttpParams().append("email",email);
     return this.http.get<any>(`${this.baseUrl}/forgot-password`,{params:queryParams});
  }

  resetPassword(resetPasswordObj:ResetPassword){
     return this.http.post<any>(`${this.baseUrl}/reset-password`,resetPasswordObj);
  }


}
