import { Component } from '@angular/core';
// import {example} from './simple_sample_device';

import { Subscription } from 'rxjs/Subscription';
import { IOTGatewayService } from './IOTGatewayService';

@Component({
  selector: 'my-app',
   templateUrl: 'app/app.component.html',
   providers:[IOTGatewayService]
})
export class AppComponent  { 
  deviceID:any;
  errorMessage: string;

  constructor(private _IOTGatewayService: IOTGatewayService) {
    this.deviceID = localStorage.getItem("deviceID");
  }

 deviceAlreadyRegistered() :boolean {
    return this.deviceID != null;
  }

  registerDevice() {
      this._IOTGatewayService.registerDevice().subscribe(
            deviceID => {
              this.deviceID = deviceID;
              localStorage.setItem("deviceID",deviceID);
            },
            error => this.errorMessage = <any>error);
  }

  deRegisterDevice() {
    localStorage.removeItem("deviceID");
    this.deviceID = null;
  }
  
  sendTelemetry() {
    // setup your telemetry here...
    let telemetryInfo = {
      deviecID:this.deviceID,
      Latitude:26,
      Longitude:26
    }
    this._IOTGatewayService.sendTelemetry(telemetryInfo,this.deviceID).subscribe();
  }

}


