const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const { verifyAuthToken } = require('./controllers/verifyAuthToken');
const categoryRoutes = require('./routes/categoryRoute');
const productRoutes = require('./routes/productRoute');
const bonRoutes = require('./routes/bonRoute');
const requestRoutes = require('./routes/RequestRoute');
const messageRoutes = require('./routes/messageRoute');

app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());

app.use('/api', authRoutes);
app.use('/api/users', verifyAuthToken, userRoutes);
app.use('/api/categories', verifyAuthToken, categoryRoutes);
app.use('/api/products', verifyAuthToken, productRoutes);
app.use('/api/bons', verifyAuthToken, bonRoutes);
app.use('/api/requests', verifyAuthToken, requestRoutes);
app.use('/api/chat', verifyAuthToken, messageRoutes);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (messageData) => {
        io.emit('receiveMessage', messageData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

mongoose.connect('mongodb://localhost:27017/magasin-tt')
    .then(() => {
        server.listen(process.env.PORT || 3001, () => {
            console.log(`Server is running on port ${process.env.PORT || 3001}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });


// mongoose.connect(process.env.MONGO_URI)
//     .then(() => {
//         server.listen(process.env.PORT || 3001, () => {
//             console.log(`Server is running on port ${process.env.PORT || 3001}`);
//         });
//     })
//     .catch((error) => {
//         console.error('Database connection error:', error);
//     });
