const API_URL = 'http://localhost:5000/api';

// Function to handle user signup
const signup = async (name, email, password) => {
       try {
              const response = await fetch(`${API_URL}/signup`, {
                     method: 'POST',
                     headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                     },
                     body: JSON.stringify({ name, email, password }),
              });
              return await response.json();
       } catch (error) {
              console.error('Error during signup:', error);
       }
};

// Function to handle user login
const login = async (email, password) => {
       try {
              const response = await fetch(`${API_URL}/login`, {
                     method: 'POST',
                     headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                     },
                     body: JSON.stringify({ email, password }),
              });
              return await response.json();
       } catch (error) {
              console.error('Error during login:', error);
       }
};

// Function to handle forgot password
const forgotPassword = async (email) => {
       try {
              const response = await fetch(`${API_URL}/forgot-password`, {
                     method: 'POST',
                     headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                     },
                     body: JSON.stringify({ email }),
              });
              return await response.json();
       } catch (error) {
              console.error('Error during forgot password:', error);
       }
};

// Function to handle password reset
const resetPassword = async (token, newPassword) => {
       try {
              const response = await fetch(`${API_URL}/reset-password/${token}`, {
                     method: 'POST',
                     headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                     },
                     body: JSON.stringify({ newPassword }),
              });
              return await response.json();
       } catch (error) {
              console.error('Error during password reset:', error);
       }
};

// Function to create a new todo
const createTodo = async (token, title) => {
       try {
              const response = await fetch(`${API_URL}/todos`, {
                     method: 'POST',
                     headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'Access-Control-Allow-Origin': '*'
                     },
                     body: JSON.stringify({ title }),
              });
              return await response.json();
       } catch (error) {
              console.error('Error during creating todo:', error);
       }
};

// Function to update a todo
const updateTodo = async (token, todoId, updatedData) => {
       try {
              const response = await fetch(`${API_URL}/todos/${todoId}`, {
                     method: 'PUT',
                     headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'Access-Control-Allow-Origin': '*'
                     },
                     body: JSON.stringify(updatedData),
              });
              return await response.json();
       } catch (error) {
              console.error('Error during updating todo:', error);
       }
};

// Function to delete a todo
const deleteTodo = async (token, todoId) => {
       try {
              const response = await fetch(`${API_URL}/todos/${todoId}`, {
                     method: 'DELETE',
                     headers: {
                            'Authorization': `Bearer ${token}`,
                            'Access-Control-Allow-Origin': '*'
                     },
              });
              return await response.json();
       } catch (error) {
              console.error('Error during deleting todo:', error);
       }
};

// Function to get all todos
const getTodos = async (token) => {
       try {
              const response = await fetch(`${API_URL}/todos`, {
                     method: 'GET',
                     headers: {
                            'Authorization': `Bearer ${token}`,
                            'Access-Control-Allow-Origin': '*'
                     },
              });
              return await response.json();
       } catch (error) {
              console.error('Error during fetching todos:', error);
       }
};

async function handleLogin(event) {
       event.preventDefault();
       document.querySelector('.error').innerText = '';

       const email = document.querySelector('input[name="email"]').value;
       const password = document.querySelector('input[name="password"]').value;

       try {
              const result = await login(email, password);

              if (result.error) {
                     document.querySelector('.error').innerText = result.error;
              } else {
                     // Set the token in cookies
                     document.cookie = `token=${result.token}; path=/; secure; samesite=strict`;

                     // Redirect the todo.html
                     window.location.href = 'todo.html';

                     // local Storage tokens
                     localStorage.setItem("token", result.token);
              }
       } catch (error) {
              console.error('Error during login:', error);
              document.querySelector('.error').innerText = 'An error occurred during login.';
       }
}


