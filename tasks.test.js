const fs = require('fs');
const TaskManager = require('./TaskManager.js');

describe('TaskManager', () => {
  
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  afterEach(() => {
    fs.writeFileSync('tasks.json', '[]');
  });

  describe('loadTasks', () => {
    
    test('should load tasks from tasks.json file', () => {
      
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

      fs.writeFileSync('tasks.json', JSON.stringify(tasks));

      const loadedTasks = taskManager.loadTasks();

      expect(loadedTasks).toEqual(tasks);
    });

    test('should return an empty array if tasks.json file does not exist', () => {

      if (fs.existsSync('tasks.json')) {
        fs.unlinkSync('tasks.json');
      }

      const loadedTasks = taskManager.loadTasks();

      expect(loadedTasks).toEqual([]);
    });

    test('should return an empty array if an error occurs while reading tasks.json file', () => {

      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('Mocked readFileSync error');
      });

      const loadedTasks = taskManager.loadTasks();

      expect(loadedTasks).toEqual([]);

      fs.readFileSync.mockRestore();
    });
  });

  describe('saveTasks', () => {

    test('should save tasks to tasks.json file', () => {

      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');

      taskManager.saveTasks();

      const fileContent = fs.readFileSync('tasks.json', 'utf-8');

      expect(JSON.parse(fileContent)).toEqual(taskManager.tasks);
    });
  });

  describe('addTask', () => {

    test('should add a new task to the tasks list', () => {

      taskManager.addTask('Task 1', 'Description 1', '2023-08-20');

      expect(taskManager.tasks.length).toBe(1);
      expect(taskManager.tasks[0].title).toBe('Task 1');
      expect(taskManager.tasks[0].description).toBe('Description 1');
      expect(taskManager.tasks[0].deadline).toBe('2023-08-20');
      expect(taskManager.tasks[0].completed).toBe(false);

    });

    test('should generate a unique ID for each task', () => {

      taskManager.addTask('Task 1', 'Description 1', '2022-08-20');
      taskManager.addTask('Task 2', 'Description 2', '2022-08-15');

      expect(taskManager.tasks[0].id).not.toBe(taskManager.tasks[1].id);
    });
  });

});