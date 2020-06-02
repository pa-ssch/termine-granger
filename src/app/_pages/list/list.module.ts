import { HomePageModule } from "./../../home/home.module";
import { TaskComponent } from "./../../_components/task/task.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ListPageRoutingModule } from "./list-routing.module";

import { ListPage } from "./list.page";
import { TaskListComponent } from "src/app/_components/task-list/task-list.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ListPageRoutingModule, HomePageModule],
  declarations: [ListPage],
})
export class ListPageModule {}
