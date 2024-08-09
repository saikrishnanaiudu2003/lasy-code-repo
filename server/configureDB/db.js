const mongoose = require('mongoose')
const configureDB = async (req, res) => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/task-management-app')
        console.log('db connected')
    } catch (e) {
        console.log('error connecting db')
    }
}
module.exports = configureDB