import dgram from 'dgram';

const config = {
  "serverHost": "127.0.0.1",
  "port": 21000,
  "timeout": 15000,
}

const client = dgram.createSocket('udp4');

let packetsReceived = 0;
let IntervalId;
var i=1;

let avgDelays = [];
let avgDelaysPerSecond = [];


client.on("message", (msg, detail) => {
      let receivedData = JSON.parse(msg.toString());
    
      // calculating the round trip time;
      let sentData = JSON.parse(receivedData.received.message.toString())
      let sentTime = new Date(sentData.timestamp).getTime()
      let receivedTime = new Date().getTime();
      let averageDelay = (receivedTime - sentTime)/2;
      avgDelays.push(averageDelay);
      console.log("Data received from server: ");
      // console.log(receivedData);
      console.log(`Bytes received ${msg.length} from ${detail.address}: ${detail.port}`);
      console.log("Average Delay: " + averageDelay + " ms");
    
      packetsReceived += 1;
    });

  IntervalId = setInterval(() => {
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
  }, 100);

  setTimeout(() => {
    clearInterval(IntervalId);
  
  }, 12000);

setTimeout(() => {
  i -=1;
  // console.log(avgDelays);
  for(let j = 0; j < avgDelays.length; j +=10) {
    let delay = (avgDelays[j] + avgDelays[j+1] + avgDelays[j+2] + avgDelays[j+3] + avgDelays[j+4] + avgDelays[j+5] + avgDelays[j+6] + avgDelays[j+7] + avgDelays[j+8] + avgDelays[j+9])/10;
    if (delay === NaN) { avgDelaysPerSecond.push(1); }
    else { avgDelaysPerSecond.push(delay); }
  }
  console.log("Average delays per second", avgDelaysPerSecond);
  console.log(`Packets Sent: ${i} Packets Dropped: ${i - packetsReceived} Loss%: ${((i - packetsReceived)/i)*100}%`);
  client.close();

}, config.timeout);

export default avgDelaysPerSecond;