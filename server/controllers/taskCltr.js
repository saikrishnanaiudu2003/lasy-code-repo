const mongoose = require('mongoose');
const _ = require('lodash');
const Task = require('../models/Task');
const taskCltr={}
taskCltr.create = async (req, res, next) => {
    const { userId } = req.params; 
    console.log('Received userId:', userId); 

    try {
        const body = _.pick(req.body, ['title', 'description', 'status', 'dueDate']);
        const validStatuses = ['Pending', 'In Progress', 'Completed'];

        if (!validStatuses.includes(body.status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const task = new Task({
            ...body,
            userId: new mongoose.Types.ObjectId(userId) 
        });

        console.log(task);
        const savedTask = await task.save();
        console.log(savedTask);
        res.status(201).json(savedTask);

    } catch (e) {
        res.status(400).json({ message: 'Error creating task', error: e.message });
    }
};
taskCltr.getAllTasks=async(req,res)=>{
    const { userId } = req.params; 

    try {
        
        const tasks = await Task.find({ userId:new  mongoose.Types.ObjectId(userId) });

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        res.status(200).json(tasks);

    } catch (e) {
        res.status(500).json({ message: 'Error retrieving tasks', error: e.message });
    }
}
taskCltr.update=async(req,res)=>{
    const { userId, taskId } = req.params;

    try {
       
       
        const userObjectId = new mongoose.Types.ObjectId(userId);

       
        const task = await Task.findOne({ _id: taskId, userId: userObjectId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or does not belong to this user' });
        }

        
        const updatedTaskData = req.body;
        const updatedTask = await Task.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

        res.status(200).json(updatedTask);

    } catch (e) {
        res.status(500).json({ message: 'Error updating task', error: e.message });
    }
}
taskCltr.getTaskById=async(req,res)=>{
    const {taskId}=req.params
    try{
    const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);

    } catch (e) {
        res.status(500).json({ message: 'Error finding task', error: e.message });
    }


    

}
taskCltr.sortByStatus=async(req,res)=>{
    const { userId } = req.params;
    const { status } = req.body;

    console.log('Received userId:', userId);
    console.log('Received status:', status);

    try {
        
        const validStatuses = ['Pending', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

       
        const tasks = await Task.find({ userId: new mongoose.Types.ObjectId(userId), status });
        console.log('Tasks found:', tasks);

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this status' });
        }

        res.status(200).json(tasks);
    } catch (e) {
        console.error('Error retrieving tasks:', e.message);
        res.status(500).json({ message: 'Error retrieving tasks', error: e.message });
    }

}
taskCltr.sortByDueDate = async (req, res) => {
    const { userId } = req.params;
    const { order } = req.body; 

    console.log('Received userId:', userId);
    console.log('Received order:', order);

    try {
        
        const validOrders = ['asc', 'desc'];
        if (!validOrders.includes(order)) {
            return res.status(400).json({ message: 'Invalid order' });
        }

       
        const sortOrder = order === 'asc' ? 1 : -1;
        const tasks = await Task.find({ userId: new mongoose.Types.ObjectId(userId) })
            .sort({ dueDate: sortOrder });

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        res.status(200).json(tasks);
    } catch (e) {
        console.error('Error retrieving tasks:', e.message);
        res.status(500).json({ message: 'Error retrieving tasks', error: e.message });
    }
};
taskCltr.deleteTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        
        const deleteTask = await Task.findById(taskId);
        if (!deleteTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.deleteOne({ _id: taskId });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: 'Error deleting task', error: e.message });
    }
};

module.exports=taskCltr
