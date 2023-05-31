import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public movies:any=[];
  public username:string="";
  public islogin:boolean=false;

  constructor(private user:UserService,private movie:MovieService) { }

  ngOnInit(): void {
    if(this.user.isLoggedIn())
    {
      this.islogin=true;
      this.getUserName();
      this.movie.getMovies().subscribe(res=>{
      this.movies=res;
      console.log(this.movies);
     });
    }
  }

  // getAllMovies(){

  // }

  getUserName(){
    this.username=this.user.getUserName();
  }

  logOut(){
    this.user.logout();
  }

}
