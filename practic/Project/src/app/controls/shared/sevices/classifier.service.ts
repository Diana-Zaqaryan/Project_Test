import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Classifier} from '../model/Classifier';
import {flatMap, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class ClassifierService {
	public sectors$: Observable<Classifier[]>;
	public listOfSectors: Classifier[] = [];
	public statuses$: Observable<Classifier[]>;
	public listOfStatuses: Classifier[] = [];
	public sectorsNames: string[] = [];
	public countryNames: string[] = [];
	public districtNames: string[] = [];

	constructor(public http: HttpClient) {
	}


	public getAllClassifiers(classifierName: string): Observable<Classifier[]> {
		return this.http.get<Classifier[]>('http://localhost:3000/' + classifierName, {responseType: 'json'})
			.pipe(
				flatMap((classifiers: Classifier[]) => {

						const classifiersArr: Classifier[] = [];

						classifiers.forEach((classifier: Object) => {
							classifiersArr.push(new Classifier(classifier['id'], classifier['name']));
						});
						return of(classifiersArr);
					}
				));
	}

	public getClassifierById(classifierName: string, id: number): Observable<Classifier> {
		return this.http.get<Classifier>(`http://localhost:3000/${classifierName}/${id}`, {responseType: 'json'});
	}


}
