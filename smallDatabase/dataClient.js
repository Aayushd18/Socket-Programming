import dgram from 'dgram';
import { argv } from 'process';
  
// Printing process.argv property value
var args = argv;

const config = {
  "serverHost": "127.0.0.1",
  "port": 21000,
  "timeout": 15000,
  "myport": 4000,
}

const client = dgram.createSocket('udp4');
client.bind(config.myport);


// ehen message is received back from server
client.on("message", (msg, detail) => {
  let receivedData = JSON.parse(msg.toString());
  // let reply = JSON.parse(receivedData.received.message.toString());
  // let replyMsg = reply.message;


  // console.log(`Message received from ${reply.sourceAdd}: ${reply.sourcePort}`);
  console.log(receivedData.data);
  
});


  let packetData = {
    type: args[2],
    message: args[3],
    data: args[4],// table name u want to get details from the database
  };
  let packet = Buffer.from(JSON.stringify(packetData));

  client.send(packet, config.port, config.serverHost, (error) => {
    if(error) {
      console.log(error);
      client.close;
    } else {
      console.log(`Packet sent!!`);
    }
  });

setTimeout(() => {
  client.close();

}, config.timeout);
