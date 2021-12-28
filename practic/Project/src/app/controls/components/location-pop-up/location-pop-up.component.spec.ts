import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LocationPopUpComponent} from './location-pop-up.component';

describe('LocationPopUpComponent', () => {
	let component: LocationPopUpComponent;
	let fixture: ComponentFixture<LocationPopUpComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LocationPopUpComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LocationPopUpComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
