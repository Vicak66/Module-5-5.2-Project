var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
    var taskLi = $("<li>").addClass("list-group-item");
    var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(taskDate);
    var taskP = $("<p>").addClass("m-1").text(taskText);

    taskLi.append(taskSpan, taskP);

    $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
    tasks = JSON.parse(localStorage.getItem("tasks"));

    if (!tasks) {
        tasks = {
            toDo: [],
            inProgress: [],
            inReview: [],
            done: [],
        };
    }

    $.each(tasks, function(list, arr) {
        console.log(list, arr);
        arr.forEach(function(task) {
            createTask(task.text, task.date, list);
        });
    });
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

$("task-form-modal").on("show.bs.modal", function() {
    $("#modalTaskDescription, #modalDueDate").val("");
});

$("#task-form-modal").on("shown.bs.modal", function() {
    $("#modalTaskDescription").trigger("focus");
});

$("#task-form-modal .btn-primary").click(function() {

    var taskText = $("#modalTaskDescription").val();
    var taskDate = $("#modalDueDate").val();

    if (taskText && taskDate) {
        createTask(taskText, taskDate, "toDo");

        $("#task-form-modal").modal("hide");

        tasks,toDo.push({
            text: taskText,
            date: taskDate
        });

        saveTasks();
    }
});

// task text was clicked
$(".list-group").on("click", "p", function() {
    // get current text of p element
    var text = $(this)
        .text()
        .trim();

    // replace p element with a new textarea
    var textInput = $("<textarea>").addClass("form-control").val(text);
    $(this).replaceWith(textInput);

    // auto focus new element
    textInput.trigger("focus");
});

// editable field was un-focused
$(".list-group").on("blur", "textarea", function() {
    // get current value of textarea
    var text = $(this).val();

    // get status type and position in the list
    var status = $(this)
        .closest(".list-group")
        .attr("id")
        .replace("list-", "");
    var index = $(this)
        .closest(".list-group-item")
        .index();

    // update task in array and re-save to localstorage 
    tasks[status][index].text = text;
    saveTasks();

    // recreate p element
    var taskP = $("<p>")
        .addClass("m-1")
        .text(text);

    // replace textarea with new conten
    $(this).replaceWith(taskP);
});

// due date was clicked
$(".list-group").on("click", "span", function() {
    // get date was click 
    var date = $(this)
        .text()
        .trim();

    // create new input element
    var dateInpt = $("<input>")
        .attr("type", "text")
        .addClass("form-control")
        .val(date);
    $(this).replaceWith(dateInpt);

    // automatically bring up the calendar
    dateInpt.trigger("focus");
});

$(".list-group").on("blur", "input[type='text']", function() {
    var date = $(this).val();

    // get status type and position in the list
    var status = $(this)
        .closest(".list-group")
        .attr("id")
        .replace("list-", "");
    var index = $(this)
        .closest(".list-group-item")
        .index();

    // update task in array and re-save to localstorage
    tasks[status][index].date = date;
    saveTasks();

    // recreate span and insert in place of input element
    var taskSpan = $("<span>")
        .addClass("badge badge-primary badge-pill")
        .text(date);
        $(this).replaceWith(taskSpan);
});

// remove all tasks
$("#remove-tasks").on("click", function() {
    for (var key in tasks) {
        tasks[key].length = 0;
        $("#list-" + key).empty();
    }
    saveTasks();
});

// load tasks for the first time
loadTasks();
