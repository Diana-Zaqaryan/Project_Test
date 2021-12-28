import {FormGroup} from '@angular/forms';


export class DateValidator {
	public static validateDate(group: FormGroup) {
		const startDate = group.get('startDate').value;
		const endDate = group.get('endDate').value;
		if ((startDate !== null && endDate !== null) && startDate > endDate) {
			return {notValid: true};
		}
		return null;
	}
}
