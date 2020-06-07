import { Injectable, Inject } from '@angular/core';
import { RepositoryFactory, RepositoryFactoryHttp, Address, AccountInfo, MosaicId, TransactionFilter, TransactionType, AggregateTransaction, TransferTransaction, Account } from 'symbol-sdk';
import { Observable, of } from 'rxjs';
import { mergeMap, filter, map, toArray, catchError } from 'rxjs/operators';
import { DataReport, ArchiveHttp } from 'ants-protocol-sdk';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService implements CanActivate {

  private repoFactory: RepositoryFactory;
  private archiveHttp: ArchiveHttp;
  private ARCHIVE_NAME = 'antsmobileapp';
  private NODE_URL = 'http://178.128.184.107:3000';

  private account: Account;

  constructor(private router: Router) {
    this.repoFactory = new RepositoryFactoryHttp(this.NODE_URL);
    this.archiveHttp = new ArchiveHttp(this.NODE_URL);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log(this.getUser());
    if (this.getUser() === undefined) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  setUser(account: Account) {
    this.account = account;
  }

  getUser(): Account {
    return this.account;
  }

  fetchUserBlockchainInfo(address: Address): Observable<AccountInfo> {
    return this.repoFactory.createAccountRepository().getAccountInfo(address)
  }

  checkIfUserCanSubmitSurvey(address: Address): Observable<boolean> {
    let archiveAddress: Address
    return this.archiveHttp.getArchiveByName(this.ARCHIVE_NAME).pipe(
      map((archive) => {
        archiveAddress = archive.namespaceInfo.alias.address;
      }),
      mergeMap((_) => this.repoFactory.createAccountRepository().getAccountTransactions(
        address, undefined, new TransactionFilter({ types: [TransactionType.AGGREGATE_COMPLETE] })).pipe(
          mergeMap((tx) => tx as AggregateTransaction[]),
          filter((tx) =>
            tx.innerTransactions[0] instanceof TransferTransaction &&
            tx.innerTransactions[0].message.payload.includes('REPORT-') &&
            (tx.innerTransactions[0].recipientAddress as Address).plain() === archiveAddress.plain()),
          toArray(),
          map((tx) => DataReport.fromChunksToDataReport(tx[0])),
          map((report) => this.checkTimestampLast24Hours(report.timestamp)),
          catchError((e) => {
            console.log('ERROR', e)
            return of(true)
          })
        ))
    )
  }

  getUserBalance(address: Address, mosaicId: MosaicId): Observable<number> {
    return this.repoFactory.createAccountRepository().getAccountInfo(address).pipe(
      mergeMap((t) => t.mosaics),
      filter((m) => m.id.toHex() === mosaicId.toDTO()),
      map((filteredMosaic) => filteredMosaic.amount.compact())
    );
  }

  private checkTimestampLast24Hours(timestamp: string) {
    const reportDate = new Date(timestamp);
    const currentTime = new Date();
    return currentTime.getTime() >= (reportDate.getTime() + 86400000);
  }
}
