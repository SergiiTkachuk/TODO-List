const fs = require('fs');

class TaskManager {
   
   constructor() { 
      this.tasks = this.loadTasks();
   }

   loadTasks() {

      const data = fs.readFileSync('tasks.json');
      return JSON.parse(data);
      
   }

   saveTasks() {
      fs.writeFileSync('tasks.json', JSON.stringify(this.tasks));
   }

   addTask(title, description, deadline) {      
      
      const task = {
         
         id: Date.now().toString(),
         title,
         description,
         deadline,
         completed: false,
      
      };
      
      this.tasks.push(task);
      this.saveTasks();

      console.log('Task added successfully.');
   }

   editTask(taskId, title, description, deadline) {

      const task = this.findTaskById(taskId);
      
      if (task) {
         
         task.title = title || task.title;
         task.description = description || task.description;
         task.deadline = deadline || task.deadline;
         
         this.saveTasks();
         
         console.log('Task edited successfully.');
      } else {
         console.log('Task not found.');
      }
   }

   findTaskById(taskId) {
      return this.tasks.find((task) => task.id === taskId);
   }
}

module.exports = TaskManager;