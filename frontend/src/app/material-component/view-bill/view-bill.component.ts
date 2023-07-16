import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource: any;
  responseMessage: any;
  authService: any;

  constructor(
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    // private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(): void {
    this.billService.getBills().subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  //-------------------new-------------------
  // tableData(): void {
  //   this.billService.getBills().subscribe(
  //     (response: any) => {
  //       this.ngxService.stop();
  //       const userEmail = this.authService.getCurrentUserEmail();
  //       if (userEmail && this.authService.isAuthenticated()) {
  //         if (userEmail === 'admin@gmail.com') {
  //           // Admin user, show all bills
  //           this.dataSource = new MatTableDataSource(response);
  //         } else {
  //           // Non-admin user, filter bills based on email ID
  //           const filteredBills = response.filter((bill: any) => bill.email === userEmail);
  //           this.dataSource = new MatTableDataSource(filteredBills);
  //         }
  //       } else {
  //         this.dataSource = new MatTableDataSource([]);
  //       }
  //     },
  //     (error: any) => {
  //       if (error.error?.message) {
  //         this.responseMessage = error.error?.message;
  //       } else {
  //         this.responseMessage = GlobalConstants.genericError;
  //       }
  //       this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  //     }
  //   );
  // }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values
    };
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  downloadReportAction(values: any): void {
    this.ngxService.start();
    var data = {
      name:values.name,
      email:values.email,
      uuid:values.uuid,
      contactNumber:values.contactNumber,
      paymentMethod:values.paymentMethod,
      totalAmount:values.total,
      productDetails:values.productDetails
    }
    this.billService.getPdf(data).subscribe((response:any) => {
        this.ngxService.stop();
        this.responseMessage = response?.message;   //arive from server side

        // this.snackbarService.openSnackBar('PDF sent successfully through email!', "success");
        this.snackbarService.openSnackBar(this.responseMessage,"");

      },(error) => {
        this.ngxService.stop();
        // this.snackbarService.openSnackBar('Failed to send PDF through email', "error");
        // console.error(error);

        if(error.error?.message){
          this.responseMessage = error.error.message;
        }
        else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
      });
  }

  handleDeleteAction(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete '+values.name+' bill'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id:any){
    this,this.billService.delete(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}

