## Run on Movil 
``
RUN
    En el browser
        $ ionic serve
    En el emulador
        $ ionic cordova emulate android -lc
    En el Celular
        $ ionic cordova run android --device -lc
``

```

# repeat the following command for all platforms
ionic cordova platform rm android
rm -rf node_modules/ platforms/ plugins/ www/
npm install 
# repeat the following command for all platforms
ionic cordova platform add android

```

# Notificaciones
```
$ ionic cordova plugin add cordova-plugin-fcm
$ npm install --save @ionic-native/fcm
```


# Cargando 
 - https://www.npmjs.com/package/angular-progress-bar
```
npm install angular-progress-bar@latest --save
```


Firmar la APK
Generar la APK
ionic cordova run android --prod --release

keytool -genkey -v -keystore water-recycling-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias waterRecycling

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore water-recycling-key.jks /Users/ramirobedoya/workspace/moviles2/parcial2-ionic/misMultas/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk misMultas

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore water-recycling-key.jks /Users/ramirobedoya/workspace/moviles2/parcial2-ionic/misMultas/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk misMultas


jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /Users/ramirobedoya/workspace/water-recycling-system-movil-key/water-recycling-key.jks app-release-unsigned.apk waterRecycling