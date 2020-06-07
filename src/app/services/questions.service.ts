import { Injectable, Inject } from '@angular/core';
import { Question, Answer, Option } from '../model/common.model';
import { Observable, from } from 'rxjs';
import { SchemaHttp, ReportHttp, DataReport, ReportDataPoint, Archive, DataSchema, SchemaProperty, Type, ArchiveHttp } from 'ants-protocol-sdk';
import { mergeMap, toArray, map } from 'rxjs/operators';
import { Account, Listener, NamespaceRepository, NamespaceHttp, RepositoryFactoryHttp, TransactionAnnounceResponse } from 'symbol-sdk';
import { Incentive } from 'ants-protocol-sdk/dist/src/model/incentive';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private schemaHttp: SchemaHttp;
  private reportHttp: ReportHttp;
  private archiveHttp: ArchiveHttp

  private ARCHIVE_NAME = 'antsmobileapp';
  private SCHEMA_NAME = 'generalsurvey';
  private NODE_URL = 'http://178.128.184.107:3000';
  private KEY_TO_QUESTION_MAPPING = {
    howareyoufeeling: {
      value: 'Are you feeling well today? (mentally / physically)',
      options: new Map<number, Option>([
        [1, { selected: false, option: 'Yes' }],
        [2, { selected: false, option: 'No' }]],
      )
    },
    howislockdown: {
      value: 'How do you feel about the lockdown?',
      options: new Map<number, Option>([
        [1, { selected: false, option: 'Satisfied' }],
        [2, { selected: false, option: 'Dissatisfied' }]],
      )
    },
    waslockdowntoostrict: {
      value: 'Do you feel that the lockdown in your area was too strict - or not strict enough?',
      options: new Map<number, Option>([
        [1, { selected: false, option: 'It was too strict' }],
        [2, { selected: false, option: 'It wasn\'\t strict enough' }]],
      )
    },
    didloseyourjob: {
      value: 'Did you lose your job as a result of COVID-19?',
      options: new Map<number, Option>([
        [1, { selected: false, option: 'Yes' }],
        [2, { selected: false, option: 'No' }]],
      )
    },
    supplies: {
      value: 'Since the COVID-19 crisis started, have you been able to find what you need in terms of supplies?',
      options: new Map<number, Option>([
        [1, { selected: false, option: 'Yes' }],
        [2, { selected: false, option: 'No' }]],
      )
    },
    government: {
      value: 'Do you feel that your government has done enough to aid citizens during the crisis?',
      options: new Map<number, Option>([
        [1, { selected: false, option: 'Yes' }],
        [2, { selected: false, option: 'No' }]],
      )
    },
    peopleinfected: {
      value: 'How many people do you know, personally, that have been infected with COVID-19',
      options: new Map<number, Option>([
        [1, { selected: false, option: 'None' }],
        [2, { selected: false, option: 'Under 5' }],
        [3, { selected: false, option: 'Above 5, Under 15' }],
        [4, { selected: false, option: 'Above 20' }]],
      )
    },
    diagnosis: {
      value: 'Have you been diagnosed with COVID-19?',
      options: new Map<number, Option>([
        [1, { selected: false, option: 'Yes' }],
        [2, { selected: false, option: 'No' }]],
      )
    },
  };

  constructor() {
    this.schemaHttp = new SchemaHttp(this.NODE_URL);
    this.reportHttp = new ReportHttp(this.NODE_URL);
    this.archiveHttp = new ArchiveHttp(this.NODE_URL)
  }

  fetchQuestions(): Observable<Question[]> {
    return this.schemaHttp.getSchemaByName(this.ARCHIVE_NAME, this.SCHEMA_NAME)
      .pipe(
        mergeMap((schema) => schema.properties),
        map((property) => {
          const question: Question = {
            questionKey: property.key,
            questionText: this.KEY_TO_QUESTION_MAPPING[property.key].value,
            options: this.KEY_TO_QUESTION_MAPPING[property.key].options
          }
          return question;
        }),
        toArray()
      );
  }

  sendAnswers(answers: Answer[], account: Account): Observable<TransactionAnnounceResponse> {
    const reportDataPoints = answers.map((answer) => new ReportDataPoint(answer.key, answer.value));
    console.log(reportDataPoints)
    const report = new DataReport(this.SCHEMA_NAME, 'user', reportDataPoints);
    return this.archiveHttp.getArchiveByName(this.ARCHIVE_NAME).pipe(
      mergeMap((archive) => this.reportHttp.announceReportToArchive(account, report, this.SCHEMA_NAME, archive))
    );
  }
}
