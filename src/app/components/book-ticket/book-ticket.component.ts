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
  public seatsrowIntheatre!:any;
  public seatsclmIntheatre!:any;
  selected: string[] = [];
  reserved: string[] = [];

  constructor(private movieService:MovieService,
    private userService:UserService,
    private toastrService: ToastrService,
    private router:Router) {
    this.movieService.$cardDataSubject.subscribe({
      next:(cardDetails) => this.cardDetails = cardDetails});
    this.useremail=this.userService.getUserData();
    
   }

  ngOnInit(): void {
    this.generateSeats();
  }

   //click handler
   seatClicked (seatPos: string)  {
    var index = this.selected.indexOf(seatPos);
    
    if(index !== -1) {
        // seat already selected, remove
        this.selected.splice(index, 1)
    } else {
        //push to selected array only if it is not reserved
        if(this.reserved.indexOf(seatPos) === -1)
            this.selected.push(seatPos);
    }
   }

  getChar(i: number){
    return String.fromCharCode(i);
  }
  generateSeats(){
    //this.seatsrowIntheatre = Array.from({length:(this.cardDetails.noOfSeatsAlloted / 10)});
    this.seatsclmIntheatre = Array.from(
      { length: 10},
      (value, index) => 1 + index * 1
      );
    let stop = (65+(this.cardDetails.noOfSeatsAlloted / 10));
    let start  = 65;
    let step = 1;
    this.seatsrowIntheatre  = Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
      );
      console.log(this.seatsrowIntheatre);
      console.log(this.seatsclmIntheatre);
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
