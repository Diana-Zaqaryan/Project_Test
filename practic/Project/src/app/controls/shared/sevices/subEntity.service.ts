import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProjectLocation} from '../model/ProjectLocation';
import {map} from 'rxjs/operators';
import {ProjectSector} from '../model/ProjectSector';
import {MainEntityService} from './mainEntity.service';
import {Project} from '../model/Project';
import {SubEntity} from '../model/SubEntity';


@Injectable({
	providedIn: 'root'
})

export class SubEntityService {


	public projectSector: ProjectSector[] = [];
	public projectLocations: ProjectLocation[] = [];


	constructor(public  http: HttpClient, public mainEntity: MainEntityService) {
	}

	public getProjectSectors(id: number) {
		this.projectSector = [];
		this.mainEntity.getProjectById(id).subscribe(
			(val: Project) => {
				this.projectSector = val.sectors;
				return this.projectSector;
			}
		);
	}


	public getProjectLocation(id: number) {
		this.projectLocations = [];
		this.mainEntity.getProjectById(id).subscribe(
			(project: Project) => {
				return this.projectLocations = project.locations;
			}
		);
	}

	public getSubEntities(projectId: number, subEntityCategoryName: string): Observable<SubEntity[]> {
		return this.mainEntity.getProjectById(projectId)
			.pipe(
				map((project: Project) => {
					switch (subEntityCategoryName) {
						case 'ProjectSector': {
							return project.sectors;
						}
						case 'ProjectLocation': {
							return project.locations;
						}
					}
				})
			);
	}


	public postSubEntity(name: string, body: SubEntity) {
		this.http.post(`http://localhost:3000/${name}`, body);
	}


}
