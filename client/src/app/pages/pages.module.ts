import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';

//Temporal
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficodonaComponent } from '../components/graficoDona/graficoDona.component';

@NgModule({
	declarations: [
		PagesComponent,
		DashboardComponent,
    	ProgressComponent,
    	Graficas1Component,
    	IncrementadorComponent,
    	GraficodonaComponent
	],
	exports: [
		PagesComponent,
		DashboardComponent,
    	ProgressComponent,
    	Graficas1Component
	],
	imports : [
		SharedModule,
		PAGES_ROUTES,
		FormsModule,
		ChartsModule
	]
})
export class PagesModule { }