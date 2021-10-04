let input;
let inputValue = '';
let tasksList = [];
let beingEdited = false;

window.onload = () => {
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
    render();
}

updateValue = (e) => {
    inputValue = e.target.value;
}
addTask = () => {
    if (inputValue.trim()) {
        tasksList.push({
            text: inputValue,
            isChecked: false
        });
        inputValue = '';
        input.value = '';
        render();
    } else alert('Please enter text');
}
render = () => {
    const tasksContainer = document.querySelector('.tasks-container');
    while (tasksContainer.firstChild) {
        tasksContainer.firstChild.remove();
    }
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
        const editBtn = document.createElement('button');
        editBtn.innerText = 'edit';
        editBtn.id = 'edit-btn';
        btnContainer.appendChild(editBtn);
        editBtn.onclick = () => {
            beingEdited = !beingEdited;
            if (beingEdited) {
                editBtn.innerText = 'save';
                checkBox.disabled = true;
                deleteBtn.disabled = true;
                let newInput = document.createElement('input');
                newInput.type = 'text';
                newInput.value = taskText.innerText;
                newInput.className = 'edited-text';
                newInput.addEventListener('keyup', (event) => {
                    if (event.code === 'Enter') {
                        event.preventDefault;
                        editBtn.click();
                    }
                });
                task.replaceChild(newInput, taskText);
                newInput.focus();
            } else {
                let inputText = task.getElementsByTagName('input')[1];
                editBtn.innerText = 'edit';
                checkBox.disabled = false;
                deleteBtn.disabled = false;
                let newText = document.createElement('p');
                newText.className = 'task-text';
                newText.innerText = inputText.value;
                singleTask.text = inputText.value;
                task.replaceChild(newText, inputText);
                render();
            }
        };
        // delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'delete';
        deleteBtn.id = `${index}`;
        deleteBtn.className = 'delete-btn';
        btnContainer.appendChild(deleteBtn);
        deleteBtn.onclick = () => removeTask(index);

        // appending task to container
        tasksContainer.appendChild(task);
    }); 
}

onChangeCheckbox = (id) => {
    tasksList[id].isChecked = !tasksList[id].isChecked;
    render();
}
removeTask = (id) => {
    tasksList = tasksList.filter( (item, index) => id !== index);
    render();
}
