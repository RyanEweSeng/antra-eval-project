import { myFetch } from './myFetch.js';

export const APIs = (() => {
    // constants to store common parts of the database URL
    const baseUrl = "http://localhost:3000";
    const todoPath = "todos";

    const getTodos = () => {
        return myFetch([baseUrl, todoPath].join('/')).then((res) => res.json());
    };

    const createTodo = (newTodo) => {
        return myFetch([baseUrl, todoPath].join('/'), {
            method: "POST",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const updateTodo = (id, newTodo) => {
        return myFetch([baseUrl, todoPath, id].join('/'), {
            method: "PUT",
            body: JSON.stringify(newTodo),
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    };

    const deleteTodo = (id) => {
        return myFetch([baseUrl, todoPath, id].join('/'), {
            method: "DELETE",
        }).then((res) => res.json());
    };

    return {
        createTodo,
        deleteTodo,
        getTodos, 
        updateTodo,
    };
})();
