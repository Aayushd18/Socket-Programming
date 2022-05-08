import dgram from 'dgram';

const config = {
  "serverHost": "127.0.0.1",
  "port": 21000,
  "timeout": 10000,
}

const server = dgram.createSocket('udp4');

server.on('error', (error) => {
  console.log(`server error ${error}`);
  server.close();
});

server.on('message', (msg, detail) => {
    console.log(`Received message: ${msg.toString()} from ${detail.address}: ${detail.port} bytes ${msg.length}`);
    let timestamp = new Date();
    let response = {
      description: "UDP response",
      serverPort: config.port,
      timestamp: timestamp,
      received: {
        message: msg.toString(),
        from: detail.address,
        fromPort: detail.port,
      }
    }

    let packet = Buffer.from(JSON.stringify(response));

    
    server.send(packet, detail.port, detail.address, (error, bytes) => {
      if(error) {
        console.log(`server error: ${error}`);
        server.close();
      } else {
        console.log(`packet sent!`);
      }  
    });
  
  
});

server.on("listening", () => {
  const address = server.address();
  const port = address.port;
  const family = address.family;
  const ipAdd = address.address;

  console.log(`Server is listening at: ${port}`);
});

server.on("close", () => {
  console.log("Server closed");
});

server.bind(config.port);
