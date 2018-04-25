import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,Content } from 'ionic-angular';
import { RoomPage, snapshotToArray } from '../room/room';
import * as firebase from 'firebase';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  data = {type :'', nickname:'', message:''};
  chats =[];
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;

  constructor(public navCtrl: NavController,public navParams: NavParams,) {
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = this.navParams.get("nickname") as string;
    this.data.type ='message';
    this.data.nickname = this.nickname;

    let joinData = firebase.database().ref('chatrooms/'+
      this.roomkey+'/chats').push();
    joinData.set({
      type: 'join',
      user:this.nickname,
      message:this.nickname+' Juntou-se a esta sala.',
      sendDate:Date()
    });

    this.data.message ='';

    firebase.database().ref('chatrooms/'+this.roomkey+'/chat').on('value', resp =>{
      this.chats =[];
      this.chats= snapshotToArray(resp);
      setTimeout(() => {
        if(this.offStatus === false ){
          this.content.scrollToBottom(300);
        }
      }, 100);
    });
  }
  sendMessage(){
    let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chat').push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sedDate:Date()
    });
    this.data.message='';
  }

  exitChat(){
    let exitData = firebase.database().ref('chatrooms/'+this.roomkey+'/chat').push();
    exitData.set({
      type:'exit',
      user:this.nickname,
      message:this.nickname+' Saiu desta sala.',
      sendDate:Date()
    });

    this.offStatus = true;

    this.navCtrl.setRoot(RoomPage,{
      nickname:this.nickname
    });

  }
 

}

