import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class IOTGatewayService {

    private _IOTGateWayServiceUrl = 'http://localhost:3000';

    constructor(private _http: Http) {
    }

    registerDevice(): Observable<string> {
        let url = `${this._IOTGateWayServiceUrl}/RegisterDevice`;
         return this._http.get(url)
            // .map((response: Response) => <string>response.json())
            .map((response: Response) => <string>response.text())
            .do(data => console.log('Message from Gateway: Your device id is: ' +  JSON.stringify(data)))
            //...errors if any
            .catch(this.handleError);
    }

    sendTelemetry(body: Object,deviceID): Observable<string> {
            let url = `${this._IOTGateWayServiceUrl}/SendTelemetry?deviceid=${deviceID}`;
            let bodyString = JSON.stringify(body); // Stringify payload
            // let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
            // let options = new RequestOptions({ headers: headers }); // Create a request option
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            
            return this._http.post(url, bodyString, {headers: headers}) // ...using post request
                         .map((res:Response) =>  <string>res.text()) // ...and calling .json() on the response to return data
                         .do(data => console.log('Message from Gateway: ' +  JSON.stringify(data)))
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
        }


      

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
