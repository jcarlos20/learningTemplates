import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-graficoDona',
	templateUrl: 'graficoDona.component.html',
	styles: []
})

export class GraficodonaComponent implements OnInit{
	@Input() leyenda: string = '';
	@Input() chartLabels:string[] = [];
	@Input() chartData:number[] = [];
	@Input() chartType:string = '';

	constructor(){

	}

	ngOnInit(){

	}
}