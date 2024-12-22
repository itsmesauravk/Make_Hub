const app = require('./app');

const ACTIVE_CONNECTIONS = [];


// const sendLikeNotification = (recipe) => {
//     ACTIVE_CONNECTIONS.forEach((socket) => {
//         if (socket.user?.id === recipe.userId)
//         {
//             socket.emit('like', recipe);
//         }
//     });
// }

const port = process.env.PORT || 8000;

const http = require('http');

const mainServer = http.createServer(app);

const database = require('./database/index')
database();

// const startServer = async () => {
//     try {
        
//         const WSapp = require('socket.io')(mainServer,{cors:{
//             origin: ['https://piehost.com'],
//             // methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS', ],
//             credentials: true,
//         }})
//         WSapp.on('connection',(socket)=>{
//             // after authentication
//             socket.user = {
//                 id: socket.handshake.query.id,
//                 username: socket.handshake.query.username
//             }
//             ACTIVE_CONNECTIONS.push(socket);
//         })

//         mainServer.listen(port, () => {
//             console.log(`Server is running on port ${port}`);
//         });
        
//     } catch (error) {
//         console.log(error)
//     }
// }

// startServer()

app.listen(port, ()=>{
    console.log("Server Is Running on port ",port)
})



