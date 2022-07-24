const Config = require('./config/config');
const Server = require('./services/server');

Server.listen(Config.PORT, () =>
    console.log(`Listening on port ${Config.PORT}...`));
Server.on("error", (error) => console.log("Server Error\n\t", error));
console.log(`Worker ${process.pid} started`)