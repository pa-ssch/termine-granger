import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "tutorial", pathMatch: "full" },
  {
    path: "home/:taskId",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
  },
  {
    path: "input",
    loadChildren: () =>
      import("./_pages/input/input.module").then(m => m.InputPageModule)
  },
  {
    path: "tutorial",
    loadChildren: () =>
      import("./_pages/tutorial/tutorial.module").then(
        m => m.TutorialPageModule
      )
  },
  {
    path: "list",
    loadChildren: () =>
      import("./_pages/list/list.module").then(m => m.ListPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
