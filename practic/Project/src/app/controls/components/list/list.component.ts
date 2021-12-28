import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MainEntityService} from '../../shared/sevices/mainEntity.service';
import {Project} from '../../shared/model/Project';
import {MetaField} from '../../shared/model/MetaField';
import {promisify} from 'util';
import {MetaFieldTypeEnum} from '../../shared/enum/MetaFieldType.enum';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatPaginator, MatSort, MatTable, MatTableDataSource, Sort} from '@angular/material';
import {DynamicTableComponent} from '../dynamic-table/dynamic-table.component';
import {DataService} from '../../shared/sevices/data.service';


@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})


export class ListComponent implements OnInit {
	@ViewChild(MatTable)public table: MatTable<ListComponent>;

	public projects: Project[] = [];
	public newProject: Project;
	public gtVal;
	public readonly META_FIELD_TYPE = MetaFieldTypeEnum;

	public dataSource = new MatTableDataSource<Project>([]);
	@ViewChild(MatPaginator) public paginator: MatPaginator;
	@ViewChild(MatSort) public sort: MatSort;


	public metaFields: MetaField[] = [
		new MetaField('projectCode', 'null', 'Project Code', MetaFieldTypeEnum.STRING),
		new MetaField('projectTitle', 'null', 'Project Title', MetaFieldTypeEnum.STRING),
		new MetaField('startDate', 'null', 'Start Date', MetaFieldTypeEnum.DATE),
		new MetaField('endDate', 'null', 'End Date', MetaFieldTypeEnum.DATE),
	];

	constructor(public mainEntityService: MainEntityService,
				private router: Router,
				private route: ActivatedRoute,
				public dataService: DataService) {

		console.log('get value is', (this.router.getCurrentNavigation().extras.state));

		this.gtVal = this.router.getCurrentNavigation().extras.state;

	}


	public ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.mainEntityService.getProjects().subscribe(
			(projects: Project[]) => {
				this.projects = projects;
				this.dataSource.data = projects as Project[];
			}
		);
		if (this.dataService.project) {
			this.dataSource.data.push(this.dataService.project);


		}

		if (this.gtVal) {
			this.dataSource.data.push(this.gtVal);

		}

		this.dataSource.sort = this.sort;
	}

	public ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	public getSystemNames(): string[] {
		const systemNames = [];
		this.metaFields.forEach((val: MetaField) => systemNames.push(val.columnName));
		return [...systemNames, 'actions'];
	}


	public deleteproject(id: number) {
		this.mainEntityService.deleteProject(id)
			.subscribe(() =>
				this.dataSource.data = this.dataSource.data.filter((obj: Project) => obj.id !== id)
			);

	}

	public updateproject(id: number) {
		this.mainEntityService.getProjectById(id).subscribe(
			(project: Project) => {

			});
	}


	public applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}


}
