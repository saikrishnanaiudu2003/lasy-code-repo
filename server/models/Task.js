const mongoose=require('mongoose')
const taskSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    status:{
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'], 
        default: 'Pending'
    },
    dueDate:{
        type:Date,
        required:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
},{timestamps:true})
const Task=mongoose.model('Task',taskSchema)
module.exports=Task