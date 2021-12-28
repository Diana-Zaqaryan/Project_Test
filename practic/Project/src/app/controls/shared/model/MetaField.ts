import {MetaFieldTypeEnum} from '../enum/MetaFieldType.enum';

export class MetaField {


	constructor(public systemName: string, public categoryName: string,
				public columnName: string, public type: MetaFieldTypeEnum) {

	}
}
