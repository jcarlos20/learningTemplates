import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
	selector: 'app-rxjs',
	templateUrl: './rxjs.component.html',
	styles:[]
})

export class rxjsComponent implements OnInit, OnDestroy {

	subs: Subscription;

	constructor(){
		
		this.subs = this.contarDos()
		//.pipe(
		//	retry(2)
		//)
		.subscribe(
			mensaje => console.log('Subs', mensaje),
			error => console.log('Error en el obs', error),
			() => console.log('El observador termino')
		);
	}

	ngOnInit(){
	}

	ngOnDestroy(){
		console.log('Cerrando rxjs');
		this.subs.unsubscribe();
	}

	contarDos(){
		let obs = new Observable(observer => {
			let contador = 0;
			let intervalo = setInterval(() => {
				contador += 1;

				let salida = {
					valor: contador
				};

				observer.next(contador);
				//if (contador === 3) {
				//	clearInterval(intervalo);
				//	observer.complete();
				//}

				//if (contador ===2) {
				//	clearInterval(intervalo);
				//	observer.error('Auxilio');
				//}
			}, 1000);
		});

		/*
		.pipe(
			map (resp => resp.valor),
			filter ( (valor, index ) => {
				if ((valor % 2) ===1 ) {
					return true;
				}else{
					return false;
				}
				return true;
			})
		);
		*/

		return obs;
	}
}