import {Entity} from './Entity';
import {ProjectSector} from './ProjectSector';
import {ProjectLocation} from './ProjectLocation';
import {el} from '@angular/platform-browser/testing/src/browser_util';

export class Project extends Entity {
	public static getProjectMode(obj: Object): Project {
		if (obj) {
			const sectors: ProjectSector[] = [];
			const locations: ProjectLocation[] = [];

			obj['sectors'].forEach((projectSector: ProjectSector) => {
				sectors.push(new ProjectSector(projectSector.id, projectSector.sectorId, projectSector.percent));
			});
			obj['locations'].forEach((location: ProjectLocation) => {
				locations.push(new ProjectLocation(location.id, location.countryId, location.districtId, location.percent));

			});


			const endDate: Date = obj['endDate'] ? new Date(obj['endDate']) : null;

			return new Project(
				obj['id'],
				obj['projectCode'],
				obj['projectTitle'],
				obj['description'],
				obj['statusId'],
				new Date(obj['startDate']),
				endDate,
				obj['duration'],
				sectors,
				locations
			);
		}
	}

	public id: number;
	public projectCode: string;
	public projectTitle: string;
	public description: string;
	public statusId: number;
	public startDate: Date;
	public endDate: Date;
	public duration?: number;
	public sectors: ProjectSector[];
	public locations: ProjectLocation[];


	constructor(
		id: number,
		projectCode: string,
		projectTitle: string,
		description: string,
		statusId: number,
		startDate: Date,
		endDate: Date,
		duration: number,
		sectors: ProjectSector[],
		locations: ProjectLocation[]
	) {
		super();
		this.id = id;
		this.projectCode = projectCode;
		this.projectTitle = projectTitle;
		this.description = description;
		this.statusId = statusId;
		this.startDate = startDate;
		this.endDate = endDate;
		this.duration = duration ? duration : this.calculateDiff(this.startDate, this.endDate);
		this.sectors = sectors;
		this.locations = locations;

	}


	public getId(): number {
		return this.id;
	}

	public calculateDiff(startDate, endDate) {

		startDate = new Date(startDate);
		endDate = new Date(endDate);

		if (startDate && endDate) {
			return Math.floor(
				(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
					- Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / (1000 * 60 * 60 * 24));
		} else {
			return null;
		}
	}

}
