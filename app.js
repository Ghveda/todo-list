import { addBoxElement, formSubmit } from "./utils/formActions.js";
import useLocalStorate from "./utils/storageHook.js";
import { statusType, todoListName } from "./utils/types.js";

// Global variables
const todosContainer = document.getElementById('todos-container');
const completedContainer = document.getElementById('completed-container');
const modalForm = document.getElementById('modalForm');

const {
  getAllFromStorage,
  addStorage,
} = useLocalStorate();

// Handle form submit
modalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formSubmit();
  showModal();
});

// Handle modal display config
const showModal = () => {
  const modal = document.getElementById('modal-container');
  if (!modal.style.display || modal.style.display === 'none') {
    modal.style.display = 'block';
  } else {
    modal.style.display = 'none';
  }
};

const createNew = () => {
  // Reset values and open modal
  const inputTitle = document.getElementById('title');
  const statusTitle = document.getElementById('status');

  inputTitle.value = '';
  statusTitle.value = statusType.completed;

  showModal();
};

// Fetch and show TODO list
const fetchTodos = async () => {
  let todoList = getAllFromStorage(todoListName);

  if (!todoList?.length) {
    // Fetch data and transform it to JSON
    const todosResult = await fetch('https://jsonplaceholder.typicode.com/todos');
    const todosJsonResult = await todosResult.json();
    addStorage(todoListName, todosJsonResult);
    todoList = todosJsonResult;
  }
  // In the API there are 200 items.
  // To visualize it better and dont make a mess, I have sliced it to 10
  todoList?.slice(0, 10).forEach((todo) => {
    const box = addBoxElement(todo);
    if (todo.completed) {
      completedContainer.appendChild(box);
    } else {
      todosContainer.appendChild(box);
    }
  });
};

fetchTodos();

// Grant access
window.showModal = showModal;
window.createNew = createNew;
