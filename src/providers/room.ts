import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class RoomProvider {
  private PATH ='chatrooms/';
  constructor(private db:AngularFireDatabase) {}
  getAll(){
    return this.db.list(this.PATH, ref => ref.orderByChild('roomname'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  
  remove(key: string){
    return this.db.list(this.PATH).remove(key);
  }

}
