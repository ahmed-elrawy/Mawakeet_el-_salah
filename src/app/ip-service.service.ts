import { Injectable } from '@angular/core';  
import { HttpClient  } from '@angular/common/http';  
  
@Injectable({  
  providedIn: 'root'  
})  

export class IpServiceService  {  

  constructor(private http:HttpClient) { 

  } 
  


  public getRegion()  
  {  
    return this.http.get("http://ipinfo.io?token=cfba387b1a77d0"); 
    
  }  

  public getMawkeet(city: string, date: string)  
  {  
    return this.http.get(`https://api.pray.zone/v2/times/day.json?city=${city}&date=${date}`); 
    
  } 
}  