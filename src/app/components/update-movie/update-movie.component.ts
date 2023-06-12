import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GetMovieRequest } from 'src/app/models/GetMovieRequest';
import { MovieService } from 'src/app/services/movie.service';
import ValidateForm from 'src/app/shared/validateform';

@Component({
  selector: 'app-update-movie',
  templateUrl: './update-movie.component.html',
  styleUrls: ['./update-movie.component.scss']
})
export class UpdateMovieComponent implements OnInit {
  updateMovieForm!:FormGroup;
  movieDetailsObj = new GetMovieRequest();

  constructor(private fb:FormBuilder,
    private movieService:MovieService,
    private toastrService: ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.updateMovieForm=this.fb.group({
      movieName:['',Validators.required],
      theatreName:['',Validators.required],
    });
  }

  update(){
    if(this.updateMovieForm.valid){
        this.movieDetailsObj=this.updateMovieForm.value;

        this.movieService.updateMovie(this.movieDetailsObj).subscribe({
        next:(res)=>{
          console.log(res);
          this.toastrService.success('Movie  Details Updated Successfully',res.message, {
            timeOut: 3000,
          });
          this.router.navigate(['dashboard']);
        },
        error:(err)=>{  
          this.toastrService.error('Somethings Went Wrong!!',err.message, {timeOut: 3000});
        }
      })
    }
    else{
      //throw error through toaster with required fields
      ValidateForm.validateAllFormFields(this.updateMovieForm);
      console.log("Form is not valid");
    }
  }

  delete(){
    if(this.updateMovieForm.valid){
        this.movieDetailsObj=this.updateMovieForm.value;

        this.movieService.deleteMovie(this.movieDetailsObj)
        .subscribe({
        next:(res)=>{
          this.toastrService.success('Movie  Details Deleted Successfully',res.message, {
            timeOut: 3000,
          });
          this.router.navigate(['dashboard']);
        },
        error:(err)=>{  
          this.toastrService.error('Somethings Went Wrong!!',err.message, {timeOut: 3000});
        }
      })
    }
    else{
      //throw error through toaster with required fields
      ValidateForm.validateAllFormFields(this.updateMovieForm);
      console.log("Form is not valid");
    }
  }

}
