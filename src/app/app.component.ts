import { Component, OnInit } from '@angular/core';

import { Sheep } from './sheep';
import { SheepService } from './sheep.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ SheepService ]
})

export class AppComponent implements OnInit{
	title = 'Sheep and Foxes';
	flock: Sheep[] = [];
	message: string = "";
	newSheepCount: number = 1;
	pause: boolean = false;
	//intervalID = 0;

	constructor ( private sheepService: SheepService ) { }

	ngOnInit(): void {
		this.getSheep();
	}

	addSheep(): void {
		//this.message = this.message + "Starting addSheep(); ";
		//console.log("AppComponent:addSheep: sheepList" + this.sheepList.toString());
		let newSheep = new Sheep();
		newSheep.id = this.flock.length + 1;
		this.flock.push(newSheep);
		// OK this.message = this.message + "Pushed newSheep to flock; ";
	}

	addFlock(c: number) {
		console.log("AppComponent:addFlock:c:" + c);
		var flock: Sheep[] = [];
		for (var i = 1; i <= c; i++) {
			let newSheep = new Sheep(); 
			let lastSheep: Sheep;
			if (this.flock.length > 0) {
				lastSheep = this.flock[this.flock.length - 1];
				newSheep.id = +lastSheep.id + 1;
			} else {
				newSheep.id = 1;
			}
			//newSheep.id = this.flock.length + 1;
			//newSheep.id = this.flock[length - 1].id + 1;
			flock.push(newSheep);
			// the great redundancy
			this.flock.push(newSheep);
		}
		this.newSheepCount = 1;
		// 'kill flock' return flock;
	} 

	getSheep(): void {
		this.flock = this.sheepService.getSheep();
	}

	togglePause() {
		this.pause = !this.pause;
	}

	onLamb(yew: Sheep) {
		if (yew.age < 36) {
			this.addFlock(1);
		} /* else {
			let pos: number = this.flock.indexOf(yew);
			this.message = "Yew " + yew.id + " died in position " + pos + "."; 
		} */
		//this.message = "Yew " + yew.id + " had a lamb at " + yew.left + ", " + yew.top;
	}

	onDie(sheep: Sheep) {
		let pos: number = this.flock.indexOf(sheep);
		this.message = "Sheep " + sheep.id + " died... at array position " + pos;
		this.flock.splice(pos, 1);
	}
}
