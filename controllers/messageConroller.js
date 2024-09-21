const Message = require('../models/messageSchema');

const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;
        const newMessage = new Message({ sender, receiver, message });
        await newMessage.save();
        res.status(200).json( newMessage );
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
}


const getMessages = async (req, res) => {
    try {
        const { sender, receiver } = req.params;
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
}

module.exports = {
    sendMessage,
    getMessages
}