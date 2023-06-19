import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar:MatSnackBar) { }     //snackbar is object

  openSnackBar(message:string, action:string){
    if(action === 'error'){
      this.snackbar.open(message,'',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['black-snackbar']    //this is taken from style.scss file
      });
    }
    else{
      this.snackbar.open(message,'',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['green-snackbar']  //this is taken from style.scss file
      });
    }
  }
}
