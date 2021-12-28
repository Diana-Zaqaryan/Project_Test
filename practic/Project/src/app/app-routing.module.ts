import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListComponent} from './controls/components/list/list.component';
import {ProjectDetailComponent} from './controls/components/project-detail/project-detail.component';

const routes: Routes = [
	{path: '', component: ListComponent},
	{path: 'project/:id', component: ProjectDetailComponent},
	{path: 'project', component: ProjectDetailComponent},
	{path: '**', redirectTo: ''}

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
