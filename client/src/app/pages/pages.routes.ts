import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './accountSettings/accountSettings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { rxjsComponent } from './rxjs/rxjs.component';

const pagesRoutes: Routes = [
	{
		path: '', 
		component: PagesComponent,
		children: [
			{ path: 'dashboard', component: DashboardComponent, data: {titulo: 'Dashboard'} },
			{ path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'}},
			{ path: 'graficas1', component: Graficas1Component, data: {titulo: 'Gráficas'}},
			{ path: 'accountSettings', component: AccountSettingsComponent, data: {titulo: 'Ajustes'}},
			{ path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
			{ path: 'rxjs', component: rxjsComponent, data: {titulo: 'RxJs'}},
			{ path: '', redirectTo: '/dashboard', pathMatch: 'full'}
		]
	}
];

export const PAGES_ROUTES = RouterModule.forChild ( pagesRoutes );