export class Sheep {
	id: number;
	left: number;
	top: number;

	constructor() {
		this.id = 0;
		this.left = 0;
		this.top = 0;
	}
}

export const FLOCK: Sheep[] = [];