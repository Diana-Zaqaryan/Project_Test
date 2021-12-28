import {Component, Inject, Input, OnInit} from '@angular/core';
import {ClassifierService} from '../../shared/sevices/classifier.service';
import {Classifier} from '../../shared/model/Classifier';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {percentFunc} from '../../shared/validators/percent.validator';

@Component({
	selector: 'app-location-pop-up',
	templateUrl: './location-pop-up.component.html',
	styleUrls: ['./location-pop-up.component.css']
})
export class LocationPopUpComponent implements OnInit {


	public countries: Classifier[] = [];
	public districts: Classifier[] = [];
	public id: number;
	public action: string;
	@Input() public formGroupName: string;

	public formForLocation: FormGroup;
	public isReady = false;


	constructor(private fb: FormBuilder,
				public classifierService: ClassifierService,
				public dialogRef: MatDialogRef<LocationPopUpComponent>,
				@Inject(MAT_DIALOG_DATA) public data) {

	}


	public ngOnInit() {

		if (this.data) {
			this.formForLocation = this.fb.group({
				country: ['', [Validators.required]],
				district: ['', [Validators.required]],
				percent: ['', [Validators.max(101), Validators.min(0), percentFunc(this.data.data)]],
			});
		}

		this.classifierService.getAllClassifiers('country').subscribe(
			(countries: Classifier[]) => this.countries = countries
		);
		this.classifierService.getAllClassifiers('district').subscribe(
			(districts: Classifier[]) => this.districts = districts
		);
	}


	public addProjectLocation() {

		this.dialogRef.close(this.formForLocation.value);

	}
}
