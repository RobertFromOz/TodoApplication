import { Routes } from '@angular/router';
import { CreateComponent as CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

export const routes: Routes = [
    {path: '', redirectTo: '/list', pathMatch: 'full'},
    {path: 'list', component: ListComponent}, // see all
    {path: 'todo/create', component: CreateComponent}, // new task
    {path: 'todo/:parentId/create', component: CreateComponent}, // new sub task under id
    {path: 'todo/:id', component: ViewComponent}, // view task
    
];
