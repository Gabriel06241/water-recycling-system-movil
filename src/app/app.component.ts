import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';


import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private fcm: FCM,
              public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.initializeApp();
    });
  }

  initializeApp(){
    this.fcm.subscribeToTopic('marketing').then(data => {
      console.log("subscribeToTopic/marketing", JSON.stringify(data));
    });

    this.fcm.getToken().then(token => {
      console.log("backend.registerToken(token);", token);
      try{
        this.events.publish('app:newToken', token, Date.now());
      }catch (e) {
        console.log(e);
      }
      /*backend.registerToken(token);*/
    });

    this.fcm.onNotification().subscribe(data => {
      console.log("onNotification().subscribe");
      if (data.wasTapped) {
        console.log("Received in background", data);
      } else {
        console.log("Received in foreground", data);
      };
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      console.log("backend.registerToken(token)", token);
      this.events.publish('app:newToken', token, Date.now());

      /*http://127.0.0.1:5000/api/devices/7021/notifications?token=*/


      /*backend.registerToken(token);*/
    });
  }
}

