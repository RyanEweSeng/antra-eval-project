export const APIs = (() => {
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

    return {
        createTodo,
        deleteTodo,
        getTodos, 
        updateTodo,
    };
})();
