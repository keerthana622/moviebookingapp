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

  constructor(private user:UserService,private movie:MovieService) { }

  ngOnInit(): void {
    this.movie.getMovies().subscribe(res=>{
      this.movies=res;
    });
  }

  logOut(){
    this.user.logout();
  }

}
