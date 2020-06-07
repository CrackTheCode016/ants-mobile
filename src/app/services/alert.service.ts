import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  public async showCustomAlert(header: string, message: string, subtitle: string): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      subHeader: subtitle,
      message,
      buttons: ['OK']
    });
    return alert.present();
  }


}
