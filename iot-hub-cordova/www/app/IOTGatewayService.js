"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
// Import RxJs required methods
require('rxjs/add/operator/map');
require('rxjs/add/operator/do');
require('rxjs/add/operator/catch');
var IOTGatewayService = (function () {
    function IOTGatewayService(_http) {
        this._http = _http;
        this._IOTGateWayServiceUrl = 'http://192.168.1.102:3000';
    }
    IOTGatewayService.prototype.registerDevice = function () {
        var url = this._IOTGateWayServiceUrl + "/RegisterDevice";
        return this._http.get(url)
            .map(function (response) { return response.text(); })
            .do(function (data) { return console.log('Message from Gateway: Your device id is: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    IOTGatewayService.prototype.sendTelemetry = function (body, deviceID) {
        var url = this._IOTGateWayServiceUrl + "/SendTelemetry?deviceid=" + deviceID;
        var bodyString = JSON.stringify(body); // Stringify payload
        // let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        // let options = new RequestOptions({ headers: headers }); // Create a request option
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(url, bodyString, { headers: headers }) // ...using post request
            .map(function (res) { return res.text(); }) // ...and calling .json() on the response to return data
            .do(function (data) { return console.log('Message from Gateway: ' + JSON.stringify(data)); })
            .catch(function (error) { return Observable_1.Observable.throw(error.json().error || 'Server error'); }); //...errors if any
    };
    IOTGatewayService.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    IOTGatewayService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], IOTGatewayService);
    return IOTGatewayService;
}());
exports.IOTGatewayService = IOTGatewayService;
//# sourceMappingURL=IOTGatewayService.js.map