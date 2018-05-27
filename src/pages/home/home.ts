import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController, Events } from 'ionic-angular';

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
    private toastCtrl: ToastController,
    public events: Events) {

    this.resetCode();
    this.nuevasNotificaciones();

    
  }

  nuevasNotificaciones() {
    this.events.subscribe('app:newToken', (token, time) => {
      console.log("app:newToken");
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('app:newToken', JSON.stringify(token), 'at', time);
      this.storage.set('token', token);
      this.registerNewToken(token);
    });
  }

  registerNewToken(token) {
    console.log("registerNewToken", token);

    /*http://127.0.0.1:5000/api/devices/7021/notifications?token=*/
    this.storage.get('user').then((fullCode) => {
      console.log(fullCode);

      if (fullCode !== null) {
        console.log("registerNewToken.fullCode", fullCode);
        let url = 'http://wr.ramirobedoya.me:5000/api/Devices/'
          + fullCode + '/notifications?token=' + token;
        console.log(url);
        this.header['Cache-Control'] = 'no-cache';
        this.http.get(
          url,
          {},
          this.header
        ).then(res => {
          console.log(JSON.stringify(res));
          console.log("res.data", );
        }).catch(e => {
          console.log("error");
          console.log(JSON.stringify(e));
        });
      } else {
        console.log("registerNewToken.SinCodigo");

        //Aquí, Cuando ingrese a la vista. Verificar si está registrado
      }
    });
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

    let url = 'http://wr.ramirobedoya.me:5000/api/devices/' + this.fullCode + '/activate'
    console.log("url", url);
    this.header['Cache-Control'] = 'no-cache';
    this.http.get(
      url,
      {},
      this.header
    ).then(res => {
      console.log("resultado de " + url);
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
        this.storage.get('token').then((token) => {

          console.log("token", token);

          if (token !== null) {
            this.registerNewToken(token);
            this.loadProfile();
          }

        }); 


      }
 
    }).catch(e => {
      loading.dismiss();
      console.log("error");
      console.log(JSON.stringify(e));

      var err = JSON.parse(e);
      console.log("err.error", err.error);
      if(err.error !== ""){
        this.alertMessage(err.error, "Error de conexión");
      }else {
        this.alertMessage("Se ha producido un incidente al activar el dispositivo, intentalo más tarde", "Error de conexión");
      }
      

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
