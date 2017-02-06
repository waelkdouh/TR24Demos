'use strict';

const express = require('express')
const bodyParser= require('body-parser')

//var Protocol = require('azure-iot-device-amqp').Amqp;
// Uncomment one of these transports and then change it in fromConnectionString to test other transports
// var Protocol = require('azure-iot-device-amqp-ws').AmqpWs;
// var Protocol = require('azure-iot-device-http').Http;
var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

// Access policy's credentials for your IoT Hub
var iothub = require('azure-iothub');
var connectionString = 'HostName=tr24iotdemohub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=ZyfS1MvPI83iF2AIpXWZlvCxpC+wHAKpOsWu7BB2wcg=';
var registry = iothub.Registry.fromConnectionString(connectionString);

var querystring = require('querystring');

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
// TODO: Add the ability to dynamically register a new device 
connectionString = 'HostName=tr24iotdemohub.azure-devices.net;DeviceId=SurfacePro3;SharedAccessKey=USM8Y/cBZ0crxCiw/bcps0veV+zFIUpLy+h18D2wfVU=';

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);


var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Gateway connected');
    client.on('message', function (msg) {
      console.log('Received Message from IoT Hub: ' + msg.data);
      client.complete(msg, printResultFor('completed'));
      // We are done here
      //setTimeout(function(){process.exit(1);}, 3000);
    });

    client.on('error', function (err) {
      console.error(err.message);
    });

    client.on('disconnect', function () {
      clearInterval(sendInterval);
      client.removeAllListeners();
      client.connect(connectCallback);
    });

  
  }
};

// Helper function to print results in the console
function printResultFor(op) {
    return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

client.open(connectCallback);

const app = express()

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: true}))


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// parse application/json
app.use(bodyParser.json())

app.listen(3000)


app.get('/RegisterDevice', (req, res) => {
  // Create a new device
  var device = {
    deviceId: 'Telemetry-device-' + Date.now()
  };

  registry.create(device, function(err, deviceInfo, res) {
      if (err) console.log('error: ' + err.toString());
      if (res) console.log('status: ' + res.statusCode + ' ' + res.statusMessage);
      if (deviceInfo) console.log('device info: ' + JSON.stringify(deviceInfo));
  });
  res.status(200).send(device.deviceId);
})
 
app.get('/GetMessage', function(req, res) {
  console.log('Get message called...');
  res.json({notes: "It works!"})
})
 
app.post('/SendTelemetry', (req, res) => {
  console.log(req.query.deviceid);
  console.log(req.body)
  //Send message to the IoT Hub
  // Extract deviceId from connection string
  var dId = querystring.parse(connectionString, ';', null, null).DeviceId;
  // Creating JSON message to send to Azure IoT Hub
  var data = JSON.stringify({ deviceId: dId, message: req.body });
  var message = new Message(data);
  console.log('Sending message: ' + message.getData());
  // Sending message to IoT Hub
  client.sendEvent(message, printResultFor('send'));
  // res.status(200).send(req.body);
  res.status(200).send('Telemetry Received');
})

