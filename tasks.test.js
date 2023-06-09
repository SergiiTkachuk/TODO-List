const fs = require('fs');
const TaskManager = require('./TaskManager.js');

describe('TaskManager', () => {
  
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager('test.json');
  });

  afterEach(() => {
    fs.writeFileSync('test.json', '[]');
  });

  describe('loadTasks', () => {
    
    test('should load tasks from test.json file', () => {
      
      const tasks = [

        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          deadline: '2023-05-20',
          completed: false,
        },

        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          deadline: '2023-05-15',
          completed: true,
        },

      ];

      fs.writeFileSync('test.json', JSON.stringify(tasks));

      const loadedTasks = taskManager.loadTasks();

      expect(loadedTasks).toEqual(tasks);
    });

    test('should return an empty array if test.json file does not exist', () => {

      if (fs.existsSync('test.json')) {
        fs.unlinkSync('test.json');
      }

      const loadedTasks = taskManager.loadTasks();

      expect(loadedTasks).toEqual([]);
    });

    test('should return an empty array if an error occurs while reading test.json file', () => {

      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('Mocked readFileSync error');
      });

      const loadedTasks = taskManager.loadTasks();

      expect(loadedTasks).toEqual([]);

      fs.readFileSync.mockRestore();
    });
  });

  describe('saveTasks', () => {

    test('should save tasks to test.json file', () => {

      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');

      taskManager.saveTasks();

      const fileContent = fs.readFileSync('test.json', 'utf-8');

      expect(JSON.parse(fileContent)).toEqual(taskManager.tasks);
    });
  });

  describe('addTask', () => {

    test('should add a new task to the tasks list', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-08-20');

      expect(taskManager.tasks.length).toBe(1);
      expect(taskManager.tasks[0].title).toBe('Task 1');
      expect(taskManager.tasks[0].description).toBe('Description 1');
      expect(taskManager.tasks[0].deadline).toBe('2025-08-20');
      expect(taskManager.tasks[0].completed).toBe(false);

    });

    test('should display a message if the deadline incorrect', () => {

      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);
            
      taskManager.addTask('Task 1', 'Description 1', '2022-08-20');
      taskManager.addTask('Task 2', 'Description 2', 'pablo');

      expect(taskManager.tasks.length).toBe(0);
      expect(consoleLogMock).toHaveBeenNthCalledWith(1, 'Incorrect date.');
      expect(consoleLogMock).toHaveBeenNthCalledWith(2, 'Incorrect date.');
    
      console.log.mockRestore();
    });

    test('should generate a unique ID for each task', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-08-20');
      taskManager.addTask('Task 2', 'Description 2', '2025-08-15');

      expect(taskManager.tasks[0].id).not.toBe(taskManager.tasks[1].id);
    });
  });

  describe('editTask', () => {

    test('should edit the specified task', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-05-20');

      taskManager.editTask(taskManager.tasks[0].id, 'New Title', 'New Description', '2025-05-25');

      expect(taskManager.tasks[0].title).toBe('New Title');
      expect(taskManager.tasks[0].description).toBe('New Description');
      expect(taskManager.tasks[0].deadline).toBe('2025-05-25');

    });

    test('should not modify the task if no new values are provided', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-05-20');

      taskManager.editTask(taskManager.tasks[0].id);

      expect(taskManager.tasks[0].title).toBe('Task 1');
      expect(taskManager.tasks[0].description).toBe('Description 1');
      expect(taskManager.tasks[0].deadline).toBe('2025-05-20');

    });

    test('should display a message if the task is not found', () => {

      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);

      taskManager.editTask('nonexistentId', 'New Title', 'New Description', '2025-05-25');
    
      expect(consoleLogMock).toHaveBeenCalledWith('Task not found.');
    
      console.log.mockRestore();
    });

    test('should display a message if the deadline incorrect', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-08-20');

      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);

      taskManager.editTask(taskManager.tasks[0].id, 'New Title', 'New Description', '2025')

      expect(taskManager.tasks.length).toBe(1);
      expect(consoleLogMock).toHaveBeenCalledWith('Incorrect date.');
    
      console.log.mockRestore();
    });
    
  });

  describe('completeTask', () => {

    test('should mark the specified task as completed', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-05-20');

      taskManager.completeTask(taskManager.tasks[0].id);

      expect(taskManager.tasks[0].completed).toBe(true);
      expect(taskManager.tasks[0].completionDate).toBeDefined();

    });

    test('should display a message if the task is not found', () => {

      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);

      taskManager.completeTask('nonexistentId');

      expect(consoleLogMock).toHaveBeenCalledWith('Task not found.');

      console.log.mockRestore();
    });
  });

  describe('deleteTask', () => {

    test('should delete the specified task', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-05-20');

      taskManager.deleteTask(taskManager.tasks[0].id);

      expect(taskManager.tasks.length).toBe(0);
    });

    test('should display a message if the task is not found', () => {

      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);

      taskManager.deleteTask('nonexistentId');

      expect(consoleLogMock).toHaveBeenCalledWith('Task not found.');

      console.log.mockRestore();
    });
  });

  describe('findTaskById', () => {

    test('should return the task with the specified ID', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-05-20');

      const foundTask = taskManager.findTaskById(taskManager.tasks[0].id);

      expect(foundTask).toEqual(taskManager.tasks[0]);
    });

    test('should return undefined if the task with the specified ID is not found', () => {
      
      const foundTask = taskManager.findTaskById('nonexistentId');

      expect(foundTask).toBeUndefined();
    });
  });

  describe('showExpiredTasks', () => {

    test('should display a list of expired tasks', () => {

      const tasks = [

        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          deadline: '2023-05-20',
          completed: false,
        },

        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          deadline: '2023-05-15',
          completed: true,
        },

      ];

      const jsonData = JSON.stringify(tasks, null, 2);
      fs.writeFileSync('test.json', jsonData);

      taskManager.loadTasks();

      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);

      taskManager.showExpiredTasks();

      if (taskManager.tasks.some((task) => !task.completed && task.deadline)) {
         expect(consoleLogMock).toHaveBeenCalledWith('Expired tasks:');
         taskManager.tasks.forEach((task) => {
            if (!task.completed && task.deadline) {
               expect(consoleLogMock).toHaveBeenCalledWith(`  ID: ${task.id}`);
               expect(consoleLogMock).toHaveBeenCalledWith(`  Title: ${task.title}`);
               expect(consoleLogMock).toHaveBeenCalledWith(`  Description: ${task.description}`);
               expect(consoleLogMock).toHaveBeenCalledWith(`  Deadline: ${task.deadline}`);
               expect(consoleLogMock).toHaveBeenCalledWith('----------------------------');
            }
         });
      } else {
         expect(consoleLogMock).toHaveBeenCalledWith('No expired tasks.');
      }
   
      console.log.mockRestore();
    });

    test('should not display any tasks if no tasks are expired', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-05-20');
      taskManager.addTask('Task 2', 'Description 2', '2025-06-01');

      const firstTaskId = taskManager.tasks[0].id;
      const secondTaskId = taskManager.tasks[1].id;

      taskManager.completeTask(firstTaskId);
      taskManager.completeTask(secondTaskId);

      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);

      taskManager.showExpiredTasks();

      expect(consoleLogMock).toHaveBeenCalledWith('Expired tasks:');
      expect(consoleLogMock).toHaveBeenCalledWith('No expired tasks.');

      console.log.mockRestore();
    });
  });

  describe('showPendingTasks', () => {

    test('should display a sorted list of pending tasks by deadline', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-05-20');
      taskManager.addTask('Task 2', 'Description 2', '2025-04-30');
      taskManager.addTask('Task 3', '', '2025-05-10');

      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);

      taskManager.showPendingTasks();

      expect(consoleLogMock).toHaveBeenCalledWith('Pending tasks (sorted by deadline):');
      expect(consoleLogMock).toHaveBeenCalledWith(`  ID: ${taskManager.tasks[1].id}`);
      expect(consoleLogMock).toHaveBeenCalledWith('  Title: Task 2');
      expect(consoleLogMock).toHaveBeenCalledWith('  Description: Description 2');
      expect(consoleLogMock).toHaveBeenCalledWith('  Deadline: 2025-04-30');
      expect(consoleLogMock).toHaveBeenCalledWith('----------------------------');
      expect(consoleLogMock).toHaveBeenCalledWith(`  ID: ${taskManager.tasks[2].id}`);
      expect(consoleLogMock).toHaveBeenCalledWith('  Title: Task 3');
      expect(consoleLogMock).toHaveBeenCalledWith('  Description: No description');
      expect(consoleLogMock).toHaveBeenCalledWith('  Deadline: 2025-05-10');
      expect(consoleLogMock).toHaveBeenCalledWith('----------------------------');
      expect(consoleLogMock).toHaveBeenCalledWith(`  ID: ${taskManager.tasks[0].id}`);
      expect(consoleLogMock).toHaveBeenCalledWith('  Title: Task 1');
      expect(consoleLogMock).toHaveBeenCalledWith('  Description: Description 1');
      expect(consoleLogMock).toHaveBeenCalledWith('  Deadline: 2025-05-20');
      expect(consoleLogMock).toHaveBeenCalledWith('----------------------------');

      console.log.mockRestore();
    });

    test('should display a message if there are no pending tasks', () => {

      taskManager.addTask('Task 1', 'Description 1', '2025-05-20');

      taskManager.completeTask(taskManager.tasks[0].id);

      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);

      taskManager.showPendingTasks();

      expect(consoleLogMock).toHaveBeenCalledWith('Pending tasks (sorted by deadline):');
      expect(consoleLogMock).toHaveBeenCalledWith('No pending tasks.');

      console.log.mockRestore();
    });
  });
});