async function handleSignUp(event) {
       event.preventDefault();

       const name = document.querySelector('input[name="name"]').value;
       const email = document.querySelector('input[name="email"]').value;
       const password = document.querySelector('input[name="password"]').value;
       const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;

       if (password !== confirmPassword) {
              document.querySelector('.error').innerText = 'Passwords do not match.';
              return;
       }

       try {
              const result = await signup(name, email, password);
              if (result.error) {
                     document.querySelector('.error').innerText = result.error;
              } else {

                     // Set the token in cookies
                     document.cookie = `token=${result.token}; path=/; secure; samesite=strict`;

                     // Redirect the todo.html
                     window.location.href = 'todo.html';

                     // local Storage tokens
                     localStorage.setItem("token", result.token);
              }
       } catch (error) {
              document.querySelector('.error').innerText = 'An error occurred during login.';
       }
}

// Function to get token from cookies
function getCookie(name) {
       const value = `; ${document.cookie}`;
       const parts = value.split(`; ${name}=`);
       if (parts.length === 2) return parts.pop().split(';').shift();
       return null;
}

// List of allowed public pages that don't require authentication
const allowedPages = [
       'loginForm.html',
       'index.html',
       'signUpForm.html',
       'forgotPassword.html',
       'resetPassword.html',
       ''
]; // '' accounts for the home route (e.g., index.html)

// Function to validate access
function validateAccess() {
       const token = getCookie('token'); // Check if the token exists
       const currentPage = window.location.pathname.split('/').pop(); // Get the current page

       // If the token is missing and the current page is not in the allowed list, redirect to login
       if (!token && !allowedPages.includes(currentPage)) {
              alert('You must log in to access this page.');
              window.location.href = 'loginForm.html'; // Redirect to login
       }
}

// Call validateAccess on page load
window.onload = validateAccess;

/**
 * After VAlidation to the TO DO list
 */

async function addTask() {
       const token = getCookie('token')
       const title = document.querySelector('input[name="title"]').value;

       if(!title) {
              document.querySelector('.error').innerText = "Please provide a title";
       } else {

              try {
                     const result = await createTodo(token, title);
                     if (result.error) {
                            document.querySelector('.error').innerText = result.error;
                     } else {

                            window.alert("Task Created Successfully");
                            fetchTasks();
                     }
              } catch (error) {
                     document.querySelector('.error').innerText = 'An error occurred during login.';
              }
       }

}

// Select the HTML elements where tasks will be rendered
const listContainer = document.getElementById("list-container");

// Function to fetch tasks from the backend
async function fetchTasks() {
       const token = getCookie('token')
       try {
              const response = await getTodos(token);
              console.log(response);
              renderTasks(response); // Display tasks in the DOM
       } catch (error) {
              console.error('Error fetching tasks:', error);
       }
}

function renderTasks(tasks) {
       listContainer.innerHTML = ''; // Clear previous tasks

       if (tasks.length === 0) {
              const li = document.createElement('li');
              li.textContent = "No tasks";
              listContainer.appendChild(li);
              return;
       }

       tasks.forEach(task => {
              const li = document.createElement('li'); // Create a new <li> for each task
              li.textContent = task.title;

              if (task.status === 'completed') {
                     li.classList.add('checked'); // Add 'checked' class if task is completed
              }

              const span = document.createElement('span');
              span.innerHTML = "\u00d7";
              span.onclick = () => deleteTask(task.id);
              li.appendChild(span);

              listContainer.appendChild(li); // Add the <li> to the list container
       });
}

// Function to delete a task by its ID
async function deleteTask(id) {
       const token = getCookie('token')
       try {
              const response = await deleteTodo(token, id);;
              if (!response.ok) {
                     throw new Error('Failed to delete task');
              }
              window.alert('Task deleted successfully')
              fetchTasks();
       } catch (error) {
              console.error('Error deleting task:', error);
       }
}

// Call the fetchTasks function to display tasks when the page loads
fetchTasks();

function logout() {
       localStorage.removeItem('token'); // Clear token from localStorage
       document.cookie = 'token=; Max-Age=0; path=/'; // Clear token from cookies
       window.location.href = 'loginForm.html'; // Redirect to login
}

document.addEventListener('DOMContentLoaded', () => {
       document.getElementById('loginForm').addEventListener('submit', handleLogin);
       document.getElementById('signUpForm').addEventListener('submit', handleSignUp);
       document.getElementById('logout').addEventListener('submit', logout);
});