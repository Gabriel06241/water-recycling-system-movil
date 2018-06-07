import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { ActionSheetController, Events } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

import { Device } from '../../model/device.model';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
/*import { FillingPage } from '../filling/filling';*/

HTTP.getPluginRef = () => "cordova.plugin.http";

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  id = ""
  header = {}
  data: Device = {
    "id": 0,
    "code": "",
    "ip": "",
    "created": "",
    "recyclingProcessList": 0,
    "recyclingProcessCount" : 0,
    "state": false
  }

  OnProcess = false;
  task;
  processId = "";

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private http: HTTP,
    private storage: Storage,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public events: Events) {

    this.id = navParams.get('id');
    this.nuevasNotificaciones();

    this.storage.get('user').then((val) => {
      console.log(val);

      if (val !== null) {
        this.id = val;
        this.loadProfile();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

  nuevasNotificaciones() {
    this.events.subscribe('app:newToken', (token, time) => {
      console.log("app:newToken");
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('app:newToken', JSON.stringify(token), 'at', time);

      this.registerNewToken(token);
    });
  }

  registerNewToken(token) {
    console.log("registerNewToken", token);
    this.storage.set('token', token);

    /*http://127.0.0.1:5000/api/devices/7021/notifications?token=*/
    this.storage.get('user').then((fullCode) => {
      console.log(fullCode);

      if (fullCode !== null) {
        console.log("registerNewToken.fullCode", fullCode);
        let url = 'http://10.10.26.45:5000/api/Devices/'
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
        console.log("registerNewToken.SinCodigo", token);

        //Aquí, Cuando ingrese a la vista. Verificar si está registrado
      }
    });
  }

  loadProfile() {

    let loading = this.loadingCtrl.create({
      content: "Cargando perfil " + this.id
    });

    loading.present();
    let url = 'http://10.10.26.45:5000/api/Devices?id=' + this.id;
    this.header['Cache-Control'] = 'no-cache';
    this.http.get(
      url,
      {},
      this.header
    ).then(res => {
      console.log(url, JSON.stringify(res));

      var r = JSON.parse(res.data)[0];
      this.data = {
        id: r.id,
        code: r.code,
        ip: r.ip,
        created: r.created,
        recyclingProcessList: r.recyclingProcessList,
        recyclingProcessCount: r.recyclingProcessCount,
        state: r.state
      }

      loading.dismiss();
      this.loadNewProcess();
    }).catch(e => {
      console.log("error", JSON.stringify(e));
      if (e.error !== undefined && e.error !== '') {
        this.alertMessage(e.error, "Error");
      } else {
        this.alertMessage("Se ha producido un incidente al cargar el perfil, intentalo más tarde", "Error de conexión");
      }
      loading.dismiss();
    });
  }
 
  loadNewProcess() {

    this.OnProcess = false;
    console.log("this.OnProcess", this.OnProcess);

    this.task = setInterval(() => {
      this.refreshProcess();
    }, 1000);
  }

  refreshProcess() {
    let url = 'http://10.10.26.45:5000/api/devices/' + this.id + "/lite";
    this.header['Cache-Control'] = 'no-cache';
    this.http.get(
      url,
      {},
      this.header
    ).then(res => {
      var r = JSON.parse(res.data);
      console.log(url, JSON.stringify(r));

      if (this.data.recyclingProcessList !== r.recyclingProcessCount) {
        this.OnProcess = true;
        clearInterval(this.task);
        this.processId = r.lastProcessId;
      }
      
      
    }).catch(e => {
      console.log("error");
      console.log(JSON.stringify(e));
    });
  }

  loadEvent() {
    this.navCtrl.push("FillingPage", { ID: this.processId })
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

  eliminarEnlace() {
    let loading = this.loadingCtrl.create({
      content: "Eliminando asociación " + this.id
    });

    loading.present();
    //http://water-recycling.eastus.cloudapp.azure.com:5000/api/Devices?id=3481
    let url = 'http://10.10.26.45:5000/api/Devices/' + this.id + '/remove';
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
        loading.dismiss();
        this.storage.set('user', null);
        this.navCtrl.setRoot(HomePage);
      }
      catch (e) {
        console.log(e);
      }


    }).catch(e => {
      console.log("error");
      console.log(JSON.stringify(e));
      if (e.error !== undefined && e.error !== '') {
        this.alertMessage(e.error, "Error");
        this.storage.set('user', null);
        this.navCtrl.setRoot(HomePage);
      } else {
        this.alertMessage("Se ha producido un incidente al eliminar el perfil, intentalo más tarde", "Error de conexión");
      }
      loading.dismiss();
    });

  }

  estadoEnlaceActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modificar enlace',
      buttons: [
        {
          text: 'Eliminar enlace',
          role: 'destructive',
          handler: () => {
            this.eliminarEnlace();
          }
        },{
          text: 'Refrescar',
          handler: () => {
            this.loadProfile();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


}
