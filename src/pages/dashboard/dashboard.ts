import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import { HTTP } from '@ionic-native/http';

import { Device } from '../../model/device.model';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';


/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
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
    "recyclingProcessList": [],
    "state": false
  }
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private http: HTTP,
    private storage: Storage,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController) {
    this.id = navParams.get('id');
    this.loadProfile();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

  loadProfile() {

    let loading = this.loadingCtrl.create({
      content: "Cargando perfil " + this.id
    });

    loading.present();
    //http://water-recycling.eastus.cloudapp.azure.com:5000/api/Devices?id=3481
    let url = 'http://40.114.106.53:5000/api/Devices?id=' + this.id;
    console.log(url);
    this.header['Cache-Control'] = 'no-cache';
    this.http.get(
      url,
      {},
      this.header
    ).then(res => {
        console.log(JSON.stringify(res));
        console.log("res.data", );
        loading.dismiss();

        var r = JSON.parse(res.data)[0];
        console.log("r", JSON.stringify(r[0]));

        this.data = {
          id: r.id,
          code: r.code,
          ip: r.ip,
          created: r.created,
          recyclingProcessList: r.recyclingProcessList,
          state: r.state
        }

        console.log("data", JSON.stringify(this.data));
       
    }).catch(e => {
      console.log("error");
      console.log(JSON.stringify(e));

      console.log("err.error", e.error);
      if(e.error !== undefined && e.error !== ''){
        this.alertMessage(e.error, "Error");
      }else {
        this.alertMessage("Se ha producido un incidente al cargar el perfil, intentalo más tarde", "Error de conexión");
      }
      loading.dismiss();

    });

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
    let url = 'http://40.114.106.53:5000/api/Devices/' + this.id + '/remove';
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
      if(e.error !== undefined && e.error !== ''){
        this.alertMessage(e.error, "Error");
      }else {
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
