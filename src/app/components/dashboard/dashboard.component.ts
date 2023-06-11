import { Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public movies:any=[];
  public username!:string;
  public role!:string;
  public islogin:boolean=false;
  public isAdmin!:boolean;
  public userDetails!:any;


  constructor(private user:UserService,
    private movie:MovieService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    if(this.user.isLoggedIn())
    {
      this.islogin=true;
      this.username=this.user.getUserName();
      this.checkUserRole();
      this.loadMovies();
    }
    
  }

  searchMoviesByName(event:any) {
    const searchText=event.target.value;
    //id="search-clear"
    if(searchText=="")
    {
      this.loadMovies();
    }
    else
    {
      this.movie.getMoviesByName(searchText).subscribe({
        next:(res)=>{
          console.log(res);
           this.movies = res;
          this.toastrService.success('Movie Details',res.message, {
            timeOut: 3000,
          });
        },
        error:(err)=>{
          this.toastrService.error('Something went wrong',err.message, {
            timeOut: 3000,
          });
          console.log(err);
        }
      });
    }
    // this.movie.getMoviesByName(searchStr).subscribe(res => {
    //   console.log(res);
    //   this.movies = res;
    // });
    
  }

  onBookNow(index:number){  
    this.movie.setCardDetails(this.movies[index]);
  }

  loadMovies() {
    this.movie.getMovies().subscribe(res=>{
      this.movies=res;
      console.log(this.movies);
     });
  }

  checkUserRole(){
    this.role=this.user.getUserRole();
    if(this.role=='Admin'){
      this.isAdmin=true;
    }
    else{
      this.isAdmin=false;
    }
  }

  logOut(){
    this.user.logout();
  }

}
