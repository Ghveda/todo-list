import useLocalStorate from "./storageHook.js";
import { positionType, statusType, todoListName } from "./types.js";

// Global variables
const todosContainer = document.getElementById('todos-container');
const completedContainer = document.getElementById('completed-container');
const modalTitle = document.getElementById('title');
const modalStatus = document.getElementById('status');
let edittingCardId;

const {
  deleteOne,
  addItemToStorage,
  updateStorageItem,
} = useLocalStorate();

// Handle Edit & Delete actions
const handleEdit = (_, id) => {
  // Get & Set current values of the Card
  const currentBox = document.getElementById(id);
  modalTitle.value = currentBox.querySelector('h3').textContent;
  modalStatus.value = currentBox.querySelector('span').textContent;
  edittingCardId = id;
  showModal();
};

const handleDelete = (_, id) => {
  const element = document.getElementById(id);
  element.remove();
  deleteOne(todoListName, id);
};

// Create Box element for DOM
export const addBoxElement = (todo) => {
  // 1. Create a Box
  const box = document.createElement('div');
  box.classList.add('box');
  box.id = todo.id;

  // 2. Create Box children Elements
  const title = document.createElement('h3');
  const status = document.createElement('span');

  // 3. Create action buttons with styles
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const editButton = document.createElement('button');
  editButton.classList.add('button', 'button-green');
  editButton.textContent = 'Edit';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('button', 'button-red');
  deleteButton.textContent = 'Delete';

  // 4. Add Content to the elements
  title.textContent = todo.title;
  status.textContent = todo.completed ? statusType.completed : statusType.pending;

  // 5. Add eventListener to handle todo's ID
  editButton.addEventListener('click', (event) => handleEdit(event, todo.id));
  deleteButton.addEventListener('click', (event) => handleDelete(event, todo.id));

  // 6. Add Elements to the DOM
  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(deleteButton);

  box.appendChild(title);
  box.appendChild(status);
  box.appendChild(buttonsContainer);

  return box;
};

export const formSubmit = () => {
  // Hanlde if it is Edit or Create submit
  if (!edittingCardId) {
    const newItem = {
      id: Math.random() + new Date(),
      title: modalTitle.value,
      completed: modalStatus.value === statusType.completed,
    };

    const box = addBoxElement(newItem);

    if (modalStatus.value === statusType.pending) {
      todosContainer.prepend(box);
    } else {
      completedContainer.prepend(box);
    }

    // Add new item to localStorage
    const storageItem = {
      ...newItem,
    };

    addItemToStorage(todoListName, storageItem, positionType.first);
  } else {
    let newElement;
    const currentBox = document.getElementById(edittingCardId);
    const title = currentBox.querySelector('h3');
    const status = currentBox.querySelector('span');

    if (status.textContent === modalStatus.value) {
      // Update title
      title.textContent = modalTitle.value;

      newElement = {
        id: edittingCardId,
        title: modalTitle.value,
        completed: modalStatus.value === statusType.completed,
      };
    } else {
      // Move item to another column (Completed / Pending)
      newElement = {
        id: Math.random() + new Date(),
        title: modalTitle.value,
        completed: modalStatus.value === statusType.completed,
      };
      const box = addBoxElement(newElement);
      currentBox.remove();

      if (modalStatus.value === statusType.completed) {
        completedContainer.prepend(box);
      } else {
        todosContainer.prepend(box);
      }

    }
    updateStorageItem(todoListName, edittingCardId, newElement);
    edittingCardId = undefined;
  }
}
