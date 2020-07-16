const view = {
    goToPage: (identifier) => {
        const pages = document.getElementsByClassName('page-content')
        const targetPage = document.getElementById(`page-${identifier}`)

        Array.from(pages).forEach((page) => {
            page.classList.add('hidden')
        })

        targetPage.classList.remove('hidden')
    },

    showProtectedMenus: (wantToShow = true) => {
        const protectedMenus = document.getElementsByClassName('need-auth')

        Array.from(protectedMenus).forEach((menu) => {
            if (wantToShow) {
                menu.classList.remove('hidden')
            } else {
                menu.classList.add('hidden')
            }
        })
    },

    showLoginMenu: (wantToShow = true) => {
        const loginMenu = document.getElementById('login-menu')

        if (wantToShow) {
            loginMenu.classList.remove('hidden')
        } else {
            loginMenu.classList.add('hidden')
        }
    },

    authLogin: () => {
        const secretPassword = 'higor'
        const inputPwd = document.getElementById("auth-password")

        if (inputPwd.value === secretPassword) {
            inputPwd.value = ''
            view.showLoginMenu(false)
            view.showProtectedMenus()
            view.goToPage('todo')
            input.newTodoTitle.setFocus()
        }
    },

    authLogout: () => {
        view.showLoginMenu()
        view.showProtectedMenus(false)
        view.goToPage('inicial')
    },
}

function runIfEnter(event, callback) {
    console.log(event.key)
    if (event.key === 'Enter') {
        callback()
    }    
}

const controller = {
    index: (filter = {}) => {
        output.clearTodoList()
        output.showAllTodos(filter)
    },
    create: () => {
        title = input.newTodoTitle.get()
        const newTodo = createTodo(title)
        input.newTodoTitle.clear()
        output.clearTodoList()
        // output.showOneTodo(newTodo)
        output.showAllTodos()
        input.newTodoTitle.setFocus()
    },
    show: (id) => {
        const todo = showTodo(id)
        output.clearTodoList()
        output.showOneTodo(todo)
    },
    update: (id, itemsToChange) => {
        const updatedTodo = updateTodo(id, itemsToChange)
    },
    delete: (id) => {
        deleteTodo(id),
        output.clearTodoList()
        output.showAllTodos()
    }
}

const input = {
    newTodoTitle: {
        get: () => {
            const newTitle = document.getElementById("inputTodo")
            return newTitle.value   
        },
        clear: () => {
            const newTitle = document.getElementById("inputTodo")
            newTitle.value = ''
        },
        setFocus: () => {
            const newTitle = document.getElementById("inputTodo")
            newTitle.focus()
        }
    }
}

const output = {
    clearTodoList: () => {
        const todoView = document.getElementById("todo-view")
        todoView.innerHTML = ''
    },
    showAllTodos: (filter = {}) => {
        const todoView = document.getElementById("todo-view")
        const hasFilters = Object.keys(filter).length
        let filteredTodos = todos

        if (hasFilters) {
            filteredTodos = todos.filter((todo) => {
                let willReturn = false

                Object.keys(todo).forEach((key, index, array) => {
                    willReturn = willReturn | (todo[key] === filter[key])
                })

                return willReturn
            })
        }

        filteredTodos.forEach((todo) => {
            todoView.appendChild(renderTodo(todo))
        })
    },
    showOneTodo: (todo) => {
        const todoView = document.getElementById("todo-view")
        todoView.appendChild(renderTodo(todo))
    }
}

function renderTodo(todo) {
    let checkbox = document.createElement("input")
    checkbox.type = 'checkbox'
    checkbox.id = `checkbox_${todo.id}_todo`
    checkbox.checked = todo.completed
    checkbox.addEventListener('click', (el) => {
        controller.update(todo.id, {
            completed: el.target.checked 
        })
    });

    spanTitle = document.createElement('span')
    spanTitle.appendChild(document.createTextNode(todo.title))

    deleteButton = document.createElement('button')
    deleteButton.appendChild(document.createTextNode('X'))
    deleteButton.addEventListener('click', (el) => {
        controller.delete(todo.id)
    });
    
    div = document.createElement('div')
    div.classList = 'todo-item'
    div.appendChild(checkbox)
    div.appendChild(spanTitle)
    div.appendChild(deleteButton)

    return div;
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
    let template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}


var todos = [];

const generateId = () => {
    return (new Date).toISOString()
}

const createTodo = (title) => {
    if (title) {
        title = title.trim();
    }

    if (!title) {
        title = 'Alguma coisa que não sei o que é'
    }

    const newTodoItem = {
        id: generateId(), 
        title,
        description: '',
        completed: false
    }

    todos.push(newTodoItem)

    sendAllToDatabase()

    return newTodoItem
}

const updateTodo = (id, itemsToChange = { completed: true }) => {
    let updated = null;
    todos = todos.map((todo) => {
        if (todo.id === id) {
            todo = {...todo, ...itemsToChange}
            updated = todo
        }
        return todo
    })

    sendAllToDatabase()
    return updated
}

const showTodo = (id) => {
    return todos.filter((todo) => todo.id === id)
}

const deleteTodo = (id) => {
    todos = todos.filter((todo) => todo.id !== id)

    sendAllToDatabase()
}

const sendAllToDatabase = () => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

const getAllFromDatabase = () => {
    todos = JSON.parse(localStorage.getItem('todos')) ?? []
}

function init() {
    getAllFromDatabase()

    if (todos.length > 0) {
        output.clearTodoList()
        output.showAllTodos()
    }
}

init()

