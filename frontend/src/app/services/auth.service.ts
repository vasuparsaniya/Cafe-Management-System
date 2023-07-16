import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  public isAuthenticated(): boolean {

    const token = localStorage.getItem('token');

    if(!token){
      this.router.navigate(['/']);  //navigate to home page
      return false;
    }
    else{
      return true;
    }
}
}


// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import jwt_decode from 'jwt-decode';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   constructor(private router: Router) {}

//   public isAuthenticated(): boolean {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       this.router.navigate(['/']); // navigate to home page
//       return false;
//     } else {
//       return true;
//     }
//   }

//   public getCurrentUserEmail(): string {
//     const token = localStorage.getItem('token');

//     if (token) {
//       const decodedToken: any = jwt_decode(token);
//       const userEmail = decodedToken.email;
//       return userEmail;
//     } else {
//       return '';
//     }
//   }

// }
