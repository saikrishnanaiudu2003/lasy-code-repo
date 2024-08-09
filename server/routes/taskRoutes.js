const express = require('express');
const { create, getAllTasks,update, getTaskById, deleteTask, sortByStatus, sortByDueDate } = require('../controllers/taskCltr'); 
const taskRouter = express.Router();

taskRouter.post('/create/:userId', create); 
taskRouter.get('/:userId',getAllTasks)
taskRouter.put('/:taskId/:userId',update)
taskRouter.get('/getBy/:taskId',getTaskById)
taskRouter.post('/sortByStatus/:userId',sortByStatus)
taskRouter.post('/sortByDate/:userId',sortByDueDate)
taskRouter.delete('/:taskId',deleteTask)
module.exports = taskRouter;
