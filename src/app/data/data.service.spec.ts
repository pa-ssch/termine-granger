import { uint2 } from "./types/uint2";
import { Task } from "./task";
import { TaskList } from "./taskList";
import { getTasks } from "./requests/getTasks";

describe("Testsuite: taskList.addOrChange", () => {
  it("Spec: Insert Task with wrong Parent", () => {
    // Testdaten
    let tasks = getTestTasks();
    let taskList = new TaskList(0, null, null, null, null);

    let wrongTask = tasks[1];
    wrongTask.parentId = 1;

    // Startbedingung
    expect(taskList.length).toBe(0);

    // Ein korrektes Element einfügen
    TaskList.addOrChange(tasks[0], taskList);
    expect(taskList.length).toBe(1, "Insert of allowed element failed");

    // Ein falsches Element einfügen
    TaskList.addOrChange(wrongTask, taskList);
    expect(taskList.length).toBe(1, "Insert of forbidden element was successful");
  });

  it("Spec: IsDone Changed", () => {
    // Testdaten
    let tasks = getTestTasks();
    let insertTask = tasks.pop();

    let undoneTaskList = new TaskList(0, null, null, null, null);
    tasks.forEach((t) => TaskList.addOrChange(t, undoneTaskList));

    let doneTaskList = new TaskList(0, null, null, null, null);
    Object.assign(doneTaskList, { _displayMode: "done" });
    tasks.forEach((t) => {
      let doneTask = Object.assign(new Task(), t);
      doneTask.isDone = true;
      TaskList.addOrChange(doneTask, doneTaskList);
    });

    // Startbedingung
    expect(undoneTaskList.length).toBe(tasks.length);
    expect(doneTaskList.length).toBe(tasks.length);
    expect(tasks.find((t) => t.taskId == insertTask.taskId)).toBeUndefined();

    // "undone" Aufgabe in "done"-Liste einfügen
    TaskList.addOrChange(insertTask, doneTaskList);
    expect(doneTaskList.length).toBe(tasks.length, "Inserted 'undone'-Task in 'done'-List");

    // "done" Aufgabe in "undone"-Liste einfügen
    insertTask.isDone = true;
    TaskList.addOrChange(insertTask, undoneTaskList);
    expect(undoneTaskList.length).toBe(tasks.length, "Inserted 'done'-Task in 'undone'-List");

    // Aufgabe von "undone" zu "done" aktualisieren
    TaskList.addOrChange(doneTaskList[0], undoneTaskList);
    expect(undoneTaskList.length).toBe(tasks.length - 1, "Change of 'undone'-Task was not successful");

    // Aufgabe von "done" zu "undone" aktualisieren
    TaskList.addOrChange(undoneTaskList[0], doneTaskList);
    expect(doneTaskList.length).toBe(tasks.length - 1, "Change of 'done'-Task was not successful");
  });

  describe("Database index ascending order: IX_TASK_START_DATE", () => {
    it("Spec: Insert Task", () => {
      // Testdaten
      let taskList = new TaskList(0, null, null, null, null);
      Object.assign(taskList, { _indexName: "IX_TASK_START_DATE", _sortAsc: true });
      let tasks = getTestTasks();

      // Startbedingung
      expect(taskList.length).toBe(0);

      // Aufgaben nach und nach einfügen
      tasks.forEach((t) => TaskList.addOrChange(t, taskList));

      // sortierung Prüfen
      for (let i = 0; i < taskList.length - 1; i++)
        expect(taskList[i].startTime.localeCompare(taskList[i + 1].startTime)).toBeLessThanOrEqual(
          0,
          `${taskList[i].startTime} should not be before ${taskList[i + 1].startTime}`
        );
    });

    it("Spec: Update Task", () => {
      // Testdaten
      let taskList = new TaskList(0, null, null, null, null);
      Object.assign(taskList, { _indexName: "IX_TASK_START_DATE", _sortAsc: true });
      let tasks = getTestTasks();
      tasks.forEach((t) => TaskList.addOrChange(t, taskList));

      // Startbedingung
      expect(taskList.length).toBe(tasks.length);

      // Sortierkriterium von Aufgabe ändern
      let updatedTask = Object.assign(new Task(), taskList[0]);
      updatedTask.startTime = taskList[taskList.length - 1].startTime;
      TaskList.addOrChange(updatedTask, taskList);

      // sortierung Prüfen
      for (let i = 0; i < taskList.length - 1; i++)
        expect(taskList[i].startTime.localeCompare(taskList[i + 1].startTime)).toBeLessThanOrEqual(
          0,
          `${taskList[i].startTime} should not be before ${taskList[i + 1].startTime}`
        );
    });
  });
  describe("Database index descending order: IX_TASK_START_DATE", () => {
    it("Spec: Insert Task", () => {});

    it("Spec: Update Task", () => {});
  });

  describe("Database index ascending order: IX_TASK_PRIORITY", () => {
    it("Spec: Insert Task", () => {});

    it("Spec: Update Task", () => {});
  });
  describe("Database index descending order: IX_TASK_PRIORITY", () => {
    it("Spec: Insert Task", () => {});

    it("Spec: Update Task", () => {});
  });

  var getTestTasks = (): Task[] => {
    let task1 = getTestTask(1, "c", "2020-01-01T00:00:00.000Z", "", 1);
    let task2 = getTestTask(2, "CCC", "2020-01-09T00:00:00.000Z", "2020-02-01T00:00:00.000Z", 2);
    let task3 = getTestTask(3, "a", "2020-01-20T00:00:00.000Z", "", 0);
    let task4 = getTestTask(4, "ÿÿ", "2020-01-06T00:00:00.000Z", "", 1);
    let task5 = getTestTask(5, "A", "2020-01-01T00:00:00.000Z", "2020-01-01T00:00:00.000Z", 1);
    let task6 = getTestTask(6, "abc", "2020-01-04T00:00:00.000Z", "", 2);
    let task7 = getTestTask(7, "B", "2020-01-07T00:00:00.000Z", "2021-01-01T00:00:00.000Z", 1);

    return [task1, task2, task3, task4, task5, task6, task7];
  };

  var getTestTask = (
    id: number,
    title: string,
    startTime: string,
    deadlineTime: string,
    priority: uint2
  ): Task => {
    return Object.assign(new Task(), {
      taskId: id,
      title: title,
      startTime: startTime,
      deadLineTime: deadlineTime,
      priority: priority,
    });
  };
});
