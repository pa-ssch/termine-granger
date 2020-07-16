import { TestBed, inject } from "@angular/core/testing";
import { DataService } from "./data.service";
import { Reminder } from "./reminder";
import { Task } from "./task";

describe("dataService Testsuite", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService],
    });
  });

  it("Spec: create Datbase", inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();

    service.getChildrenCount(0).then((c) => expect(c).toEqual(0));
  }));

  it("Spec: create Task with Reminders", inject([DataService], (service: DataService) => {
    let task = Object.assign(new Task(), {
      title: "Test Task 1",
      description: "Lorem Ipsum dolor sit amet",
      duration: 0,
      priority: 2,
      isBlocker: true,
      isDoneDate: "",
      parentId: 0,
    });

    let starttime = new Date(task.startTime).getTime();
    // 2 Erinnerungen: 5 und 15 Minuten vor Start
    let remlist = [
      Object.assign(new Reminder(), { reminderTime: new Date(starttime - 60000 * 5).toISOString() }),
      Object.assign(new Reminder(), { reminderTime: new Date(starttime - 60000 * 15).toISOString() }),
    ];
    service.updateTask(task, remlist).then(() => {
      task.taskId = 1;
      service.getTasks(0).then((c) => expect(c?.length).toBe(0));
      service.getTask(1).then((t) => expect(t).toBe(task));
    });
  }));

  it("Spec: update Task", inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
    service.getTask(1).then((task) => {});
  }));

  it("Spec: update Reminder", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: delete Task", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: delete Reminder", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: load Tasklist by startdate", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: load Tasklist by deadline", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: load Tasklist by title", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: load Tasklist by priority", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));
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
