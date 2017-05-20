import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  errorMsg: string;

  constructor(private authService: AuthService, private router: Router) {


    // this.af.auth.subscribe(auth => {
    //   if(auth) {
    //     this.router.navigateByUrl('/members');
    //   }
    // });
  }

  ngOnInit() {
  }

  login() {
    this.authService.loginWithEmailPassword(this.email, this.password)
      .catch(error => {
        this.errorMsg = error.message;
      });
  }
}
