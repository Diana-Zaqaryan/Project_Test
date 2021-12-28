import {SubEntity} from './SubEntity';
import {HttpClient} from '@angular/common/http';
import {flatMap} from 'rxjs/operators';

export class ProjectSector extends SubEntity {
	constructor(public id: number, public sectorId: number, public percent: number) {
		super();
		this.id = id;
		this.sectorId = sectorId;
		this.percent = percent;
	}

	public getId() {
		return this.id;
	}

	public getSectorId() {
		return this.sectorId;
	}

	public getPercent() {
		return this.percent;
	}


}
