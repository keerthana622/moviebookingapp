import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl:string="https://localhost:7108/movie/api/v1.0/moviebooking";

  constructor(private http:HttpClient) { }

  getMovies(){
    return this.http.get<any>(`${this.baseUrl}/all`);
  }
}
