import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Ticket } from '../models/Ticket';
import { GetMovieRequest } from '../models/GetMovieRequest';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl:string="https://localhost:7108/movie/api/v1.0/moviebooking";
  //https://localhost:7108/movie/api/v1.0/moviebooking/movies/search/moviename?moviename=Avatar
  public $cardDataSubject;

  constructor(private http:HttpClient) { 
    this.$cardDataSubject = new BehaviorSubject([]);
  }

  getMovies(){
    return this.http.get<any>(`${this.baseUrl}/all`);
  }

  getMoviesByName(searchString:string){
    let queryParams = new HttpParams().append("moviename",searchString);
    return this.http.get<any>(`${this.baseUrl}/movies/search/moviename`,{params:queryParams});
  }

  setCardDetails(cardDetails:any) {
    this.$cardDataSubject.next(cardDetails);
  }

  

  bookMovie(ticketDetails:Ticket) {
     return this.http.post<any>(`${this.baseUrl}/moviename/add`,ticketDetails); 
  }

  getBookedTicketDetails(movieobj:GetMovieRequest){
    let queryParams = new HttpParams().append("moviename",movieobj.movieName).append("theatreName",movieobj.theatreName);
    return this.http.get<any>(`${this.baseUrl}/movies/getBookedMovieDetails/`,{params:queryParams});
  }

  updateMovie(movieUpdateObj:GetMovieRequest)
  {
    //let queryParams = new HttpParams().append("moviename",movieUpdateObj.movieName).append("theatreName",movieUpdateObj.theatreName);
    return this.http.put<any>(`${this.baseUrl}/moviename/update/ticket`,movieUpdateObj);
  }

  deleteMovie(movieDeleteObj:GetMovieRequest)
  {
    let queryParams = new HttpParams().append("moviename",movieDeleteObj.movieName).append("theatreName",movieDeleteObj.theatreName);
    return this.http.delete<any>(`${this.baseUrl}/moviename/delete/id`,{params:queryParams});
  }
 

}

