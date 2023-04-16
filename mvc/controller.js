import { Model } from './model.js';
import { View } from './view.js';

export const Controller = ((view, model) => {
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
})(View, Model);
