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
var IOTGatewayService_1 = require('./IOTGatewayService');
var AppComponent = (function () {
    function AppComponent(_IOTGatewayService) {
        this._IOTGatewayService = _IOTGatewayService;
        this.deviceID = localStorage.getItem("deviceID");
    }
    AppComponent.prototype.deviceAlreadyRegistered = function () {
        return this.deviceID != null;
    };
    AppComponent.prototype.registerDevice = function () {
        var _this = this;
        this._IOTGatewayService.registerDevice().subscribe(function (deviceID) {
            _this.deviceID = deviceID;
            localStorage.setItem("deviceID", deviceID);
        }, function (error) { return _this.errorMessage = error; });
    };
    AppComponent.prototype.deRegisterDevice = function () {
        localStorage.removeItem("deviceID");
        this.deviceID = null;
    };
    AppComponent.prototype.sendTelemetry = function () {
        // setup your telemetry here...
        var telemetryInfo = {
            deviecID: this.deviceID,
            Latitude: 26,
            Longitude: 26
        };
        this._IOTGatewayService.sendTelemetry(telemetryInfo, this.deviceID).subscribe();
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app.component.html',
            providers: [IOTGatewayService_1.IOTGatewayService]
        }), 
        __metadata('design:paramtypes', [IOTGatewayService_1.IOTGatewayService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map