import {SubEntity} from './SubEntity';

export class ProjectLocation extends SubEntity {
	public id: number;
	public countryId: number;
	public districtId: number;
	public percent: number;

	constructor(id: number, countryId: number, districtId: number, percent: number) {
		super();
		this.id = id;
		this.districtId = districtId;
		this.countryId = countryId;
		this.percent = percent;

	}

	public getId(): number {
		return super.getId();
	}


}
