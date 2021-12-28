import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SubEntity} from '../../shared/model/SubEntity';
import {MatSnackBar, MatTable} from '@angular/material';
import {FormGroup} from '@angular/forms';
import {MainEntityService} from '../../shared/sevices/mainEntity.service';
import {SubEntityService} from '../../shared/sevices/subEntity.service';
import {ProjectLocation} from '../../shared/model/ProjectLocation';
import {Project} from '../../shared/model/Project';
import {SampleComponent} from '../sample/sample.component';
import {ProjectDetailComponent} from '../project-detail/project-detail.component';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit, AfterViewInit {
	@Output() public saveProjectAndClose = new EventEmitter();
	@Output() public saveProjectAndStay = new EventEmitter();
	@Input() public projectForm: FormGroup;
	@Input() public projectSectors: SubEntity[];
	@ViewChild(SampleComponent) public sample;
	public projectCode: string;

	constructor(private snackBar: MatSnackBar) {
	}


	public ngOnInit() {

	}

	public ngAfterViewInit(): void {

		if (this.sample) {
			this.projectCode = this.sample.source._parent.form.value.code;
		}

		console.log(this.projectCode);
	}

	public save() {
		this.saveProjectAndClose.emit();
	}


	public saveProject() {
		this.saveProjectAndStay.emit();
	}

	public openSnackBar(message, action) {
		this.snackBar.open(message, action);
	}
}
