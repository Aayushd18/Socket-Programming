import dgram from 'dgram';
import { argv } from 'process';
  
// Printing process.argv property value
var args = argv;


const config = {
  "serverHost": "127.0.0.1",
  "port": 21000,
  "timeout": 15000,
}

const client = dgram.createSocket('udp4');
let packetsReceived = 0;
const packetsToSend = args[2];
let IntervalId;
var i=1;

client.on("message", (msg, detail) => {
  let receivedData = JSON.parse(msg.toString());

  // calculating the round trip time;
  let sentData = JSON.parse(receivedData.received.message.toString())
  let sentTime = new Date(sentData.timestamp).getTime()
  let receivedTime = new Date().getTime();
  let roundTripTime = (receivedTime - sentTime);
  console.log("Data received from server: ");
  console.log(receivedData);
  console.log(`Bytes received ${msg.length} from ${detail.address}: ${detail.port}`);
  console.log("Round Trip Time: " + roundTripTime + " ms");

  packetsReceived += 1;
}); 

IntervalId = setInterval(() => {
  if(i >= packetsToSend) clearInterval(IntervalId);
  // i++;
  let packetData = {
    message: `Packet No ${i}`,
    timestamp: new Date(),
  };
  
  let packet = Buffer.from(JSON.stringify(packetData));
  
  client.send(packet, config.port, config.serverHost, (error) => {
    if(error) {
      console.log(error);
      client.close;
    } else {
      console.log(`Packet No. ${i-1} sent!!`);
    }
  });
  i +=1;
}, 40);


setTimeout(() => {
  i -=1;
  // clearInterval(IntervalId);
  console.log(`Packets Sent: ${i} Packets Dropped: ${i - packetsReceived} Loss%: ${((i - packetsReceived)/i)*100}%`);
  client.close();

}, config.timeout);
;