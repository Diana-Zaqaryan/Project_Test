import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {CrossFieldErrorMatcher} from '../../shared/model/CrossFieldErrorMatcher';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {tsStructureIsReused} from '@angular/compiler-cli/src/transformers/util';


@Component({
	selector: 'app-date-duration',
	templateUrl: './date-duration.component.html',
	styleUrls: ['./date-duration.component.css']
})
export class DateDurationComponent implements OnInit {
	public minDate = new Date();
	// @ts-ignore
	@Input() public formGroupName: string;
	// @ts-ignore
	public form: FormGroup;
	public durationVal = 0;
	public errorMatcher = new CrossFieldErrorMatcher();

	constructor(private rootFormGroup: FormGroupDirective) {
	}

	public ngOnInit() {
		this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
	}


	public findDuration(startData) {
		if (this.form.get('startDate').value && this.form.get('endDate').value) {
			const startDate = new Date(startData);
			const endDate = new Date(this.form.get('endDate').value);

			this.form.get('duration').setValue(Math.floor(
				(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
					- Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / (1000 * 60 * 60 * 24)));

			// this.form.get('duration').setValue(this.durationVal);

			// } else {
			// 	this.durationVal = null;
			// }
		}
	}
}
