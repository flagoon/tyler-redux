function generateId() {
  return Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
}
// App Code
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

const checker = (store) => (next) => (action) => {
  if (action.type === ADD_TODO && action.todo.name.toLowerCase().indexOf('bitcoin') !== -1) {
    return alert('Nah');
  }

  if (action.type === ADD_GOAL && action.goal.name.toLowerCase().indexOf('bitcoin') !== -1) {
    return alert('Nah');
  }

  return next(action);
};

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('The action: ', action);
  const result = next(action);
  console.log('The new state: ', store.getState());
  console.groupEnd();
  return result;
};

// Reducer function
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id ? todo : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}

function app(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  };
}

const store = Redux.createStore(Redux.combineReducers({ todos, goals }), Redux.applyMiddleware(checker, logger));

store.subscribe(() => {
  const { goals, todos } = store.getState();

  document.querySelector('#todos').innerHTML = '';
  document.querySelector('#goals').innerHTML = '';

  goals.forEach(addGoalToDom);
  todos.forEach(addTodoToDom);
});

// store.dispatch(
//   addTodoAction({
//     id: 0,
//     name: 'Walk the dog',
//     complete: false,
//   })
// );

// store.dispatch(
//   addTodoAction({
//     id: 1,
//     name: 'Wash the car',
//     complete: false,
//   })
// );

// store.dispatch(
//   addTodoAction({
//     id: 2,
//     name: 'Go to the gym',
//     complete: true,
//   })
// );

// store.dispatch(removeTodoAction(1));

// store.dispatch(toggleTodoAction(0));

// store.dispatch(
//   addGoalAction({
//     id: 0,
//     name: 'Learn Redux',
//   })
// );

// store.dispatch(
//   addGoalAction({
//     id: 1,
//     name: 'Lose 20 pounds',
//   })
// );

function createRemoveButton(onClick) {
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = 'X';
  removeBtn.addEventListener('click', onClick);

  return removeBtn;
}

function addTodoToDom(todo) {
  const node = document.createElement('li');
  const text = document.createTextNode(todo.name);

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id));
  });

  node.appendChild(text);
  node.appendChild(removeBtn);
  node.style.textDecoration = todo.complete ? 'line-through' : 'none';

  node.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id));
  });

  document.querySelector('#todos').appendChild(node);
}

function addGoalToDom(goal) {
  const node = document.createElement('li');
  const text = document.createTextNode(goal.name);

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id));
  });

  node.appendChild(text);
  node.appendChild(removeBtn);

  document.querySelector('#goals').appendChild(node);
}

function addTodo() {
  const input = document.querySelector('#todo');
  const name = input.value;
  input.value = '';

  store.dispatch(
    addTodoAction({
      id: generateId(),
      name,
      complete: false,
    })
  );
}

function addGoal() {
  const input = document.querySelector('#goal');
  const name = input.value;
  input.value = '';

  store.dispatch(
    addGoalAction({
      id: generateId(),
      name,
    })
  );
}

document.querySelector('#todoBtn').addEventListener('click', addTodo);
document.querySelector('#goalBtn').addEventListener('click', addGoal);
