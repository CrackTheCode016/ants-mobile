import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Account, MosaicId } from 'symbol-sdk';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {

  constructor(private userService: UserService) { }
  balance = 0;
  canTakeSurvey = false;
  user: Account;
  ionViewDidEnter() {
    this.user = this.userService.getUser();
    console.log(this.user)
    this.userService.getUserBalance(this.user.address, new MosaicId('5CC9FD1F810E67AB')).subscribe((b) => {
      this.balance = b;
    })
    this.userService.checkIfUserCanSubmitSurvey(this.user.address).subscribe((b) => {
      console.log('BOOL', b)
      this.canTakeSurvey = b
    })
  }
}
