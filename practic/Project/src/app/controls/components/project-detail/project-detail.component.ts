import {Component, OnInit} from '@angular/core';
import {MetaField} from '../../shared/model/MetaField';
import {MetaFieldTypeEnum} from '../../shared/enum/MetaFieldType.enum';
import {ClassifierService} from '../../shared/sevices/classifier.service';
import {MainEntityService} from '../../shared/sevices/mainEntity.service';
import {SubEntityService} from '../../shared/sevices/subEntity.service';
import {
	AsyncValidatorFn,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from '../../shared/model/Project';
import {SubEntity} from '../../shared/model/SubEntity';
import {MatTable} from '@angular/material';
import {DynamicTableComponent} from '../dynamic-table/dynamic-table.component';
import {DataService} from '../../shared/sevices/data.service';
import {DateValidator} from '../../shared/validators/date.validator';
import {percentFunc} from '../../shared/validators/percent.validator';


@Component({
	selector: 'app-project-detail',
	templateUrl: './project-detail.component.html',
	styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
	public isEditMode: boolean;
	public loading = false;
	public submitted = false;
	public isReady = false;
	public projectForm: FormGroup;
	public dataSourseOfLocations = [];
	public dataSourseOfSectors = [];
	public isAdd: boolean;
	public isDelete: boolean;
	public deletFromSectors: boolean;
	public saveProject: Project;
	public getVal;
	public lastId;

	public sectorMetaFields = [
		// new MetaField('id', '', 'id', MetaFieldTypeEnum.INTEGER),
		new MetaField('sectorId', 'sector', 'Sector', MetaFieldTypeEnum.CLASSIFIER),
		new MetaField('percent', '', '%', MetaFieldTypeEnum.INTEGER)];

	public locationMetaFields = [
		// new MetaField('id', '', 'id', MetaFieldTypeEnum.INTEGER),
		new MetaField('countryId', 'country', 'Country', MetaFieldTypeEnum.CLASSIFIER),
		new MetaField('districtId', 'district', 'District', MetaFieldTypeEnum.CLASSIFIER),
		new MetaField('percent', '', '%', MetaFieldTypeEnum.INTEGER)];

	constructor(public classifierService: ClassifierService,
				public mainEntityService: MainEntityService,
				public subEntityService: SubEntityService,
				public fb: FormBuilder,
				private route: ActivatedRoute,
				private router: Router,
				public dataService: DataService
	) {

		this.getVal = this.router.getCurrentNavigation().extras.state;
	}


	public ngOnInit() {

		const id = +this.route.snapshot.paramMap.get('id');
		this.isEditMode = id > 0;

		if (this.isEditMode) {
			this.mainEntityService.getProjectById(id)
				.subscribe((project: Project) => {
					this.isReady = true;
					this.projectForm = this.initForm(project);
				});
		} else {
			this.isReady = true;
			this.projectForm = this.initForm();

		}
	}

	public get form() {
		return this.projectForm.controls;
	}

	public calculateDiff(startDate, endDate) {

		startDate = new Date(startDate);
		endDate = new Date(endDate);

		return Math.floor(
			(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
				- Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / (1000 * 60 * 60 * 24));
	}


	public initForm(project?: Project): FormGroup {
		return this.fb.group({
			sample: this.fb.group({
				code: [project ? project.projectCode : null, [Validators.required]],
				title: [project ? project.projectTitle : null, [Validators.required]],
				description: [project ? project.description : null],
				status: [project ? project.statusId : null, [Validators.required]],
				dates: this.fb.group({
					startDate: [project ? project.startDate : null, [Validators.required]],
					endDate: [project ? project.endDate : null],

					duration: [project ? project.duration : null],
				}, {validators: DateValidator.validateDate})
			}),
			projectSectors: this.fb.array(project ? project.sectors : []),
			projectLocations: this.fb.array(project ? project.locations : [])
		});


	}


	public addProjectSector([sub, subEntites, table]:
								[SubEntity, SubEntity[], MatTable<DynamicTableComponent>]): void {
		subEntites.push(sub);
		(this.projectForm.get('projectSectors') as FormArray).push(new FormControl(sub));
		this.isAdd = true;
		this.dataSourseOfSectors= subEntites;
		table.renderRows();
	}

	public addProjectLocation([sub, subEntites, table]:
								  [SubEntity, SubEntity[], MatTable<DynamicTableComponent>]) {
		(this.projectForm.get('projectLocations') as FormArray).push(new FormControl(sub));
		this.isAdd = true;
		this.dataSourseOfLocations= subEntites;
		table.renderRows();
	}


	public deleteProjectSector([index,subEntity, subEntites, table, context]:
								   [number,SubEntity, SubEntity[], MatTable<DynamicTableComponent>, DynamicTableComponent]) {
		context.dataSource = subEntites.filter((obj: SubEntity) => obj.id !== subEntity.getId());
		// @ts-ignore
		(this.projectForm.get('projectSectors') as FormArray).removeAt(index);
		this.dataSourseOfSectors= context.dataSource;
		this.deletFromSectors = true;
		table.renderRows();
	}

	public deleteProjectLocations([index,subEntity, subEntites, table, context]:
									  [number,SubEntity, SubEntity[], MatTable<DynamicTableComponent>, DynamicTableComponent]) {
		context.dataSource = subEntites.filter((obj: SubEntity) => obj.id !== subEntity.getId());
		// @ts-ignore
		(this.projectForm.get('projectLocations') as FormArray).removeAt(index);
		this.deletFromSectors = false;
		this.dataSourseOfLocations = context.dataSource;
		table.renderRows();
	}


	public projectSaveAction() {
		this.mainEntityService.getProjects().subscribe((projects: Project[]) => {
			this.lastId = projects.length;
			let newProject;
			const id = +this.route.snapshot.paramMap.get('id');
			const sample = this.projectForm.get('sample').value;
			if (id > 0) {
				newProject = new Project(
					id,
					sample.code,
					sample.title,
					sample.description,
					sample.status,
					sample.dates.startDate,
					sample.dates.endDate,
					sample.dates.duration ? sample.dates.duration
						: this.calculateDiff(sample.dates.startDate, sample.dates.endDate),
					this.projectForm.get('projectSectors').value,
					this.projectForm.get('projectLocations').value);
			} else {
				newProject = new Project(
					++this.lastId,
					sample.code,
					sample.title,
					sample.description,
					sample.status,
					sample.dates.startDate,
					sample.dates.endDate,
					sample.dates.duration ? sample.dates.duration : this.calculateDiff(sample.dates.startDate, sample.dates.endDate),
					this.projectForm.get('projectSectors').value,
					this.projectForm.get('projectLocations').value);

			}


			if (id > 0) {
				this.mainEntityService.updateProject(id, newProject).subscribe(
					(val: Project) => {

						this.router.navigateByUrl('/', {state: newProject});
					}
				);
			} else {

				this.mainEntityService.createProject(newProject)
					.subscribe(
						(val: Project) => {

							this.router.navigateByUrl('/', {state: newProject});
						}
					);
			}
		});


	}


	public saveAndStay() {
		this.mainEntityService.getProjects().subscribe((projects: Project[]) => {
			this.lastId = projects.length;
			let newProject;
			const id = +this.route.snapshot.paramMap.get('id');
			const sample = this.projectForm.get('sample').value;
			if (id > 0) {
				newProject = new Project(
					id,
					sample.code,
					sample.title,
					sample.description,
					sample.status,
					sample.dates.startDate,
					sample.dates.endDate,
					sample.dates.duration ? sample.dates.duration : this.calculateDiff(sample.dates.startDate, sample.dates.endDate),
					this.projectForm.get('projectSectors').value,
					this.projectForm.get('projectLocations').value);
			} else {
				newProject = new Project(
					++this.lastId,
					sample.code,
					sample.title,
					sample.description,
					sample.status,
					sample.dates.startDate,
					sample.dates.endDate,
					sample.dates.duration ? sample.dates.duration : this.calculateDiff(sample.dates.startDate, sample.dates.endDate),
					this.projectForm.get('projectSectors').value,
					this.projectForm.get('projectLocations').value);
			}


			if (id > 0) {
				this.mainEntityService.updateProject(id, newProject).subscribe(
					(val: Project) => {

						this.dataService.project = newProject;

					}
				);
			} else {
				this.mainEntityService.createProject(newProject)
					.subscribe(
						(val: Project) => {

							this.dataService.project = newProject;

						}
					);
			}
		});

	}
}
