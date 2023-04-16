import { APIs } from "./api.js";

export const Model = ((api) => {
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

    const { getTodos, createTodo, deleteTodo, updateTodo } = api;

    return {
        State,
        getTodos,
        createTodo,
        deleteTodo,
        updateTodo,
    };
})(APIs);
