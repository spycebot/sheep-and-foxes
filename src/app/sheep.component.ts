import { Component , OnInit} from '@angular/core';

@Component({
  selector: 'sheep',
  template: `
  	<div class="sheep" [style.left.px]="sl" [style.top.px]="st" (click)="hop()">:0)</div>
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
    	transform: rotate(90deg);
 	 };
  `]
})
export class SheepComponent implements OnInit {
	sl: number;
	st: number;
	intervalID = 0;
	message = '';
	seconds = 11;
	fieldMin = 1;
	fieldMax = 224;

	ngOnInit() {
		this.sl = Math.floor(Math.random() * this.fieldMax);
		this.st = Math.floor(Math.random() * this.fieldMax);
		this.keepWander();
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
	}

	hop(): void {
		let outp = 'Hop! from ' + this.sl + ', ' + this.st;
		let dl = Math.floor(Math.random() * 6);
		let dt = Math.floor(Math.random() * 6);
		let hl = (dl - 3) * 20;
		let ht = (dt - 3) * 20;
		if (this.sl + hl > this.fieldMax) { 
			this.sl = this.fieldMax;
		} else { 
			if (this.sl + hl < 1) { this.sl = 1; 
			} else {
				this.sl = this.sl + hl; 
			}
		}
		if (this.st + ht > this.fieldMax) { 
			this.st = this.fieldMax; 
		} else { 
			if (this.st - ht < 1) { this.st = 1;
			} else { 
				this.st = this.st + ht; 
			}
		}
		/*
		} else { this.sl = this.sl - hl; }
		if (this.st - ht < 1) { this.st = 1;  
		} else { this.st = this.st - ht; }
		*/
		outp = outp + ' to ' + this.sl + ', ' + this.st + '; hl: ' + hl;
		//this.message = outp;
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
			if (this.decide()) this.wander();
			console.log("SheepComponent:keepWander:wander() called.")
		} else {
			if (this.seconds < 0) { this.seconds = 10; } // reset
				//this.message = `T-${this.seconds} seconds and counting`;
			}
		}, 100);
	}
	/*
	sl: number = Math.floor(Math.random() * 235);
	st: number = Math.floor(Math.random() * 235);
	//console.log("SheepComponent: sl: " + this.sl);
	sheep_left: string = this.sl + "px";
	sheep_top: string = "25px";
	*/

}
