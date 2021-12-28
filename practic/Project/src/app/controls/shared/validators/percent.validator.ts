import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {SubEntityService} from '../sevices/subEntity.service';
import {SubEntity} from '../model/SubEntity';
import {el} from '@angular/platform-browser/testing/src/browser_util';

let sum = 0;

export function percentFunc(data): ValidatorFn {
	let sumOfPercent = 0;

	return (control: AbstractControl): ValidationErrors | null => {
		sumOfPercent = data.reduce((sum1: number, val) => sum1 + val.percent, 0);

			sum = sumOfPercent + (+control.value);

			//sum += +control.value;

		if (+sum > 101) {
			return {notValid: true};
		}


		return null;

	};

}

