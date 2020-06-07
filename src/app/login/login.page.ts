import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Account, NetworkType, SimpleWallet, Password } from 'symbol-sdk';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private storage: StorageService, private alert: AlertService, private router: Router, private userService: UserService) { }

  signedUp: boolean;
  password = '12345678';
  confirmPassword = '12345678';
  loginPassword = '12345678';

  async ionViewDidEnter() {
    this.signedUp = await this.storage.isStored();
    console.log(this.signedUp);
  }

  async signup() {
    const newAccount = Account.generateNewAccount(NetworkType.TEST_NET);
    console.log(this.confirmPassword, this.password);
    if (this.confirmPassword.length === 0 || this.password.length === 0) {
      this.alert.showCustomAlert("Password field empty", "", "");
      console.log(this.confirmPassword, this.password)
    }
    else {
      if (this.password !== this.confirmPassword) {
        this.alert.showCustomAlert("Password mismatch", "Password doesn't match", "Please make sure the password fields match!")
      } else {
        try {
          const password = new Password(this.confirmPassword);
          const newWallet = SimpleWallet.createFromPrivateKey('useraccount', password, newAccount.privateKey, NetworkType.TEST_NET);
          this.storage.storeUserAccount(newWallet);
          this.userService.setUser(newWallet.open(password))
          this.router.navigate(['/main']);
        } catch (e) {
          console.log(e)
          this.alert.showCustomAlert("Password must be more than eight characters", "", "");
        }
      }
    }
  }
  async login() {
    if (this.loginPassword === "" || this.loginPassword === undefined) {
      this.alert.showCustomAlert("Password field empty", "", "");
    } else {
      const accountRetreival = await this.storage.getUserAccount();
      const password = new Password(this.loginPassword);
      try {
        const account = accountRetreival.open(password);
        if (account !== undefined) {
          this.userService.setUser(accountRetreival.open(password));
          this.router.navigate(['/main']);
        } else {
          this.alert.showCustomAlert("Wrong password", "We weren't able to decrypt your wallet.", "");
        }
      } catch (e) {
        this.alert.showCustomAlert("Wrong password", "We weren't able to decrypt your wallet.", "");
      }
    }
  }
}
