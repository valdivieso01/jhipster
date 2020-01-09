import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IBloodPressure {
  id?: number;
  date?: Moment;
  systolic?: string;
  diastolic?: string;
  user?: IUser;
}

export class BloodPressure implements IBloodPressure {
  constructor(public id?: number, public date?: Moment, public systolic?: string, public diastolic?: string, public user?: IUser) {}
}
