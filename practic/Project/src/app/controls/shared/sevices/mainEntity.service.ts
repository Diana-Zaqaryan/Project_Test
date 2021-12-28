import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Project} from '../model/Project';
import {catchError, flatMap, map, retry, tap} from 'rxjs/operators';
import construct = Reflect.construct;
import {ProjectSector} from '../model/ProjectSector';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {Classifier} from '../model/Classifier';
import {throwError} from 'rxjs/internal/observable/throwError';


@Injectable({
	providedIn: 'root'
})
export class MainEntityService {
	public projects$: Observable<Project[]>;
	public projectList: Project[] = [];
	public projectById: Project;
	public sectors$: Observable<Classifier[]>;
	public sectorList: Classifier[] = [];

	constructor(public http: HttpClient) {
	}

	public httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};

	public handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` +
				`body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		return throwError(
			'Something bad happened; please try again later.');
	}


	public getProjects() {
		return this.http.get<Project[]>('http://localhost:3000/project')
			.pipe(
				flatMap((projects: Project[]) => {
						this.projectList = [];
						if (projects) {
							projects.forEach((obj: Project) => {
								if (obj) {
									this.projectList.push(Project.getProjectMode(obj));
								}
							});

							this.projects$ = of(this.projectList);
							return this.projects$;
						}
					}
				)
			);

	}


	public getProjectById(projectId: number): Observable<Project> {

		const Url = `http://localhost:3000/project/${projectId}`;
		return this.http.get<Project>(Url).pipe(
			map((project: Object) => Project.getProjectMode(project))
		);
	}

	public createProject(project): Observable<Project> {
		return this.http
			.post<Project>(`http://localhost:3000/project`, JSON.stringify(project), this.httpOptions)
			.pipe(
				catchError(this.handleError)
			);
	}

	public updateProject(projectId, project): Observable<Project> {
		return this.http
			.put<Project>(`http://localhost:3000/project/${projectId}`, JSON.stringify(project), this.httpOptions)
			.pipe(
				catchError(this.handleError)
			);
	}


	public deleteProject(projectId) {
		return this.http
			.delete<void>(`http://localhost:3000/project/${projectId}`, this.httpOptions);
	}

}
