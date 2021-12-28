import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {Classifier} from '../../shared/model/Classifier';
import {ClassifierService} from '../../shared/sevices/classifier.service';
import {SubEntityService} from '../../shared/sevices/subEntity.service';
import {MainEntityService} from '../../shared/sevices/mainEntity.service';
import {SubEntity} from '../../shared/model/SubEntity';
import {FormGroup, FormGroupDirective} from '@angular/forms';

@Component({
	selector: 'app-sample',
	templateUrl: './sample.component.html',
	styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit {
	public statuses: Classifier[] = [];
	public subEntities: SubEntity[] = [];

	// @ts-ignore
	public form: FormGroup;
	@Input() public formGroupName: string;
	@ViewChild('projectTitle') public projectTitle;

	public readonly maxLength = 50;


	constructor(public classifierService: ClassifierService,
				public mainEntityService: MainEntityService,
				public subEntityService: SubEntityService,
				private rootFormGroup: FormGroupDirective) {
	}

	public ngOnInit() {
		this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

		this.classifierService.getAllClassifiers('status').subscribe(
			(statuses: Classifier[]) => {
				statuses.forEach((obj: Classifier) => this.statuses.push(obj));
				return this.statuses;
			}
		);


	}
}
