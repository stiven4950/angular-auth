import { DataSource } from '@angular/cdk/collections';
import { User } from '@models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

export class DataSourceUser extends DataSource<User> {

  data = new BehaviorSubject<User[]>([]);
  originalData: User[] = [];

  connect(): Observable<User[]> {
    return this.data;
  }

  init(data: User[]) {
    this.originalData = data;
    this.data.next(data);
  }

  disconnect() { }

}
