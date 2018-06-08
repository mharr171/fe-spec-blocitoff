import React, { Component } from 'react';
import './TaskForm.css';

class TaskForm extends Component{
  constructor(props){
    super(props);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleUserSelect = this.handleUserSelect.bind(this);
    this.writeTask = this.writeTask.bind(this);
    this.state = {
      newTaskContent: '',
      newSelected: '',
    };
  }

  handleUserInput(e){
    this.setState({
      newTaskContent: e.target.value
    })
  }

  handleUserSelect(e){
    this.setState({
      newSelected: e.target.value
    })
  }

  writeTask(){
    if (this.state.newTaskContent != ''){
      this.props.addTask(this.state.newTaskContent,this.state.newSelected)

      this.setState({
        newTaskContent: ''
      })
    }
  }

  render(){
    return(
      <div className="formWrapper">
        <input className="taskInput"
          placeholder="Write a new task"
          value={ this.state.newTaskContent }
          onChange={ this.handleUserInput } />
        <select className="taskPriority"
          onChange={ this.handleUserSelect }>
          <option value='1'>High</option>
          <option value='2'
            selected="selected">Medium</option>
          <option value='3'>Low</option>
        </select>
        <button className="taskButton"
          onClick={ this.writeTask }>+</button>
      </div>
    )
  }

}

export default TaskForm;
