import { Component , OnInit, Input, Output, EventEmitter} from '@angular/core';

import { Sheep } from './sheep';

@Component({
	selector: 'sheep-detail',
	template: `
		<h2>Sheep {{sheep.id}}</h2>
		<table>
			<!-- tr><td>ID:</td><td>{{sheep.id}}</td></tr -->
			<tr><td>Left:</td><td>{{sheep.left}}<td>Top:</td><td>{{sheep.top}}</tr>
			<tr><td>Neighbor:</td><td>{{neighbor.id}}<td>Age:</td><td>{{sheep.age}}</td></tr>
		</table>
		<!-- div id="message">{{message}}</div -->
		<input type="button" value="close" (click)="closeDetail()">
	`,
	styles: [`
	 	:host {
	 	 	position: absolute;
	 	 	top: 36px;
	 	 	left: 36px;
	 	 	width: 220px;
	 	 	background-color: white;
	 	 	border: 2px solid grey;
	 	 	border-radius: 4px;
	 	 	padding: 4px;
	 	}
	 	h2 { 
	 	 	font-size: 1.2em;
	 	 	font-weight: 600;
	 	 	/* border: 1px solid lightgreen; */
	 		margin: 4px 0px;
	 	}
	 	table {
		    border-collapse: collapse;
		}
 	 `]
})

export class SheepDetailComponent implements OnInit {
	@Input() sheep: Sheep;
	@Input() neighbor: Sheep;
  	@Output() onClose = new EventEmitter<boolean>();
  	//close = false;

	message: string = "Welcome!";

	ngOnInit() {

	}

	closeDetail() {
		this.message = "Close not implemented yet."
		this.onClose.emit(true);
		//this.close = true;
	}
}