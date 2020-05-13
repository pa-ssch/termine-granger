import { DurationComponent } from "./../../_components/duration/duration.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { InputPageRoutingModule } from "./input-routing.module";

import { InputPage } from "./input.page";
import { DatetimeComponent } from "src/app/_components/datetime/datetime.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, InputPageRoutingModule],
  declarations: [InputPage, DatetimeComponent, DurationComponent],
})
export class InputPageModule {}
