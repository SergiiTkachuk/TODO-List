const { program } = require('commander');
const TaskManager = require('./TaskManager.js')

const taskManager = new TaskManager();

program
  .command('list')
  .description('Show all tasks')
  .action(() => {
    taskManager.listTasks();
  });

program
  .command('add <title> [description] [deadline]')
  .description('Add a new task')
  .action((title, description, deadline) => {
    taskManager.addTask(title, description, deadline);
  });

program
  .command('edit <taskId> [title] [description] [deadline]')
  .description('Edit a task')
  .action((taskId, title, description, deadline) => {
    taskManager.editTask(taskId, title, description, deadline);
  });

program.parse(process.argv);