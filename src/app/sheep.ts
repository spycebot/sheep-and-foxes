export class Sheep {
	id: number;
	left: number;
	top: number;
	age: number;

	constructor() {
		this.id = 0;
		this.left = 0;
		this.top = 0;
		this.age = 0;
	}
}

export const FLOCK: Sheep[] = [];