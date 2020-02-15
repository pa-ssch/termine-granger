import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
  },
  {
    path: "tutorial",
    loadChildren: () =>
      import("./_pages/tutorial/tutorial.module").then(
        m => m.TutorialPageModule
      )
  },
  {
    path: "input/:taskId",
    loadChildren: () =>
      import("./_pages/input/input.module").then(m => m.InputPageModule)
  },
  {
    path: "list/:taskId",
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
