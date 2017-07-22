import { Injectable } from '@angular/core';

import { Sheep, FLOCK } from './sheep';

@Injectable()
export class SheepService {
	getSheep(): Sheep[] {
		return FLOCK;
	}
}