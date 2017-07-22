import { Component , OnInit, Input} from '@angular/core';

import { Sheep } from './sheep';
import { SheepService } from './sheep.service';

@Component({
  selector: 'sheep',
  template: `
  	<div class="sheep" [style.left.px]="sl" [style.top.px]="st" (click)="hop()">:0) {{sheep.id}}</div>
  	<div>{{message}}</div>
  `,
  styles: [`
 	.sheep { 
 		border: 2px solid grey;
 		border-radius: 4px;
 		background-color: white;
 		width: 32px;
 		height: 32px;
 		color: grey;
 		position: absolute;
    	/* transform: rotate(90deg); */
 	 };
  `]
})
export class SheepComponent implements OnInit {
	@Input() sheep: Sheep;
	sl: number;
	st: number;
	intervalID = 0;
	message = '';
	seconds = 11;
	fieldMin = 1;
	fieldMax = 224;
	nearestNeighbor: Sheep;
	flock: Sheep[] = [];

	constructor ( private sheepService: SheepService ) { }

	ngOnInit() {
		this.getSheep();
		this.sheep.left = this.sl;
		this.sheep.top = this.st;
		this.sl = Math.floor(Math.random() * this.fieldMax);
		this.st = Math.floor(Math.random() * this.fieldMax);
		this.keepWander();
		this.findNearest();
	}

	getSheep(): void {
		this.flock = this.sheepService.getSheep();
	}

	wander(): void {
		let dl = Math.floor(Math.random() * 3);
		let dt = Math.floor(Math.random() * 3);
		this.sl = this.sl - (dl - 1);
		this.st = this.st - (dt - 1);
		if (this.sl > 224 ) this.sl = this.fieldMax;
		if (this.st > 224 ) this.st = this.fieldMax;
		if (this.sl < 1 ) this.sl = 1;
		if (this.st < 1 ) this.st = 1;
		this.updateSheep();
	}

	hop(): void {
		let outp = 'Hop! from ' + this.sl + ', ' + this.st;
		let dl = Math.floor(Math.random() * 6);
		let dt = Math.floor(Math.random() * 6);
		let hl = (dl - 3) * 20;
		let ht = (dt - 3) * 20;
		if (this.sl + hl > this.fieldMax) { this.sl = this.fieldMax;
		} else { if (this.sl + hl < 1) { this.sl = 1;
			} else { this.sl = this.sl + hl }
		}
		if (this.st + ht > this.fieldMax) { 
			this.st = this.fieldMax 
		} else { if (this.st - ht < 1) { this.st = 1;
			} else { this.st = this.st + ht }
		}
		/*
		} else { this.sl = this.sl - hl; }
		if (this.st - ht < 1) { this.st = 1;  
		} else { this.st = this.st - ht; }
		*/
		outp = outp + ' to ' + this.sl + ', ' + this.st + '; hl: ' + hl;
		//this.message = outp;
		this.updateSheep();
	}

	decide(): boolean {
		let c = Math.random();
		if (c > 0.5) return true;
		else return false;
	}

	clearTimer() { clearInterval(this.intervalID); }

	private keepWander() {
		this.clearTimer();
		this.intervalID = window.setInterval(() => {
			this.seconds -= 1;
		if (this.seconds === 0) {
			//this.message = 'Blast off!';
			if (this.decide()) {
				this.wander();
				this.nearestNeighbor = this.findNearest();
			}
			//console.log("SheepComponent:keepWander:wander() called.")
		} else {
			if (this.seconds < 0) { this.seconds = 10; } // reset
				//this.message = `T-${this.seconds} seconds and counting`;
			}
		}, 100);
	}
	
	findNearest(): Sheep {
		let closestSheep = new Sheep();
		if (!this.nearestNeighbor) {
			if (this.sheep.id != this.flock[0].id) {
				this.nearestNeighbor = this.flock[0];
				this.message = this.sheep.id + 
				"; Flock length: " + 
				this.flock.length +
				"; NN: " +
				this.nearestNeighbor.id;
			}
			/*
			": No nearest neighbor! " + 
			this.flock[0].id + 
			" is first in flock. New nearest neighbor: " 
			+ this.nearestNeighbor.id;
			*/
		} else {
			for (let sheep of this.flock) {
				if (this.sheep.id != sheep.id) {
					let oldDeltaX = +this.sheep.left - +this.nearestNeighbor.left;
					let oldDeltaY = +this.sheep.top - +this.nearestNeighbor.top;
					let oldDistance = Math.sqrt( oldDeltaX*oldDeltaX + oldDeltaY*oldDeltaY);
					let newDeltaX = +this.sheep.left - +sheep.left;
					let newDeltaY = +this.sheep.top - +sheep.top;
					let newDistance = Math.sqrt( newDeltaX*newDeltaX + newDeltaY*newDeltaY);
					if (newDistance < oldDistance) { 
						closestSheep = sheep; 
					} else { 
						closestSheep = this.nearestNeighbor; 
					}
					this.message = this.sheep.id + ": oldDistance: " + Math.round(oldDistance) + "; newDistance: " + Math.round(newDistance) + ": closestSheep: " + closestSheep.id;
					//this.message = this.sheep.id + ": newDistance: " + newDistance + "; compare sheep: " + sheep.id;
				}
			}
		}
		return closestSheep;
	}

	updateSheep(): void {
		this.sheep.left = this.sl;
		this.sheep.top = this.st;
	}
}
