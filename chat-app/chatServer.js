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
    let request = JSON.parse(msg.toString())
    console.log(`Received message: ${msg.toString()} from ${detail.address}: ${detail.port} bytes ${msg.length}`);
    let response = {
      description: "Message Arrived",
      serverPort: config.port,
      received: {
        message: msg.toString(),
      }
    }

    let packet = Buffer.from(JSON.stringify(response));

    
    server.send(packet, request.destPort, request.destAdd, (error, bytes) => {
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
