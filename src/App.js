import React, { Component } from 'react';
import Task from './Task/Task';
import TaskForm from './TaskForm/TaskForm';
import { DB_CONFIG } from './Config/config';
import firebase from 'firebase/app';
import 'firebase/database';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.completeTask = this.completeTask.bind(this);

    this.showAll = this.showAll.bind(this);
    this.showCurrent = this.showCurrent.bind(this);
    this.showCompleted = this.showCompleted.bind(this);
    this.showOld = this.showOld.bind(this);

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('tasks');

    this.state = {
      tasks: [],
      menuAll: false,
      menuCurrent: true,
      menuCompleted: false,
      menuOld: false,
    }
  }

  componentWillMount(){
    const previousTasks = this.state.tasks;

    this.database.on('child_added', snap => {
      previousTasks.push({
        id: snap.key,
        taskContent: snap.val().taskContent,
        taskCompleted: snap.val().taskCompleted,
        taskCreatedAt: snap.val().taskCreatedAt,
        taskPriority: snap.val().taskPriority,
      });

      this.setState({ tasks: previousTasks });
    });

    this.database.on('child_removed', snap => {
      for(var i = 0; i < previousTasks.length; i++){
        if(previousTasks[i].id === snap.key){
          previousTasks.splice(i, 1);
        }
      };

      this.setState({ tasks: previousTasks });
    });

    this.database.on('child_changed', snap => {
      for(var i = 0; i < previousTasks.length; i++){
        if(previousTasks[i].id === snap.key){
          var s = snap.val();
          previousTasks[i] = { id: snap.key,
            taskContent: s.taskContent,
            taskCompleted: s.taskCompleted,
            taskCreatedAt: s.taskCreatedAt,
            taskPriority: s.taskPriority,
          };
        };
      };
      this.setState({ tasks: previousTasks });
    });
  };

  addTask(task, priority){
    this.database.push().set({
      taskContent: task,
      taskCompleted: false,
      taskCreatedAt: Date.now(),
      taskPriority: priority
    })
  }

  removeTask(taskId){
    this.database.child(taskId).remove();
  }

  completeTask(taskId){
    this.database.child(taskId).update({ taskCompleted: true });
  }

  showAll(){
    this.setState({
      menuAll: true,
      menuCurrent: false,
      menuCompleted: false,
      menuOld: false
    })
  }

  showCurrent(){
    this.setState({
      menuAll: false,
      menuCurrent: true,
      menuCompleted: false,
      menuOld: false
    })
  }

  showCompleted(){
    this.setState({
      menuAll: false,
      menuCurrent: false,
      menuCompleted: true,
      menuOld: false
    })
  }

  showOld(){
    this.setState({
      menuAll: false,
      menuCurrent: false,
      menuCompleted: false,
      menuOld: true
    })
  }

  render() {
    var taskList = [];
    var oldLength = 604800000;

    if (this.state.menuAll){
      taskList = this.state.tasks.sort(function (a, b) {
        return a.taskPriority - b.taskPriority || a.taskCreatedAt - b.taskCreatedAt;
      });
    }

    if (this.state.menuCurrent){
      taskList = this.state.tasks.filter(t => (t.taskCompleted === false)&&((Date.now() - t.taskCreatedAt) < oldLength )).sort(function (a, b) {
        return a.taskPriority - b.taskPriority || a.taskCreatedAt - b.taskCreatedAt;
      });
    }

    if (this.state.menuCompleted){
      taskList = this.state.tasks
      .filter(t => t.taskCompleted === true);
    }

    if (this.state.menuOld){
      taskList = this.state.tasks.filter(t => (t.taskCompleted === true)||((Date.now() - t.taskCreatedAt) > oldLength ));
    }

    return (
      <div className="tasksWrapper">
        <div className="tasksHeader">
          <h1>React/Firebase Task Manager</h1>
        </div>
        <div className="tasksMenu">
          { this.state.menuCurrent &&
            <p className='button active-button'>Current</p>
          }
          { !this.state.menuCurrent &&
            <p className='button'
              onClick={() => this.showCurrent()}>Current</p>
          }

          { this.state.menuAll &&
            <p className='button active-button'>All</p>
          }
          { !this.state.menuAll &&
            <p className='button'
              onClick={() => this.showAll()}>All</p>
          }

          { this.state.menuCompleted &&
            <p className='button active-button'>Completed</p>
          }
          { !this.state.menuCompleted &&
            <p className='button'
              onClick={() => this.showCompleted()}>Completed</p>
          }

          { this.state.menuOld &&
            <p className='button active-button'>Old</p>
          }
          { !this.state.menuOld &&
            <p className='button'
              onClick={() => this.showOld()}>Old</p>
          }

        </div>
        <div className="tasksBody">
          {
            taskList.map((task) => {
              return (
                <Task taskContent={task.taskContent}
                      taskId={task.id}
                      taskCompleted={task.taskCompleted}
                      taskCreatedAt={task.taskCreatedAt}
                      taskPriority={task.taskPriority}
                      key={task.id}
                      removeTask={this.removeTask}
                      completeTask={this.completeTask}/>
              )
            })
          }

        </div>
        <div className="tasksFooter">
          <TaskForm addTask={this.addTask}/>
        </div>
      </div>
    );
  }
}

export default App;
