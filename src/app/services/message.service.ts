import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  messages: string[] = [];

  private _isLoadingData = false;
  private _blockUI = false;

  constructor(private toastController: ToastController) {}

  get isUIBlocked() {
    return this._blockUI === true;
  }
  blockUI(): void {
    // this._isLoadingData = value;
    // this to fix: ExpressionChangedAfterItHasBeenCheckedError
    Promise.resolve(null).then(() => this._blockUI = true);
  }

  get isLoadingData() {
    return this._isLoadingData;
  }
  set isLoadingData(value: boolean) {
    // this._isLoadingData = value;
    // thi sto fix: ExpressionChangedAfterItHasBeenCheckedError
    Promise.resolve(null).then(() => {
      this._isLoadingData = value;
      if (this._isLoadingData === false) { this._blockUI = false; }
    });
  }

  async add(message: string) {
    this.messages.push(message);
    const toast = await this.toastController.create({ message, duration: 2000 });
    toast.present();
  }

  async addError(message: string) {
    this.messages.push(message);
    const toast = await this.toastController.create({ message, duration: 2000 });
    toast.present();
  }

  clear() {
    this.messages = [];
  }
}
