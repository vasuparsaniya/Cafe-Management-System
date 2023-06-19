import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  //signup API call
  signup(data:any){
    return this.httpClient.post(this.url+"/user/signup",data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  //forgot password
  forgotPassword(data:any){
    return this.httpClient.post(this.url+"/user/forgotPassword/",data,{
      headers: new HttpHeaders().set('content-Type',"application/json")
    })
  }

  //login
  login(data:any){
    return this.httpClient.post(this.url+"/user/login/",data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  //checkToken
  checkToken(){
    return this.httpClient.get(this.url+"/user/checkToken");
  }

  changePassword(data:any):Observable<any>{
    return this.httpClient.post(this.url + "/user/changePassword", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  getUsers(){
    return this.httpClient.get(this.url+"/user/get/");
  }

  update(data:any){
    return this.httpClient.patch(this.url+"/user/update",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }
}
