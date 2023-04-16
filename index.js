const APIs = (() => {
    // constants to store common parts of the database URL
    const baseUrl = "http://localhost:3000";
    const todoPath = "todos";

    const getTodos = () => {
        return fetch([baseUrl, todoPath].join('/')).then((res) => res.json());
    };

    const createTodo = (newTodo) => {
        return fetch([baseUrl, todoPath].join('/'), {
            method: "POST",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const updateTodo = (id) => {
        // we need to toggle the isCompleted field
        // grab the targetTodo and send a PATCH request
        return fetch([baseUrl, todoPath, id].join('/'), {
            method: "PATCH",
            body: JSON.stringify({
                isCompleted: true
            }),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const deleteTodo = (id) => {
        return fetch([baseUrl, todoPath, id].join('/'), {
            method: "DELETE",
        }).then((res) => res.json());
    };

    return { createTodo, deleteTodo, getTodos, updateTodo };
})();

const Model = (() => {
    class State {
        #todos; //private field
        #onChange; //function, will be called when setter function todos is called
        constructor() {
            this.#todos = [];
        }
        get todos() {
            return this.#todos;
        }
        set todos(newTodos) {
            this.#todos = newTodos; // reassign value
            this.#onChange?.(); // rendering
        }

        subscribe(callback) {
            //subscribe to the change of the state todos
            this.#onChange = callback;
        }
    }

    const { getTodos, createTodo, deleteTodo, updateTodo } = APIs;

    return {
        State,
        getTodos,
        createTodo,
        deleteTodo,
        updateTodo,
    };
})();

const View = (() => {
    // we get the two different todolists
    const pendingTodolistEl = document.querySelector(".pending");
    const completedTodolistEl = document.querySelector(".completed");

    const submitBtnEl = document.querySelector(".submit-btn");
    const inputEl = document.querySelector(".input");

    const renderTodos = (todos) => {
        // build separate templates for the two todolists
        let pendingTodosTemplate = "";
        let completedTodosTemplate = "";
        todos.forEach((todo) => {
            const liTemplate = `
                <li>
                    <div class="content-container">
                        <span>${todo.content}</span>
                    </div>

                    <div class="container btn-container">
                        <button class="btn edit-btn" id="${todo.id}">edit</button>
                        <button class="btn delete-btn" id="${todo.id}">delete</button>
                        <button class="btn move-btn" id="${todo.id}">move</button>
                    </div>
                </li>
            `;

            // check isCompleted field to determine which template it belongs to
            if (!todo.isCompleted) pendingTodosTemplate += liTemplate;
            else completedTodosTemplate += liTemplate;
        });

        // check for no pending todos
        if (todos.filter(todo => !todo.isCompleted).length === 0) {
            pendingTodosTemplate = "<h4>no pending tasks to display!</h4>";
        }

        // check for no completed todos
        if (todos.filter(todo => todo.isCompleted).length === 0) {
            completedTodosTemplate = "<h4>no completed tasks to display!</h4>";
        }

        // update inner HTML
        pendingTodolistEl.innerHTML = pendingTodosTemplate;
        completedTodolistEl.innerHTML = completedTodosTemplate;
    };

    const clearInput = () => {
        inputEl.value = "";
    };

    return { renderTodos, submitBtnEl, inputEl, clearInput, pendingTodolistEl, completedTodolistEl };
})();

const Controller = ((view, model) => {
    const state = new model.State();
    const todolists = [ view.pendingTodolistEl, view.completedTodolistEl ];

    const init = () => {
        model.getTodos().then((todos) => {
            todos.reverse();
            state.todos = todos;
        });
    };

    const handleSubmit = () => {
        view.submitBtnEl.addEventListener("click", (event) => {
            // by default, all submitted todos should have isCompleted set to false
            const inputValue = view.inputEl.value;
            model.createTodo({ content: inputValue, isCompleted: false }).then((data) => {
                state.todos = [data, ...state.todos];
                view.clearInput();
            });
        });
    };

    const handleDelete = () => {
        // for each todolist we have, we'll add an event listener
        todolists.forEach(list => list.addEventListener("click", (event) => {
                // get the className we want (since we are using multiple classes)
                if (event.target.className.split(" ")[1] === "delete-btn") {
                    const id = event.target.id;
                    model.deleteTodo(+id).then((data) => {
                        state.todos = state.todos.filter((todo) => todo.id !== +id);
                    });
                }
            })
        );
    };

    const handleMove = () => {
        // for each todolist we have, we'll add an event listener
        todolists.forEach(list => list.addEventListener("click", (event) => {
                // get the className we want (since we are using multiple classes)
                if (event.target.className.split(" ")[1] === "move-btn") {
                    const id = event.target.id;
                    model.updateTodo(+id);
                }
            })
        );
    };

    const bootstrap = () => {
        init();
        handleSubmit();
        handleDelete();
        handleMove();
        state.subscribe(() => {
            view.renderTodos(state.todos);
        });
    };

    return {
        bootstrap,
    };
})(View, Model); //ViewModel

Controller.bootstrap();
