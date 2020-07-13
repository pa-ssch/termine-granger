import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then((m) => m.HomePageModule),
  },
  {
    // Eingabeseite für konkreten task öffnen
    path: "input/:taskId",
    loadChildren: () => import("./_pages/input/input.module").then((m) => m.InputPageModule),
  },
  {
    // Sub-Task-Liste zu einem Parent anzeigen
    path: "list/:taskId",
    loadChildren: () => import("./_pages/list/list.module").then((m) => m.ListPageModule),
  },
  {
    // Eingabeseite öffnen, mit Angabe des Parents (falls der zu bearbeitende Task noch nicht existiert)
    path: "input/:taskId/:parentTaskId",
    loadChildren: () => import("./_pages/input/input.module").then((m) => m.InputPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
