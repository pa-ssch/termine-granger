import { TaskComponent } from "./../_components/task/task.component";
import { TaskListComponent } from "./../_components/task-list/task-list.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HomePage } from "./home.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: HomePage,
      },
    ]),
  ],
  declarations: [HomePage, TaskListComponent, TaskComponent],
  exports: [TaskListComponent, TaskComponent],
})
export class HomePageModule {}
