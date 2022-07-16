function setItem() {
    console.log("Task Added");
}

function onError(error) {
    console.log(error)
}

function clearTasks() {
    browser.storage.sync.remove('tasks')
    console.log("Tasks Cleared!!!")
}

function deleteTask(taskDesc) {
    let current_tasks = browser.storage.sync.get('tasks')
    current_tasks.then((data) => {
        taskList = data.tasks
        tasks = taskList.filter(task => task.taskDesc !== taskDesc)
        browser.storage.sync.set({ tasks }).then(setItem, onError);
    })
}

function displayTasks() {
    let tasks = browser.storage.sync.get('tasks')
    tasks.then((data) => {
        taskList = data.tasks
        if (!taskList) {
            taskList = [];
        }
        let taskListDiv = document.getElementById("taskList");
        taskListDiv.innerHTML = '';
        taskList.forEach((task, idx) => {
            let tag = document.createElement("p");
            tag.innerHTML +=
                `
                <div> ${idx + 1}. ${task.taskDesc}
                    <a href="#" class="delBtn" id="${task.taskDesc}">x</a>
                </div>
                `
            taskListDiv.appendChild(tag);
        })

        delBtns = document.getElementsByClassName("delBtn")
        for (var i = 0; i < delBtns.length; i++) {
            delBtns[i].addEventListener("click", function (e) {
                deleteTask(e.target.id)
            })
        }

    })
    // console.log("Tasks Refreshed.")
}

function addTask() {
    browser.storage.sync.get('tasks')
        .then((data) => {
            tasks = data.tasks
            if (!tasks) {
                tasks = [];
            }
            let taskInput = document.getElementById("todoText")
            if (taskInput.value) {
                let new_task = {
                    taskID: Math.floor(Math.random() * 10000),
                    taskDesc: taskInput.value,
                    isCompleted: false,
                }
                tasks.push(new_task)
                taskInput.value = ''
                browser.storage.sync.set({ tasks }).then(setItem, onError);
            }
        }
        );
}


window.addEventListener('load', displayTasks)
document.getElementById("btnRefresh").addEventListener("click", displayTasks);
document.getElementById("btnAdd").addEventListener("click", addTask);
browser.storage.onChanged.addListener(displayTasks);
document.getElementById("btnClear").addEventListener("click", clearTasks);

document.getElementById("todoText").addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Trigger the button element with a click
        document.getElementById("btnAdd").click();
    }
});