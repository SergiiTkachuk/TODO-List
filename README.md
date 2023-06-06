# TODO-List

## Description

This is a simple console application that allows you to track your progress, important events or just reminders, 
breaking everything down into specific tasks. The json file is used to store tasks. Certain commands are used to manage jobs.

## How to start work

1. If you do not have `Node.js`, install it. Recommended version is `>18`.  
2. Clone repository via `git clone https://github.com/SergiiTkachuk/TODO-List.git` 
3. Change directory `cd TODO-List`
4. Pull up dependencies `npm install`

## How to start use

You can enter the following commands in the terminal:

- Add task
```
node main.js add <title> [description] [deadline]
```
- See all tasks
```
node main.js list
```
- Edit task
```
node main.js edit <taskId> [title] [description] [deadline]
```
- Complete task
```
node main.js complete <taskId>
```
- Delete task
```
node main.js delete <taskId>
```
- See all outstanding tasks after the deadline
```
node main.js expired
```
- See all backlogs with deadlines sorted descending
```
node main.js pending
```
- Run tests
```
npm test
```
