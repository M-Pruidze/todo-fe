let input;
let inputValue = '';
let tasksList = JSON.parse(localStorage.getItem('list')) || [];
let beingEdited = false;
let editBtn;
let editID = null;

window.onload = async () => {
    input = document.getElementById('input');
    const addBtn = document.getElementById("add-btn");
    input.addEventListener('change',updateValue);
    input.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault;
            addBtn.click();
        }
    });
    addBtn.addEventListener("click", addTask);

    const response = await (await fetch('https://todo-back-mp.herokuapp.com/task', {
        method: 'GET'
    })).json();
    tasksList = response;

    render();
}

updateValue = (e) => {
    inputValue = e.target.value;
}
addTask = async () => {
    if (inputValue.trim() && !beingEdited) {
        const resp = await fetch('https://todo-back-mp.herokuapp.com/task', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                text: inputValue,
                isChecked: false
            })
        });
        let result = await resp.json();
        tasksList.push(result);
        inputValue = '';
        input.value = '';
        // localStorage.setItem('list',JSON.stringify(tasksList));
        render();
    } else if (inputValue.trim() && beingEdited) {
        const response = await fetch(`https://todo-back-mp.herokuapp.com/task/${editID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                text: inputValue,
            })
        });
        // let result = await response.json();

        tasksList = tasksList.map(task => {
            if (editID == task._id) return {...task, text: input.value, isChecked: task.isChecked};
            return task;
        });
        inputValue = '';
        input.value = '';
        editID = null;
        beingEdited = false;
        // localStorage.setItem('list',JSON.stringify(tasksList));
        render();
    } else alert('Please enter text');
}
render = () => {
    const tasksContainer = document.querySelector('.tasks-container');
    while (tasksContainer.firstChild) {
        tasksContainer.firstChild.remove();
    }
    if (tasksList.length) {
        tasksList.map((singleTask, index) => {
            const task = document.createElement('article');
            task.id = `task-${index}`;
            task.className = 'task-container';

            // checkbox
            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.checked = singleTask.isChecked;
            task.appendChild(checkBox);
            checkBox.onchange = () => onChangeCheckbox(index);

            // single task's text
            const taskText = document.createElement('p');
            taskText.innerText = singleTask.text;
            taskText.className = singleTask.isChecked ? 'task-text checked' : 'task-text';
            task.appendChild(taskText);

            // buttons' container
            const btnContainer = document.createElement('div');
            btnContainer.className = 'btn-container';
            task.appendChild(btnContainer);

            // edit button
            editBtn = document.createElement('button');
            editBtn.innerText = 'edit';
            editBtn.id = 'edit-btn';
            btnContainer.appendChild(editBtn);
            editBtn.onclick =  () => editTask(singleTask._id);

            // delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'delete';
            deleteBtn.id = `${index}`;
            deleteBtn.className = 'delete-btn';
            btnContainer.appendChild(deleteBtn);
            deleteBtn.onclick = () => removeTask(singleTask._id);

            // appending task to container
            tasksContainer.appendChild(task);
    });

    // clear all items button
    if (tasksList.length) {
        const clearAllBtn = document.createElement('button');
        clearAllBtn.innerText = 'clear all';
        clearAllBtn.type = 'button';
        clearAllBtn.className = 'clearAll-btn';
        clearAllBtn.onclick = () => clearAllTasks();
        tasksContainer.appendChild(clearAllBtn);
    }
    }

}

onChangeCheckbox = async (id) => {
    tasksList[id].isChecked = !tasksList[id].isChecked;
    // localStorage.setItem('list',JSON.stringify(tasksList));

    const response = await fetch(`https://todo-back-mp.herokuapp.com/task/${tasksList[id]._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            isChecked: tasksList[id].isChecked,
        })
    });
    let result = await response.json();
    render();
}
editTask = (id) => {
    const specificItem = tasksList.find(task => id === task._id);
    input.value = specificItem.text;
    inputValue = specificItem.text;
    editID = id;
    beingEdited = true;
    input.focus();
}
removeTask = async (id) => {
    const response = await fetch(`https://todo-back-mp.herokuapp.com/task/${id}`, {
        method: 'DELETE'
    });
    let result = await response.json();
    tasksList = tasksList.filter(item => id !== item._id);
    // localStorage.setItem('list',JSON.stringify(tasksList));
    render();
}
clearAllTasks = async () => {
    const response = await fetch(`https://todo-back-mp.herokuapp.com/task`, {
        method: 'DELETE'
    });
    tasksList = [];    
    // let result = await response.json();

    // localStorage.setItem('list',JSON.stringify(tasksList));
    render();
}
