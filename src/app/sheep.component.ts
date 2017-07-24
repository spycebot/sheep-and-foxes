import { Component , OnInit, Input} from '@angular/core';

import { Sheep } from './sheep';
import { SheepService } from './sheep.service';

@Component({
  selector: 'sheep',
  template: `
  	<div class="sheep" [style.left.px]="sl" [style.top.px]="st" (click)="flockStep()">:0) {{sheep.id}}</div>
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
	@Input() pause: boolean;
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
		this.sl = Math.floor(Math.random() * this.fieldMax);
		this.st = Math.floor(Math.random() * this.fieldMax);
		this.sheep.left = this.sl;
		this.sheep.top = this.st;
		this.nearestNeighbor = new Sheep();
		console.log("ngOnInit Sheep " + this.sheep.id + ": nearestNeighbor ID: " + this.nearestNeighbor.id + ": left: " + this.nearestNeighbor.left + ", top: " + this.nearestNeighbor.top);
		this.keepWander();
		this.findNearest(); // Called twice???
	}

	getSheep(): void {
		this.flock = this.sheepService.getSheep();
	}

	wander(): void {
		let dl = Math.floor(Math.random() * 3);
		let dt = Math.floor(Math.random() * 3);
		//this.sl = this.sl - (dl - 1);
		//this.st = this.st - (dt - 1);
		this.moveSheep(this.sl - (dl - 1), this.st - (dt - 1));
		//this.updateSheep();  // -> Confine to moveSheep()
	}

	moveSheep(tl: number, tt: number): void {
		this.sl = tl;
		this.st = tt;
		if (this.sl > 224 ) this.sl = this.fieldMax;
		if (this.st > 224 ) this.st = this.fieldMax;
		if (this.sl < 1 ) this.sl = 1;
		if (this.st < 1 ) this.st = 1;
		this.updateSheep();

	}

	updateSheep(): void {
		this.sheep.left = this.sl;
		this.sheep.top = this.st;
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
		this.updateSheep(); // -> Confine to moveSheep()
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
			//if (this.decide()) {
				//this.wander();
				this.nearestNeighbor = this.findNearest();
				/*
				let candidateSheep = this.findNearest();
				if (candidateSheep && candidateSheep.id > 0) { 
					console.log("Sheep: " + this.sheep.id + ": candidateSheep ID: " + candidateSheep.id);
					this.nearestNeighbor = candidateSheep;
				}
				*/
				this.flockStep();
			//}
			//console.log("SheepComponent:keepWander:wander() called.")
		} else {
			if (this.seconds < 0) { this.seconds = 10; } // reset
				//this.message = `T-${this.seconds} seconds and counting`;
			}
		}, 10);
	}
	
	findNearest0() {
		if (!this.pause) {
			let closestSheep: Sheep;
			if (this.nearestNeighbor.id == 0 ) {	// this.nearestNeighbor && 
				switch (this.sheep.id) {
					case 1: {
						closestSheep = this.flock[1];
						break;
					}
					default: {
						closestSheep = this.flock[0];
						break;
					}
				}
			} else {
				console.log("Sheep " + this.sheep.id + ": this.nearestNeighbor: " + this.nearestNeighbor.id);
				for (let sheepy of this.flock) {
					if (this.sheep.id != sheepy.id && this.nearestNeighbor.id != sheepy.id) {
						let oldDeltaX = +this.sheep.left - +this.nearestNeighbor.left;
						let oldDeltaY = +this.sheep.top - +this.nearestNeighbor.top;
						//let oldDistance = Math.sqrt( oldDeltaX*oldDeltaX + oldDeltaY*oldDeltaY);
						let oldDistance = this.magnitude(oldDeltaX, oldDeltaY);
						let newDeltaX = +this.sheep.left - +sheepy.left;
						let newDeltaY = +this.sheep.top - +sheepy.top;
						//let newDistance = Math.sqrt( newDeltaX*newDeltaX + newDeltaY*newDeltaY);
						let newDistance = this.magnitude(newDeltaX, newDeltaY);
						if (newDistance < oldDistance) { 
							closestSheep = sheepy;
						}
					}
				}
			}
			return closestSheep;
		}
	}

	findNearest() {
		let oldNearest = this.nearestNeighbor;
		let flock = this.flock;
		let newNearest: Sheep = oldNearest; // caused reset of nearestNeighbor: new Sheep();
		//if (!this.pause) console.log("findNearest Sheep " + this.sheep.id + ": oldNearest ID: " + oldNearest.id);
		if (oldNearest.id == 0) {
			if (this.flock.length > 1) {
				switch (this.sheep.id) {
					case 1: { newNearest = this.flock[1];
						break; }
					default: { newNearest = this.flock[0];
						break; }
					}
				//if (!this.pause) console.log("findNearestSheep " + this.sheep.id + ": oldNearest ID was Zero! newNearest is now " + newNearest.id);
			} // else die silently XD
		} else { 
			for (let sheep of flock) {
				//if (!this.pause) console.log("findNearest Sheep " + this.sheep.id + ": target sheep ID: " + sheep.id);
				if (sheep.id != this.sheep.id) {
					//if (!this.pause) console.log ("findNearest Sheep " + this.sheep.id + ": comparable sheep ID: " + sheep.id);
					if (sheep.id != oldNearest.id) {
						/* Assign the first candidate
						newNearest = sheep; */
						// Function does comparision
						newNearest = this.compareSheep(oldNearest, sheep);
						//if (!this.pause) console.log("findNearest Sheep " + this.sheep.id + ": newNearest ID: " + newNearest.id);
					}
				}
			}
		}
		this.message = "Sheep " + this.sheep.id + ": newNearest ID: " + newNearest.id + " nearestNeighbor: " + this.nearestNeighbor.id;
		return newNearest;
	}

	compareSheep(old: Sheep, candidate: Sheep): Sheep {
		let closestSheep: Sheep = new Sheep();
		let oldDeltaX = +this.sheep.left - +old.left;
		let oldDeltaY = +this.sheep.top - +old.top;
		//let oldDistance = Math.sqrt( oldDeltaX*oldDeltaX + oldDeltaY*oldDeltaY);
		let oldDistance = this.magnitude(oldDeltaX, oldDeltaY);
		let newDeltaX = +this.sheep.left - +candidate.left;
		let newDeltaY = +this.sheep.top - +candidate.top;
		//let newDistance = Math.sqrt( newDeltaX*newDeltaX + newDeltaY*newDeltaY);
		let newDistance = this.magnitude(newDeltaX, newDeltaY);
		if (!this.pause) console.log("compareSheep Sheep " + this.sheep.id + ": newDistance: " + newDistance + " (" + candidate.id + "), oldDistance: " + oldDistance + " (" + old.id + ")");
		if (newDistance < oldDistance) { 
			closestSheep = candidate;
		} else {
			closestSheep = old;
		}
		return closestSheep;
	}

	flockStep(): void {
		if (!this.pause) {
			if (this.nearestNeighbor.id != 0) {
				//console.log(this.sheep.id + ":SheepComponent:flockStep: this.sheep.left: " + this.sheep.left + "; nearestNeighbor left: " + this.nearestNeighbor.left);
				let deltaX = +this.sheep.left - +this.nearestNeighbor.left;
				let deltaY = +this.sheep.top - +this.nearestNeighbor.top;
				let distance = this.magnitude(deltaX, deltaY);
				let nX = this.qnormal( deltaX );
				let nY = this.qnormal( deltaY );
				this.message = "Sheep " + this.sheep.id + ": NN: " + this.nearestNeighbor.id + ", nX " + nX + ", nY " + nY + "." + "; " + deltaX + ", " + deltaY + "; distance: " + distance + ".";
				if (distance > 40) {
					//this.sl = this.sl - nX;
					//this.st = this.st - nY;
					this.moveSheep(this.sl - nX, this.st - nY)
				} else if (distance < 30) {
					//this.sl = this.sl + nX;
					//this.st = this.st + nY;
					this.moveSheep(this.sl + nX, this.st + nY)

				} else {
					this.wander();
				}
			}
		}
	}

	magnitude(x: number, y: number): number {
		let d: number = 0;
		d = Math.sqrt(x*x + y*y);
		//if (!this.pause) console.log("SheepComponent:magnitude Sheep: " + this.sheep.id + " x " + x + " y " + y + " d " + d);
		return d;
	}

	qnormal(d: number) {
		let v: number;
		if (d > 0.333) { v = 1; 
		} else { if (d < -0.333) { v = -1;
			} else { v = 0 }}
		return v;
	}
}