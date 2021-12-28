import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Classifier} from '../../shared/model/Classifier';
import {ClassifierService} from '../../shared/sevices/classifier.service';
import {SubEntityService} from '../../shared/sevices/subEntity.service';
import {MetaField} from '../../shared/model/MetaField';
import {MatDialog, MatPaginator, MatTable} from '@angular/material';
import {MetaFieldTypeEnum} from '../../shared/enum/MetaFieldType.enum';
import {SubEntity} from '../../shared/model/SubEntity';
import {Observable} from 'rxjs/internal/Observable';
import {LocationPopUpComponent} from '../location-pop-up/location-pop-up.component';
import {ActivatedRoute} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProjectSector} from '../../shared/model/ProjectSector';
import {ProjectLocation} from '../../shared/model/ProjectLocation';

import {CrossFieldErrorMatcher} from '../../shared/model/CrossFieldErrorMatcher';
import {percentFunc} from '../../shared/validators/percent.validator';
import {of} from 'rxjs/internal/observable/of';
import {DateValidator} from '../../shared/validators/date.validator';


@Component({
	selector: 'app-dynamic-table',
	templateUrl: './dynamic-table.component.html',
	styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit {

	public dataSource: SubEntity[] = [];
	public classifierNames = [];
	public classifiersMap = new Map<string, Observable<Classifier[]>>();
	public dataSourceOfSectors: SubEntity[] = [];
	public id: number;
	public lastId = 0;
	public errorMatcher = new CrossFieldErrorMatcher();


	@Input() public formArrayName: string;
	@Input() public formGroup: FormGroup;
	public form: FormArray;
	public readonly META_FIELD_TYPE = MetaFieldTypeEnum;

	@Input() public isInlineAddable: boolean;
	@Input() public isSectors: boolean;
	@Input() public isLocationTable: boolean;
	@Input() public metaFields: MetaField[] = [];
	@Input() public categoryName: string;

	@Output() public onSave = new EventEmitter<[SubEntity, SubEntity[], MatTable<DynamicTableComponent>]>();

	@Output() public onSaveProjectLocation =
		new EventEmitter<[SubEntity, SubEntity[], MatTable<DynamicTableComponent>]>();

	@Output() public onDelete =
		new EventEmitter<[number,SubEntity, SubEntity[], MatTable<DynamicTableComponent>, DynamicTableComponent]>();


	@ViewChild(MatPaginator) public paginator: MatPaginator;
	@ViewChild(MatTable) public table: MatTable<DynamicTableComponent>;
	@ViewChild('sector') public sector: ElementRef;
	@ViewChild('percent') public percent: ElementRef;

	public formForSector: FormGroup;
	public formForLocation: FormGroup;
	public isReady = false;

	constructor(public classifierService: ClassifierService,
				public subEntityService: SubEntityService,
				public dialogModel: MatDialog,
				private route: ActivatedRoute,
				private fb: FormBuilder) {
	}

	public ngOnInit() {
		this.id = +this.route.snapshot.paramMap.get('id');
		this.fetchDataSource(this.id, this.categoryName).subscribe(subEntities => {
			this.dataSource = subEntities;
			this.initFormSector(this.dataSource);
			this.initFormLocation(this.dataSource);
			this.isReady = true;
		});


		this.metaFields.forEach((metafield: MetaField) => {
			if (metafield.type === MetaFieldTypeEnum.CLASSIFIER) {
				this.classifierNames.push(metafield.categoryName);
			}
		});
		this.classifierNames.forEach((name: string) => {
				this.classifiersMap.set(name, this.classifierService.getAllClassifiers(name));
			}
		);

	}

	public initFormSector(dataSource: SubEntity[] = []) {
		this.formForSector = this.fb.group({
			sector: ['', [Validators.required]],
			percent: ['',
				[Validators.max(100),
					Validators.min(0),
					percentFunc(dataSource)
				]]
		});
	}

	public initFormLocation(dataSource: SubEntity[] = []) {
		this.formForLocation = this.fb.group({
			country: [],
			district: [],
			percent: ['',
				[Validators.max(101),
					Validators.min(0),
				]]
		});
	}

	public getSystemNames() {
		const systemNames = [];
		this.metaFields.forEach((val: MetaField) => systemNames.push(val.systemName));
		return [...systemNames, 'actions'];
	}

	public fetchDataSource(projectId: number, categoryName: string): Observable<SubEntity[]> {
		return projectId > -1 ? this.subEntityService.getSubEntities(projectId, categoryName) : of([]);
	}

	// public getClassifiers() {
	// 	this.classifierService.getAllClassifiers('sector')
	// 		.subscribe((classifier: Classifier[]) => this.dataSourceOfSectors = classifier);
	// }


	public openDialog() {
		if (this.id > 0) {
			this.lastId = this.dataSource[this.dataSource.length - 1] ? this.dataSource[this.dataSource.length - 1].id : 1;
		} else {
			this.lastId;
		}

		const dialogRef = this.dialogModel.open(LocationPopUpComponent,
			{
				width: '450px',
				height: '600px',
				data: {
					context: this,
					data: this.dataSource,
					form: this.formForLocation
				}
			});
		dialogRef.afterClosed()
			.subscribe((data) => {
				if (data) {
					this.dataSource.push(
						new ProjectLocation(++this.lastId, data['country'], data['district'], data['percent']));
				}

				this.onSaveProjectLocation.emit(
					[(new ProjectLocation(this.lastId, data['country'], data['district'], data['percent'])),
						this.dataSource, this.table]);
				this.table.renderRows();
			});


	}


	public saveAction() {
		const sectorId = (this.formForSector.get('sector')).value;
		const percent = +(this.formForSector.get('percent').value);
		if (this.id > 0) {
			this.lastId = this.dataSource[this.dataSource.length - 1] ? this.dataSource[this.dataSource.length - 1].id : 0;
		}
		this.onSave.emit([new ProjectSector(++this.lastId, sectorId, percent), this.dataSource, this.table]);
		this.formForSector.reset();

	}

	public deleteAction(subEntity: SubEntity,index:number) {
		//this.dataSource.filter((obj: SubEntity) => obj.id !== subEntity.id);
		this.onDelete.emit([index,subEntity, this.dataSource, this.table, this]);
	}
}
