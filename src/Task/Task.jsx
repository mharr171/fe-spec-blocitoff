import React, { Component } from 'react';
import './Task.css';
import PropTypes from 'prop-types';

class Task extends Component{

	constructor(props){
		super(props);
		this.handleRemoveTask = this.handleRemoveTask.bind(this);
		this.handleCompleteTask = this.handleCompleteTask.bind(this);

		this.taskContent = props.taskContent;
		this.taskId = props.taskId;
		this.taskCompleted = props.taskCompleted;
		this.taskCreatedAt = props.taskCreatedAt;
		this.taskPriority = props.taskPriority;

		this.state = {
			completed: this.props.taskCompleted
		}
	}

	handleRemoveTask(id){
		this.props.removeTask(id);
	}

	handleCompleteTask(id){
		this.props.completeTask(id);
		this.setState({completed:true});
	}

	render(props){
		return(
			<div className="task fadeIn">

				{ this.state.completed &&
					<span className="taskContent completed"
								onClick={() => this.handleCompleteTask(this.taskId)}>{ this.taskContent }</span>
				}

				{ !this.state.completed &&
					<span className="taskContent notCompleted"
								onClick={() => this.handleCompleteTask(this.taskId)}>{ this.taskContent }</span>
				}

				<span className="removeTask"
							onClick={() => this.handleRemoveTask(this.taskId)}>
							&times;
				</span>
			</div>
		);

	}
}

Task.propTypes = {
	taskContent: PropTypes.string,
	taskPriority: PropTypes.number,
	taskCompleted: PropTypes.bool,
	taskCreatedAt: PropTypes.number,
}

export default Task;
