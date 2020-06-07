import { Injectable } from '@angular/core';
import { SimpleWallet } from 'symbol-sdk';
import { Storage } from '@ionic/storage';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class StorageService implements CanActivate {

  constructor(public storage: Storage, private router: Router) { }

  private walletPrefix = 'localuseraccount';
  storeUserAccount(wallet: SimpleWallet) {
    this.storage.set(this.walletPrefix, JSON.stringify(wallet.toDTO()))
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.isStored().then((b) => {
      if (!b) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    })
  }

  async getUserAccount(): Promise<SimpleWallet> {
    const wallet = JSON.parse(await this.storage.get(this.walletPrefix));
    return SimpleWallet.createFromDTO(wallet);
  }

  isStored(): Promise<boolean> {
    return this.storage.get(this.walletPrefix).then((d) => {
      return d === null ? false : true;
    });
  }
}
