import { Component } from '@angular/core';

class Sheep {
	id: number;

	constructor() {
		this.id = 0;
	}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'Sheep and Foxes';
	sheepCount: number = 0;
	sheepList: Sheep[] = [];
	message: string = "";

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
		newSheep.id = this.sheepList.length + 1;
		this.sheepList.push(newSheep);
		this.message = this.message + "Pushed newSheep to sheepList; ";
	}
}
