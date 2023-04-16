import { Model } from './model.js';
import { View } from './view.js';

export const Controller = ((view, model) => {
    const state = new model.State();
    const todolists = document.querySelectorAll(".todo-list");

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
            if (event.target.classList[1] === "delete-btn") {
                const id = event.target.id;
                model.deleteTodo(+id).then((data) => {
                    state.todos = state.todos.filter((todo) => todo.id !== +id);
                });
            }
        }));
    };

    const handleMove = () => {
        // for each todolist we have, we'll add an event listener
        todolists.forEach(list => list.addEventListener("click", (event) => {
            // get the className we want (since we are using multiple classes)
            if (event.target.classList[1] === "move-btn") {
                const id = event.target.id;
                const todo = state.todos.find(todo => todo.id == id);  // find the data of the target
                todo.isCompleted = !todo.isCompleted;
                model.updateTodo(+id, todo).then((data) => { });
            }
        }));
    };

    const handleEdit = () => {
        todolists.forEach(list => list.addEventListener("click", (event) => {
            if (event.target.classList[1] === "edit-btn") {
                const id = event.target.id;
                const spanEl = document.querySelector("#content-"+id); // query for the respective span
                const contenteditable = spanEl.getAttribute("contenteditable");
                spanEl.setAttribute("contenteditable", contenteditable === "false" ? "true" : "false");
                spanEl.focus();

                // update content only if contenteditable is false
                if (spanEl.getAttribute("contenteditable") === 'false') {
                    const todo = state.todos.find(todo => todo.id == id);
                    todo.content = spanEl.innerHTML; // update todo content
                    model.updateTodo(+id, todo).then((data) => { });
                }
            }
        }));
    };

    const bootstrap = () => {
        init();
        handleSubmit();
        handleDelete();
        handleMove();
        handleEdit();
        state.subscribe(() => {
            view.renderTodos(state.todos);
        });
    };

    return {
        bootstrap,
    };
})(View, Model);
