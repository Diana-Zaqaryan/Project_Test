import {Pipe, PipeTransform} from '@angular/core';
import {Classifier} from '../model/Classifier';
import {Observable} from 'rxjs/internal/Observable';
import {find, flatMap, map} from 'rxjs/operators';

@Pipe({
	name: 'classifierPipe'
})
export class ClassifierPipe implements PipeTransform {
	public result: Classifier[] = [];

	public transform(classifierId: number, classifiers: Observable<Classifier[]>): Observable<Classifier> {

		return classifiers.pipe(
			map((classifiersArr: Classifier[]) => {
				return classifiersArr.find((classifier: Classifier) => classifier.id === classifierId);
			}));
	}

}
