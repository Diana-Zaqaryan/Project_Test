import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormGroupDirective, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './controls/components/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {MaterialModule} from './controls/shared/modules/material.module';
import {SampleComponent} from './controls/components/sample/sample.component';
import {DateDurationComponent} from './controls/components/date-duration/date-duration.component';
import {DynamicTableComponent} from './controls/components/dynamic-table/dynamic-table.component';
import {HttpClientModule} from '@angular/common/http';


import {ListComponent} from './controls/components/list/list.component';
import {ClassifierPipe} from './controls/shared/pipes/classifier.pipe';
import {ProjectDetailComponent} from './controls/components/project-detail/project-detail.component';
import {LocationPopUpComponent} from './controls/components/location-pop-up/location-pop-up.component';


@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		SampleComponent,
		DateDurationComponent,
		DynamicTableComponent,
		ListComponent,
		ClassifierPipe,
		ProjectDetailComponent,
		LocationPopUpComponent,

	],
	exports: [
		HeaderComponent,

	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,

	],
	providers: [FormGroupDirective],
	entryComponents: [LocationPopUpComponent],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
