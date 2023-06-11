import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ticket } from 'src/app/models/Ticket';
import { MovieService } from 'src/app/services/movie.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.scss']
})
export class BookTicketComponent implements OnInit {
  @ViewChild('Ticketinput') Ticketinput! : ElementRef ;

  public TicketForm!:FormGroup;
  public cardDetails!:any;
  public useremail!:string;
  public TicketsBooked!:number;
  public seats!:any;
  public ticketObj = new Ticket();
  

  constructor(private movieService:MovieService,
    private userService:UserService,
    private toastrService: ToastrService,
    private router:Router) {
    this.movieService.$cardDataSubject.subscribe({
      next:(cardDetails) => this.cardDetails = cardDetails});
    this.useremail=this.userService.decodeToken.email;
    
   }

  ngOnInit(): void {
  }

  generateSeatNumbers(){
    //const TicketsBooked=this.TicketForm.value.numberOfTickets;
     this.TicketsBooked=this.Ticketinput.nativeElement.value;
    this.seats=Array.from({length: this.TicketsBooked}, () => Math.floor(Math.random() * this.cardDetails.noOfSeatsAlloted));
    console.log(this.seats);
  }

  bookTicket(){
    this.ticketObj.email=this.useremail;
    this.ticketObj.movieName=this.cardDetails.movieName;
    this.ticketObj.theatreName=this.cardDetails.theatreName;
    this.ticketObj.numberOfTickets=this.TicketsBooked;
    this.ticketObj.seatNumber=this.seats;

    this.movieService.bookMovie(this.ticketObj)
        .subscribe({
        next:(res)=>{
          this.toastrService.success('Ticket booked successfully',res.message, {
            timeOut: 3000,
          });
          this.router.navigate(['/dashboard']);
        },
        error:(err)=>{  
          this.toastrService.error('Ticket booking failed',err.message, {timeOut: 3000});
        }
      })
  }

}
