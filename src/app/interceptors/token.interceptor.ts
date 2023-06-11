import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private user: UserService,
    private toastrService: ToastrService,
    private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //const myToken=this.user.getToken();
    if (localStorage.getItem('token') != null) {
      const myToken=localStorage.getItem('token');
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }
      });
      return next.handle(request).pipe(tap({
        next: () => { },
        error: (err) => {
          console.log(err);
          if (err.status == 0 || err.status == 401) {
            localStorage.removeItem('token');
            this.toastrService.success("Login again,Session expired", err.message, {
              timeOut: 3000,
            });
            this.router.navigate(['login']);
          }
        },
        finalize: () => { }
      }));
    }
    else {
      return next.handle(request.clone());
    }

  }
}
