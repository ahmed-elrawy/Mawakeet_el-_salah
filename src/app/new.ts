import { Component, OnInit } from '@angular/core';
import { IpServiceService } from './ip-service.service';  
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {  
  constructor(private ip:IpServiceService,private datePipe: DatePipe){}  

  remaning_total_time :string | undefined

  date: any
  curr_date!: any
  curr_time!: any
  city!:string 
  data?: any

  buff_Sala :string | undefined



  result:string[] | undefined
ngOnInit()  
  {  
    
    this.date = new Date();
    this.getData();  
    this.curr_date = this.datePipe.transform(this.date,"yyyy-MM-dd");

  }  
  getData()  
  {  
    this.ip.getRegion().subscribe((res:any)=>{  
      this.city = res.city
      console.log(this.curr_date)
      this.ip.getMawkeet(this.city, this.curr_date).subscribe((res:any)=>{  
        this.data = res.results.datetime[0].times
        this.getNearst()
     });
    });  
    
  }  

  getNearst(){
    this.curr_time = this.datePipe.transform(this.date,"HH.mm");
    this.curr_time = +this.curr_time
    let buff_time = 100;
    let arr: {[key: string]: number} ={ 
      Fajr: +this.data.Fajr.replace(":","."), 
      Dhuhr: +this.data.Dhuhr.replace(":","."), 
      Asr: +this.data.Asr.replace(":","."),
      Maghrib: +this.data.Maghrib.replace(":","."),
      Isha: +this.data.Isha.replace(":",".")
    }
    for (let key in arr) {
           //  بتاكد ان وقت الصلاة اكبر من الوقت الحالي اذا هو عليه الدور
           // المشكاة ان الفجر لما يكون عليه الدور والوقت الحالي قبل الساع 24 هيكون اصغر من الوق الحالي 
     if (arr[key] > this.curr_time){

        if(arr[key]-this.curr_time<buff_time){

          buff_time =arr[key]-this.curr_time
          this.buff_Sala = key

        }

       
      } else {
            if (this.curr_time > arr.Isha && arr[key]-this.curr_time +24 <buff_time ) {

              if(arr[key]-this.curr_time + 24 <buff_time){

                buff_time =arr[key]-this.curr_time
                this.buff_Sala = key
      
              }

             
              
            }
          

      }
    
     
       //this.getRemainingTime(arr)

  
    }

    this.getRemainingTime(arr)


  }


 
getRemainingTime(arr: { [x: string]: number; }){
  let remaining_h = 0
  let remaining_m = 0
  let curr_time_hour: number
  let curr_time_min: number
  let next_salah_hour: number
  let next_salah_min: number
  if (this.curr_time <(arr[this.buff_Sala!]+12)){ 
    next_salah_hour = Math.floor(arr[this.buff_Sala!])
    next_salah_min = Math.floor(+(arr[this.buff_Sala!] - Math.floor(arr[this.buff_Sala!])).toFixed(2)*100)
    
     

    curr_time_hour = Math.floor(this.curr_time)
    curr_time_min =  Math.floor(+(this.curr_time - Math.floor(this.curr_time)).toFixed(2)*100)
    remaining_h = ((next_salah_hour-curr_time_hour)-1)*60
    remaining_m = (60 - curr_time_min) + next_salah_min

    if((remaining_h+remaining_m) >= 60 ){
      this.remaning_total_time =`${Math.floor((remaining_h+remaining_m)/60)}h:${(remaining_h+remaining_m)%60}m `
      console.log(this.remaning_total_time)
    }else{
      this.remaning_total_time = `${(remaining_h+remaining_m)}m`
      console.log(this.remaning_total_time)

    }
  }else {

    next_salah_hour = Math.floor(arr[this.buff_Sala!])
    next_salah_min = Math.floor(+(arr[this.buff_Sala!] - Math.floor(arr[this.buff_Sala!])).toFixed(2)*100)
    
     

    // curr_time_hour =24- Math.floor(this.curr_time) + Math.floor(arr[this.buff_Sala!])
    curr_time_hour = Math.floor(this.curr_time)

    console.log(curr_time_hour)
    curr_time_min =  Math.floor(+(this.curr_time - Math.floor(this.curr_time)).toFixed(2)*100)
    console.log(curr_time_min)

    remaining_h = 24- Math.floor(this.curr_time) + Math.floor(arr[this.buff_Sala!]) * 60
    console.log(remaining_h)

    remaining_m = (60 - curr_time_min) + next_salah_min
    console.log(remaining_h +remaining_m)


    if((remaining_h+remaining_m) >= 60 ){
      this.remaning_total_time =`${Math.floor((remaining_h+remaining_m)/60)}h:${(remaining_h+remaining_m)%60}m `
      console.log(this.remaning_total_time)
    }else{
      this.remaning_total_time = `${(remaining_h+remaining_m)}m`
      console.log(this.remaning_total_time)

    }
   
  
  }
}

 
}