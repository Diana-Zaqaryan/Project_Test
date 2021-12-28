import {ErrorStateMatcher} from '@angular/material';
import {FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';


export class CrossFieldErrorMatcher implements ErrorStateMatcher {
	public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

		return control.parent.invalid && control.dirty ;
	}
}
