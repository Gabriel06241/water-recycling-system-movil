import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the FillingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filling',
  templateUrl: 'filling.html',
})
export class FillingPage {
  id = "";
  task;
  header = {}
  items = []

  brightness: number = 20;
  contrast: number = 0;
  warmth: number = 0;
  structure: any = { lower: 33, upper: 60 };
  text: number = 0;
  
  maxWarmth: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private http: HTTP) {
    this.id = navParams.get("ID");
    console.log("id", this.id);

    if(this.id == undefined){
      console.log("id undefined");

      this.storage.get('idProcess').then((val) => {
        console.log(val);
  
        if (val !== null) {
          this.id = val;
          this.loadProces();
        }else {
          navCtrl.pop();
        }
      });
    }else {
      this.storage.set('idProcess', this.id);
      this.loadProces();
    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FillingPage');

  }

  loadProces(){
    this.task = setInterval(() => {
      this.refreshProcess();
    }, 2000);
  }

  refreshProcess(){
    if(this.id == undefined){
      return;
    }

    let url = 'http://10.10.26.45:5000/api/events?id=' + this.id;
    console.log(url);
    this.header['Cache-Control'] = 'no-cache';
    this.http.get(
      url,
      {},
      this.header
    ).then(res => {
      try {
  
      
        console.log(JSON.stringify(res));
        console.log("res.data", res.data);
        this.items = JSON.parse(res.data);
        
        let pro = this.items[0].distance;
        console.log("pro", pro);

        if(this.maxWarmth == 0){
          this.maxWarmth = pro;
        }  
        this.warmth = (pro / this.maxWarmth) * 100;
        console.log("this.warmth", this.warmth);
      }
      catch (e) {
        console.log(e);
      }
    }).catch(e => {
      console.log("error");
      console.log(JSON.stringify(e));
    });
  }
}
