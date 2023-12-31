const io = require("..")
const socketIO = require("socket.io")

const checkUniqueness = async (value, model, column) => {
    try {
        const exist = await model.findone({ [column]: value })
        if (exist) {
            return true
        }
        else {
            return false
        }
    } catch (error) {
        return true
    }
}

const initWebSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "*",

        }
    });
    io.on('connection', (socket) => {
        console.log('Client connected');

        // Handle incoming messages
        // socket.on('message', () => {
        //   console.log(`Received: ${message}`);

        //   // Broadcast the message to all clients
        //   io.emit('message', "message");
        // });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
    return io
}

module.exports = { checkUniqueness, initWebSocket }