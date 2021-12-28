import {Injectable} from '@angular/core';
import {Project} from '../model/Project';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	public project: Project;
	public percent: number [];
}
