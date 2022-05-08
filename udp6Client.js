//var HOST = 'ip6-localhost';
var HOST = '::1';

var REMOTE_PORT = 21000;
var LOCAL_PORT  = 4001;

import { createSocket } from 'dgram';

var message = Buffer.from('Hello');

var client = createSocket('udp6');
client.bind(LOCAL_PORT);
client.on("message", (msg, detail) => {
  let receivedData = JSON.parse(msg.toString());

  console.log("Data received from server: ");
  console.log(receivedData);
  console.log(`Bytes received ${msg.length} from ${detail.address}: ${detail.port}`);
}); 

client.send(message, 0, message.length, REMOTE_PORT, HOST,
  function(error, bytes) { 
    if (error) throw error;
    client.close();
    console.log('Message sent to host: "' + HOST + '", port: ' + REMOTE_PORT);
    
  } 
);