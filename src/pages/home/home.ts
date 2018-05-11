import { Component } from '@angular/core';
import { NavController , LoadingController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  code = {
    "A": "",
    "B": "",
    "C": "",
    "D": ""
  }
  header = {};
  fullCode = ""

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private http: HTTP,
              private storage: Storage) {
    this.code = {
      "A": "",
      "B": "",
      "C": "",
      "D": ""
    }
  }

  ionViewDidLoad(){

    this.storage.get('user').then((val) => {
      console.log(val);

      this.navCtrl.push("DashboardPage");

      if(val !== null){
        this.fullCode = val;
        this.code.A = val.substring(0, 1 );
        this.code.B = val.substring(1, 2 );
        this.code.C = val.substring(2, 3 );
        this.code.D = val.substring(3, 4 );
        this.presentLoadingDefault();
      }
    });
  }


  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: "Registrando " + this.fullCode
    });
  
    loading.present();
  
    /*setTimeout(() => {
      loading.dismiss();
    }, 5000);*/
    let url = 'http://127.0.0.1:5000/api/devices/' + this.fullCode;
    
    this.header['Cache-Control'] = 'no-cache';
    this.http.get(
      url,
      {},
      this.header
    ).then(res => {

      this.navCtrl.push("dashboardPage")

      /*console.log(JSON.stringify(res.data));
      let userJson = JSON.parse(res.data)[0];
      console.log(JSON.stringify(userJson));
      this.storage.set('user', JSON.stringify(userJson));

      this.user = {
        id: userJson.id,
        identification: userJson.identification,
        names: userJson.names,
        lastName: userJson.lastName,
        penalties: userJson.penalties,
      };
      console.log(JSON.stringify(this.user));*/
    }).catch(e => {
      console.log("error");
      console.log(JSON.stringify(e));
      /*
      console.log(e);
      this.user ={
        id: 0,
        identification: '',
        names: 'Cedula no encontrada',
        lastName: '',
        penalties : []
      };*/
    });

  }

  next(el) {

    el.setFocus();
  }

  findCode(){
    this.fullCode = this.code.A + this.code.B + this.code.C + this.code.D;
    /*this.procesando = "Procesando " + this.code.A + this.code.B + this.code.C + this.code.D;*/
    this.presentLoadingDefault();
  }

}
