import dgram from 'dgram';

const config = {
  "serverHost": "127.0.0.1",
  "port": 21000,
  "timeout": 10000,
}

let database = {
  mobiles: ['iphone 13 pro', 'Samsumg S21', 'Oneplus 9 pro'],
  devices: ['headphone', 'mobiles', 'laptops'],
}

const server = dgram.createSocket('udp4');

server.on('error', (error) => {
  console.log(`server error ${error}`);
  server.close();
});

server.on('message', (msg, detail) => {
    let request = JSON.parse(msg.toString())
    console.log(`Received message: ${msg.toString()} from ${detail.address}: ${detail.port} bytes ${msg.length}`);
    let data;
    switch(request.type) {
      case "get":
        if(database.hasOwnProperty(request.message)) {
          data = database[request.message];
        } else {
          data = 'no data available';
        }
        break;
      case "delete":
        if(database.hasOwnProperty(request.message)) {
          const remove_item = function(arr, value) {
            var b = '';
            for (b in arr) {
             if (arr[b] === value) {
              arr.splice(b, 1);
              break;
             }
            }
            return arr;
          };
           
          remove_item(database[request.message],request.data);
          data = "Removed item";
        } else {
          data = "No such table exist";
        }
        break;
      case "put":
        if(database.hasOwnProperty(request.message)) {
            database[request.message].push(request.data)
          data = 'item added';
        } else {
          data = 'no data available';
        }
        break;
    }
    let response = {
      description: "Server Response",
      serverPort: config.port,
      data: data,
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
