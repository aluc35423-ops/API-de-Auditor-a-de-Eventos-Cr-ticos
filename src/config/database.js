const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('❤️ Successful conection to MongoDB ❤️')
    } catch (error) {
        console.error('🔥 Error conection MongoDB 🔥', error.message)
        process.exit(1);
    }
}

module.exports = connectDB;