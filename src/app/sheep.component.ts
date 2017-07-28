import { Component , OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Sheep } from './sheep';
import { SheepService } from './sheep.service';

@Component({
  selector: 'sheep',
  template: `
  	<div class="sheep" [style.left.px]="sl" [style.top.px]="st" (click)="toggleDetail()">
	  	<span *ngIf="alive">:0)</span>
	  	<span *ngIf="!alive">X</span> 
	  	{{sheep.id}}
  	</div>
  	<div>{{message}}</div>
  	<div class="sheepDetail" *ngIf="showDetail">
  		<!-- h2>Sheep {{sheep.id}}</h2 -->
  		<sheep-detail [style.zIndex]="10" [sheep]="sheep" [neighbor]="nearestNeighbor" (onClose)="onClose($event)"></sheep-detail>
  	</div>
  `,
  styles: [`
  	:host { 
    	font-size: 0.8em; 
    }
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
	@Output() onLamb = new EventEmitter<Sheep>();
	@Output() onDie = new EventEmitter<Sheep>();
	sl: number;
	st: number;
	intervalID = 0;
	message = '';
	seconds = 11;
	fieldMin = 1;
	fieldMax = 224;
	nearestNeighbor: Sheep;
	flock: Sheep[] = [];
	// New Order
	gridSize = 32;
	showDetail: boolean = false;
	alive: boolean = false;

	constructor ( private sheepService: SheepService ) { }

	ngOnInit() {
		this.getSheep();
		//this.sl = Math.floor(Math.random() * this.fieldMax);
		//this.st = Math.floor(Math.random() * this.fieldMax);
		this.sl = this.gridSize * Math.floor(Math.random() * 10);
		this.st = this.gridSize * Math.floor(Math.random() * 10);
		this.sheep.left = this.sl;
		this.sheep.top = this.st;
		this.nearestNeighbor = new Sheep();
		//console.log("ngOnInit Sheep " + this.sheep.id + ": nearestNeighbor ID: " + this.nearestNeighbor.id + ": left: " + this.nearestNeighbor.left + ", top: " + this.nearestNeighbor.top);
		this.alive = true;
		this.repeatBehavior();
		this.findNearest(); // Called twice???
	}

	getSheep(): void {
		this.flock = this.sheepService.getSheep();
	}

	wander(): void {
		let dl = Math.round(Math.random() * 2);
		let dt = Math.round(Math.random() * 2);
		//let cl = this.sl - (32 * (dl - 2));
		//let ct = this.st - (32 * (dt - 2));
		let cl = 32 * (dl - 1);
		let ct = 32 * (dt - 1);
		this.moveSheep(this.sl - cl, this.st - ct);
		//console.log("Sheep " + this.sheep.id + " wandered " + cl + ", " + ct + ". dl="+dl+", dt="+dt);
	}

	moveSheep(tl: number, tt: number): void {
		// Rememver there is teh dom element and the js object
		// generally adjust this.sheep.top
		// only adjust st when it is equal to a rounded up value
		// Currently the component variable is what is set, synched under update sheep
		// A massive rewiring, so that the state updates the object, and the display is only updated conditionally
		this.sl = tl;
		this.st = tt;
		if (this.sl > 224 ) {
			this.sl = this.fieldMax;
		}
		if (this.st > 224 ) {
			this.st = this.fieldMax;
		}
		if (this.sl < 1 ) {
			this.sl = 1;
		}
		if (this.st < 1 ) {
			this.st = 1;
		}
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

	decide(c): boolean {
		if (!c) c = 0.5;
		let v = Math.random();
		if (v > c) return true;
		else return false;
		//console.log("Sheep " + this.sheep.id + ": decide c: " + c);
	}

	clearTimer() { clearInterval(this.intervalID); }

	private repeatBehavior() {
		this.clearTimer();
		this.intervalID = window.setInterval(() => {
			this.seconds -= 1;
		if (this.seconds === 2) {
			this.nearestNeighbor = this.findNearest();

		}
		if (this.seconds === 0) {
			this.sheep.age = this.sheep.age + 1;
			if (this.sheep.age == 12 ) { // || this.sheep.age == 24) {
				//this.message = "Sheep " + this.sheep.id + " lambed at age " + this.sheep.age + "!";
				this.onLamb.emit(this.sheep);
			}
			if (this.sheep.age > 36) {
				this.message = "Sheep " + this.sheep.id + " died at age " + this.sheep.age + "!";
				this.killSheep();
			}
			if (this.sheep.age > 48) {
				this.onDie.emit(this.sheep);
			}
			//this.wander();
			/* COMPARING AND MOVING SHOULD BE DONE AT DIFFERENT TIMES */
			//this.nearestNeighbor = this.findNearest();
			this.flockStep();
			//console.log("SheepComponent:repeatBehavior:wander() called.")
		} else {
			if (this.seconds < 0) { this.seconds = (Math.round(Math.random() * 10)) + 5; } // reset
				//this.message = `T-${this.seconds} seconds and counting`;
			}
		}, 500);
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
				//Deliberate exclusion from comparsion is meant to always prefer other sheep
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
		// OK this.message = "Sheep " + this.sheep.id + ": newNearest ID: " + newNearest.id + " nearestNeighbor: " + this.nearestNeighbor.id;
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
		// OK if (!this.pause) console.log("compareSheep Sheep " + this.sheep.id + ": newDistance: " + newDistance + " (" + candidate.id + "), oldDistance: " + oldDistance + " (" + old.id + ")");
		if (newDistance < oldDistance) { 
			closestSheep = candidate;
		} else {
			closestSheep = old;
		}
		return closestSheep;
	}

	flockStep(): void {
		if (!this.pause && this.alive) {
			if (this.nearestNeighbor.id != 0) {
				//console.log(this.sheep.id + ":SheepComponent:flockStep: this.sheep.left: " + this.sheep.left + "; nearestNeighbor left: " + this.nearestNeighbor.left);
				let deltaX = +this.sheep.left - +this.nearestNeighbor.left;
				let deltaY = +this.sheep.top - +this.nearestNeighbor.top;
				let distance = this.magnitude(deltaX, deltaY);
				let nX = this.qnormal( deltaX );
				let nY = this.qnormal( deltaY );
				//this.message = "Sheep " + this.sheep.id + ": Pos: " + this.sheep.left + "," + this.sheep.top+ ", NN: " + this.nearestNeighbor.id + ", nX " + nX + ", nY " + nY + "." + "; Delta: " + deltaX + ", " + deltaY + "; distance: " + Math.round(distance) + ".";
				if (distance > this.gridSize * 2) {
					//this.sl = this.sl - nX;
					//this.st = this.st - nY;
					this.moveSheep(this.sl - nX, this.st - nY)
				} else if (distance < this.gridSize) {
					if (distance == 0) { this.wander(); }
					else { this.moveSheep(this.sl + nX, this.st + nY); }
					//this.sl = this.sl + nX;
					//this.st = this.st + nY;

				} else {
					if (this.decide(0.01)) this.wander();
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
		if (d > 0.333) { v = this.gridSize; 
		} else { if (d < -0.333) { v = -this.gridSize;
			} else { v = 0 }}
		return v;
	}

	toggleDetail() {
		this.showDetail = !this.showDetail;
	}

	onClose() {
		this.showDetail = false;
	}

	killSheep() {
		this.alive = false;
	}
}