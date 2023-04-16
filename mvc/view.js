export const View = (() => {
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
            const pendingTemplate = `
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

            const completedTemplate = `
                <li>
                    <div class="container btn-container">
                    <button class="btn move-btn" id="${todo.id}">move</button>
                    </div>
                    <div class="content-container">
                        <span>${todo.content}</span>
                    </div>
                    <div class="container btn-container">
                        <button class="btn edit-btn" id="${todo.id}">edit</button>
                        <button class="btn delete-btn" id="${todo.id}">delete</button>
                    </div>
                </li>
            `;

            // check isCompleted field to determine which template it belongs to
            if (!todo.isCompleted) pendingTodosTemplate += pendingTemplate;
            else completedTodosTemplate += completedTemplate;
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

    return {
        renderTodos,
        clearInput,
        submitBtnEl,
        inputEl,
        pendingTodolistEl,
        completedTodolistEl,
    };
})();
