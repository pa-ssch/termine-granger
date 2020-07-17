import { TestBed, inject } from "@angular/core/testing";
import { DataService } from "./data.service";
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
});

// let rem1 = Object.assign(new Reminder(), { reminderId: 0, taskId: 0, reminderTime: "" });

// let task = Object.assign(new Task(), {
//   taskId: 0,
//   title: "",
//   description: "",
//   startTime: new Date().toISOString(),
//   duration: 0,
//   deadLineTime: "",
//   priority: 1,
//   isBlocker: true,
//   isDoneDate: "",
//   parentId: 0,
// });
