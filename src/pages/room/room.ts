import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {AddRoomPage} from '../add-room/add-room';
import {HomePage} from '../home/home';
import * as firebase from 'firebase';
import { SigninPage } from '../signin/signin';
import {Observable} from 'rxjs/Observable';
import { RoomProvider } from '../../providers/room';



@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})

export class RoomPage {
  rooms = [];
  ref = firebase.database().ref('chatrooms/');
  data = {type :'', nickname:''};
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;
  chatrooms: Observable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private provider: RoomProvider, private toast: ToastController) {
    this.ref.on('value', resp =>{
      this.rooms =[];
      this.rooms = snapshotToArray(resp);
    });
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = this.navParams.get("nickname") as string;
    this.data.type ='message';
    this.data.nickname = this.nickname;

    this.chatrooms =this.provider.getAll();
    
  }

  addRoom(){
    this.navCtrl.push(AddRoomPage);
  }
  removeRoom(key: string){
    if(key) {
      this.provider.remove(key)
        .then(() => {
          this.toast.create({ message: 'Sala de conversa removida com sucesso.', duration: 3000}).present();
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao remover a sala de conversa.', duration: 3000}).present();
        });
    }
  }

  joinRoom(key){
    this.navCtrl.setRoot(HomePage,{
      key:key,
      nickname:this.navParams.get("nickname")
    });
  }
 
    
  
  signout(){
    let signout = firebase.database().ref('chatrooms/'+this.roomkey).push();
      signout.set({});
  
      
  
      this.navCtrl.setRoot(SigninPage)
    }

    

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
  }

}

export const snapshotToArray = snapshot => {
  let returnArr =[];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
