import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl:string="https://localhost:7108/movie/api/v1.0/moviebooking";
  //https://localhost:7108/movie/api/v1.0/moviebooking/movies/search/moviename?moviename=Avatar

  constructor(private http:HttpClient) { }

  getMovies(){
    return this.http.get<any>(`${this.baseUrl}/all`);
  }

  getMoviesByName(searchString:string){
    let queryParams = new HttpParams().append("moviename",searchString);
    return this.http.get<any>(`${this.baseUrl}/movies/search/moviename`,{params:queryParams});
  }
}
