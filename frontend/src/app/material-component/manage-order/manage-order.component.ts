import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]]
    })
  }

  getCategorys() {
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.ngxService.stop()
      this.categorys = response;
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  getProductsByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((response: any) => {
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price * 1);     //if we give quantity 2 then total is this.price*2
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
  }

  // validateProductAdd(){
  //   if(this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quntity'].value <= 0){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }

  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <= 0) {
      return true;
    } else {
      return false;
    }
  }


  validateSubmit() {
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null ||
      this.manageOrderForm.controls['paymentMethod'].value === null ||
      !(this.manageOrderForm.controls['contactNumber'].valid) || !(this.manageOrderForm.controls['email'].valid)) {
      return true;
    }
    else {
      return false;
    }
  }

  add() {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: { id: number; }) => e.id == formData.product.id);
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id: formData.product.id, name: formData.product.name, category: formData.category.name,
        quantity: formData.quantity, price: formData.price, total: formData.total
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success");
    }
    else {
      this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  handleDeleteAction(value: any, element: any) {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  // submitAction() {
  //   this.ngxService.start();
  //   var formData = this.manageOrderForm.value;
  //   var data = {
  //     name: formData.name,
  //     email: formData.email,
  //     contactNumber: formData.contactNumber,
  //     paymentMethod: formData.paymentMethod,
  //     totalAmount: this.totalAmount,
  //     productDetails: JSON.stringify(this.dataSource)
  //   }
  //   this.billService.generateReport(data).subscribe((response: any) => {
  //     console.log(response?.uuid);
  //     this.downloadFile(response?.uuid);
  //     this.manageOrderForm.reset();
  //     this.dataSource = [];
  //     this.totalAmount = 0;
  //   }, (error: any) => {
  //     this.ngxService.stop();
  //     if (error.error?.message) {
  //       this.responseMessage = error.error?.message;
  //     } else {
  //       this.responseMessage = GlobalConstants.genericError;
  //     }
  //     this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  //   })
  // }

  //==========================================
  // submitAction() {
  //   this.ngxService.start();
  //   var formData = this.manageOrderForm.value;
  //   var data = {
  //     name: formData.name,
  //     email: formData.email,
  //     contactNumber: formData.contactNumber,
  //     paymentMethod: formData.paymentMethod,
  //     totalAmount: this.totalAmount,
  //     productDetails: JSON.stringify(this.dataSource)
  //   }
  //   this.billService.generateReport(data).subscribe((response: any) => {
  //     console.log(response?.uuid);
  //     //=================================
  //     var dataGetpdf = {
  //       name: formData.name,
  //       email: formData.email,
  //       uuid: response?.uuid,
  //       contactNumber: formData.contactNumber,
  //       paymentMethod: formData.paymentMethod,
  //       totalAmount: this.totalAmount,
  //       productDetails: JSON.stringify(this.dataSource)
  //     }
  //     this.downloadFile(response?.uuid);



  //     // this.billService.getPdf(dataGetpdf).subscribe((response: any) => {
  //     //   this.ngxService.stop();
  //     //   this.responseMessage = response?.message;   //arive from server side

  //     //   // this.snackbarService.openSnackBar('PDF sent successfully through email!', "success");
  //     //   this.snackbarService.openSnackBar(this.responseMessage, "");

  //     // }, (error) => {
  //     //   this.ngxService.stop();
  //     //   // this.snackbarService.openSnackBar('Failed to send PDF through email', "error");
  //     //   // console.error(error);

  //     //   if (error.error?.message) {
  //     //     this.responseMessage = error.error.message;
  //     //   }
  //     //   else {
  //     //     this.responseMessage = GlobalConstants.genericError;
  //     //   }
  //     //   this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  //     // });

  //     //========================

  //     this.manageOrderForm.reset();
  //     this.dataSource = [];
  //     this.totalAmount = 0;
  //   }, (error: any) => {
  //     this.ngxService.stop();
  //     if (error.error?.message) {
  //       this.responseMessage = error.error?.message;
  //     } else {
  //       this.responseMessage = GlobalConstants.genericError;
  //     }
  //     this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  //   })
  // }


  submitAction() {
    this.ngxService.start();
    var formData = this.manageOrderForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response: any) => {
      console.log(response?.uuid);
      // this.downloadFile(response?.uuid);

      //===============================
      var dataGetpdf = {
              name: formData.name,
              email: formData.email,
              uuid: response?.uuid,
              contactNumber: formData.contactNumber,
              paymentMethod: formData.paymentMethod,
              totalAmount: this.totalAmount,
              productDetails: JSON.stringify(this.dataSource)
            }
      this.billService.getPdf(dataGetpdf).subscribe((response:any) => {
          this.ngxService.stop();
          this.responseMessage = response?.message;   //arive from server side

          // this.snackbarService.openSnackBar('PDF sent successfully through email!', "success");
          this.snackbarService.openSnackBar(this.responseMessage,"");

        },(error:any) => {
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

        //==========================================
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
      // this.ngxService.stop();
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  // downloadFile(fileName: any) {
  //   var data = {
  //     uuid: fileName
  //   };
  //   console.log(data);
  //   this.billService.getPdf(data).subscribe((response: any) => {
  //       // Handle successful response
  //       // saveAs(response, fileName + '.pdf');
  //       this.ngxService.stop();
  //     },
  //     (error: HttpErrorResponse) => {
  //       // Handle error response
  //       console.error('An error occurred:', error.error);
  //       console.log('Error status:', error.status);
  //       console.log('Error message:', error.message);
  //       this.ngxService.stop();
  //     });
  // }

  //======================================

  // downloadFile(uuid: string) {
  //   this.billService.getPdf(uuid).subscribe(
  //     (response: Blob) => {
  //       // Handle successful response
  //       const blob = new Blob([response], { type: 'application/pdf' });
  //       saveAs(blob, `${uuid}.pdf`);
  //       this.ngxService.stop();
  //     },
  //     (error: any) => {
  //       // Handle error response
  //       console.error('An error occurred:', error);
  //       this.ngxService.stop();
  //     });
  // }
}
