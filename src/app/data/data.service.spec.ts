import { TestBed, async, inject } from "@angular/core/testing";
import { DataService } from "./data.service";

describe("dataService Testsuite", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService],
    });
  });

  it("Spec: create Datbase", inject([DataService], (service: DataService) => {
    // expect(service).toBeTruthy();
  }));

  it("Spec: create Task with Reminders", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: update Task", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
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

  it("Spec: load Tasklist complete", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: load Tasklist fragmented", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: search Task by Name", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: search Task by Priority", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: test reminder integrity", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));

  it("Spec: test task integrity", inject([DataService], (service: DataService) => {
    //expect(service).toBeTruthy();
  }));
});
