import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GetMovieRequest } from 'src/app/models/GetMovieRequest';
import { SeatModel } from 'src/app/models/SeatModel';
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

  public cardDetails!:any;
  public useremail!:string;
  public TicketsBooked!:number;
  public seats!:any;
  public ticketObj = new Ticket();
  public seatsrowIntheatre!:any;
  public seatsclmIntheatre!:any;
  public bookingSeats: string[] = [];
  public displaySelectedSeat : string = '';
  public reserved:string[]=[];
  public seatmat! : SeatModel[][];
  public reservemat!:SeatModel[][];
  public movieDetailsObj = new GetMovieRequest();
  public ticketdata!:any;

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

  getReservedSeats(){
     this.movieDetailsObj.movieName=this.cardDetails.movieName;
     this.movieDetailsObj.theatreName=this.cardDetails.theatreName;
      this.movieService.getBookedTicketDetails(this.movieDetailsObj).subscribe({
        next:(res)=>{
          //console.log(res);
          // this.reserved.push(res);
          const temp=res;
          console.log(temp);
          this.seatSelection(res);
        },
      })
      
      
  }

  checkBookedSeats(rowNumber:number,colNumber:number,seatsalreadyresaerved:any){
    for(var i=0;i<seatsalreadyresaerved.length;i++)
    {
      let temp=seatsalreadyresaerved[i].split('');
      //console.log(temp);
      console.log((temp[0].charCodeAt(0))-65);
      if((temp[0].charCodeAt(0))-65==rowNumber && Number(temp[1])==colNumber){
        return true;
      }

    }
    return false;
  }

  seatSelection(reservedSeat:any){
  //  console.log(reservedSeat);
    this.seatmat = [];
    for(var i = 0; i < this.seatsrowIntheatre.length; i++) {
        this.seatmat[i] = [];
        for(var j = 1; j<= 10; j++) {
            let seatmodel = new SeatModel();
            seatmodel.RowNumber = i;
            seatmodel.colNumber = j;
            seatmodel.isBooked = this.checkBookedSeats(seatmodel.RowNumber,seatmodel.colNumber,reservedSeat);
            seatmodel.isSelected = false;
            this.seatmat[i][j] = seatmodel;
            
        }
         console.log(this.seatmat);
    }
  }


   //click handler
   seatClicked (row: number,clm : number)  {  
    this.TicketsBooked=this.Ticketinput.nativeElement.value;
    if(this.bookingSeats.length<this.TicketsBooked){
    if(this.seatmat[row-65][clm].isSelected){
      let selectedSeat = this.getChar(row) + clm.toString();      
      this.bookingSeats.splice(this.bookingSeats.indexOf(selectedSeat),1);
      this.seatmat[row-65][clm].isSelected = false;      
    }else{
      let selectedSeat = this.getChar(row) + clm.toString();
      this.bookingSeats.push(selectedSeat);
      this.seatmat[row-65][clm].isSelected = true;
    }
    //console.log(this.bookingSeats);
    this.displaySelectedSeat = '';
    for(let i=0;i<this.bookingSeats.length;i++){
      
      this.displaySelectedSeat += (this.bookingSeats[i] + ',');
      this.displaySelectedSeat.replace(/,*$/,'');
    } 
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
      //console.log(this.seatsrowIntheatre);
      //console.log(this.seatsclmIntheatre);
      
      this.getReservedSeats();
  }

  // generateSeatNumbers(){
  //   //const TicketsBooked=this.TicketForm.value.numberOfTickets;
  //    this.TicketsBooked=this.Ticketinput.nativeElement.value;
  //   this.seats=Array.from({length: this.TicketsBooked}, () => Math.floor(Math.random() * this.cardDetails.noOfSeatsAlloted));
  //   console.log(this.seats);
  // }

  bookTicket(){
    this.ticketObj.email=this.useremail;
    this.ticketObj.movieName=this.cardDetails.movieName;
    this.ticketObj.theatreName=this.cardDetails.theatreName;
    this.ticketObj.numberOfTickets=Number(this.TicketsBooked);
    this.ticketObj.seatNumber=this.bookingSeats;

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
