import React, { useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
//import './TaskList.css'; // Import a CSS file for custom styles
import './../Css/Table.css' ;

const TaskList = () => {
  const [tasks, setTasks] = useState([
    { assignedTo: 'User 1', status: 'Completed', dueDate: '2024-10-12', priority: 'Low', description: 'This task is good' },
    { assignedTo: 'User 2', status: 'In Progress', dueDate: '2024-09-14', priority: 'High', description: 'This task is important' },
    { assignedTo: 'User 3', status: 'Not Started', dueDate: '2024-08-18', priority: 'Low', description: 'This task needs attention' },
    { assignedTo: 'User 4', status: 'In Progress', dueDate: '2024-06-12', priority: 'Normal', description: 'This task is almost done' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    assignedTo: 'User 1',
    status: 'Not Started',
    priority: 'Normal',
    dueDate: '',
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const handleOpenModal = () => {
    setTaskDetails({
      assignedTo: 'User 1',
      status: 'Not Started',
      priority: 'Normal',
      dueDate: '',
      description: '',
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (isEditing && editingTaskIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingTaskIndex] = taskDetails;
      setTasks(updatedTasks);
    } else {
      setTasks([...tasks, taskDetails]);
    }
    handleCloseModal();
  };

  const handleEditTask = (taskIndex) => {
    setTaskDetails(tasks[taskIndex]);
    setIsEditing(true);
    setEditingTaskIndex(taskIndex);
    setShowModal(true);
  };

  const handleDeleteTask = (taskIndex) => {
    const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <h1>Task List</h1>
      <Button variant="primary" onClick={handleOpenModal}>
        New Task
      </Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} className={`task-row ${task.status.toLowerCase()}`} onClick={() => handleEditTask(index)}>
              <td>{task.assignedTo}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>{task.priority}</td>
              <td>{task.description}</td>
              <td>
                <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDeleteTask(index); }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Task' : 'New Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAssignedTo">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control as="select" name="assignedTo" value={taskDetails.assignedTo} onChange={handleChange}>
                <option>User 1</option>
                <option>User 2</option>
                <option>User 3</option>
                <option>User 4</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={taskDetails.status} onChange={handleChange}>
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" name="dueDate" value={taskDetails.dueDate} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Control as="select" name="priority" value={taskDetails.priority} onChange={handleChange}>
                <option>Normal</option>
                <option>High</option>
                <option>Low</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? 'Update Task' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskList;
