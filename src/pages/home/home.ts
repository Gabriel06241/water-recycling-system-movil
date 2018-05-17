import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';

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
    private storage: Storage,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController) {

    this.resetCode();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad");
    this.storage.get('user').then((val) => {
      console.log(val);

      if (val !== null) {
        this.fullCode = val;
        this.code.A = val.substring(0, 1);
        this.code.B = val.substring(1, 2);
        this.code.C = val.substring(2, 3);
        this.code.D = val.substring(3, 4);
        this.presentToast("Código cargado correctamente");

        this.loadProfile();
      }else {
        this.resetCode();
      }
    });
  }


  activateCode() {

    if(this.fullCode.length !== 4){
      return;
    }

    let loading = this.loadingCtrl.create({
      content: "Registrando " + this.fullCode
    });

    loading.present();

    let url = 'http://40.114.106.53:5000/api/devices/' + this.fullCode + '/activate'
    this.header['Cache-Control'] = 'no-cache';
    this.http.get(
      url,
      {},
      this.header
    ).then(res => {
      console.log(JSON.stringify(res));
      console.log("res.data",res.data);
      loading.dismiss();
      if (res.data == 99) {
        console.log("Este código ya ha sido activado en otro dispositivo");
        this.alertMessage("Este código ya ha sido activado en otro dispositivo", "Código Incorrecto");
        this.resetCode();
      } else if (res.data == 10) {
        console.log("Dispositivo activo correctamente");
        this.presentToast("Dispositivo activado correctamente");
        this.storage.set('user', this.fullCode);
        this.loadProfile();
      }
 
    }).catch(e => {
      console.log("error");
      console.log(JSON.stringify(e));

      var err = JSON.parse(e);
      console.log("err.error", err.error);
      if(err.error !== ""){
        this.alertMessage(err.error, "Error de conexión");
      }else {
        this.alertMessage("Se ha producido un incidente al activar el dispositivo, intentalo más tarde", "Error de conexión");
      }
      loading.dismiss();

    });

  }

  loadProfile(){
    this.navCtrl.setRoot("DashboardPage", {id: this.fullCode});
  }

  next(el) {

    el.setFocus();
  }

  resetCode(){
    this.code = {
      "A": "",
      "B": "",
      "C": "",
      "D": ""
    }
    this.fullCode = "";
  }

  findCode() {
    this.fullCode = this.code.A + this.code.B + this.code.C + this.code.D;
    /*this.procesando = "Procesando " + this.code.A + this.code.B + this.code.C + this.code.D;*/
    this.activateCode();
  }

  alertMessage(mensaje, titulo) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['OK']
    });
    alert.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

}
