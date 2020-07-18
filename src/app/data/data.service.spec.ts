import { uint2 } from "./types/uint2";
import { Reminder } from "./reminder";
import { Task } from "./task";

describe("Testsuite: taskList.addOrChange", () => {
  it("Spec: Insert Task with wrong Parent", () => {
    // ...
  });

  it("Spec: IsDone Changed", () => {
    // ...
  });

  describe("Database index ascending order: IX_TASK_START_DATE", () => {
    it("Spec: Insert Task", () => {
      // ...
    });

    it("Spec: Update Task", () => {
      // ...
      // test sort value changed (je index)
      // test changed but not sortcriteria (je index)
    });
  });
  describe("Database index descending order: IX_TASK_START_DATE", () => {
    it("Spec: Insert Task", () => {
      // ...
    });

    it("Spec: Update Task", () => {
      // ...
      // test sort value changed (je index)
      // test changed but not sortcriteria (je index)
    });
  });

  describe("Database index ascending order: IX_TASK_DEADLINE", () => {
    it("Spec: Insert Task", () => {
      // ...
    });

    it("Spec: Update Task", () => {
      // ...
      // test sort value changed (je index)
      // test changed but not sortcriteria (je index)
    });
  });
  describe("Database index descending order: IX_TASK_DEADLINE", () => {
    it("Spec: Insert Task", () => {
      // ...
    });

    it("Spec: Update Task", () => {
      // ...
      // test sort value changed (je index)
      // test changed but not sortcriteria (je index)
    });
  });

  describe("Database index ascending order: IX_TASK_TITLE", () => {
    it("Spec: Insert Task", () => {
      // ...
    });

    it("Spec: Update Task", () => {
      // ...
      // test sort value changed (je index)
      // test changed but not sortcriteria (je index)
    });
  });
  describe("Database index descending order: IX_TASK_TITLE", () => {
    it("Spec: Insert Task", () => {
      // ...
    });

    it("Spec: Update Task", () => {
      // ...
      // test sort value changed (je index)
      // test changed but not sortcriteria (je index)
    });
  });

  describe("Database index ascending order: IX_TASK_PRIORITY", () => {
    it("Spec: Insert Task", () => {
      // ...
    });

    it("Spec: Update Task", () => {
      // ...
      // test sort value changed (je index)
      // test changed but not sortcriteria (je index)
    });
  });
  describe("Database index descending order: IX_TASK_PRIORITY", () => {
    it("Spec: Insert Task", () => {
      // ...
    });

    it("Spec: Update Task", () => {
      // ...
      // test sort value changed (je index)
      // test changed but not sortcriteria (je index)
    });
  });

  var getTestTasks = (): Task[] => {
    let task1 = getTestTask(1, "c", "!", "", 1);
    let task2 = getTestTask(2, "CCC", "!", "!", 2);
    let task3 = getTestTask(3, "a", "!", "", 0);
    let task4 = getTestTask(4, "ÿÿ", "!", "", 1);
    let task5 = getTestTask(5, "A", "!", "!", 1);
    let task6 = getTestTask(6, "abc", "!", "", 2);
    let task7 = getTestTask(7, "B", "!", "!", 1);

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
