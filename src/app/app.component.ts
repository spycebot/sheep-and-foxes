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
	sheepCount: number = 0;
	flock: Sheep[] = [];
	message: string = "";

	constructor ( private sheepService: SheepService ) { }

	ngOnInit(): void {
		this.getSheep();
	}

	addSheep(): void {
		//this.message = this.message + "Starting addSheep(); ";
		//console.log("AppComponent:addSheep: sheepList" + this.sheepList.toString());
		let newSheep = new Sheep();
		this.sheepCount = this.sheepCount + 1; // old
		/* if (this.sheepList.length > 0) {
			this.message = this.message + "sheepList.length = " + this.sheepList.length + "; ";
			let lastSheep = this.sheepList[length-1];
			let lastID = lastSheep.id;
			//let newSheep = new Sheep();
			newSheep.id = lastID + 1;
			//this.sheepList.push(newSheep);
		} else { */
		newSheep.id = this.flock.length + 1;
		this.flock.push(newSheep);
		this.message = this.message + "Pushed newSheep to flock; ";
	}

	getSheep(): void {
		this.flock = this.sheepService.getSheep();
	}
}
