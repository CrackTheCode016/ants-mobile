import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { Option, Question, Answer } from '../model/common.model';
import { QuestionsService } from '../services/questions.service';
import { UserService } from '../services/user.service';
import { Account } from 'symbol-sdk';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})

export class SurveyPage {

  constructor(
    private router: Router,
    private alert: AlertService,
    private questionService: QuestionsService,
    private userService: UserService) { }

  previousSelectedId: number;
  previousSelectedOption: Option;
  currentOptions: Map<number, Option>;
  selectedOption: Option;
  currentQuestion: Question;
  questions: Question[] = [];
  answers: Answer[] = [];
  questionCount: number;
  questionProgression: number;
  user: Account;

  handleSelection(id: number, option: Option) {
    console.log(id, option)
    if (this.previousSelectedId === undefined) {
      this.previousSelectedOption = option;
      this.previousSelectedId = id;
    }
    this.previousSelectedOption.selected = false;
    this.currentOptions.set(this.previousSelectedId, this.previousSelectedOption);
    option.selected = !option.selected;
    this.previousSelectedId = id;
    this.previousSelectedOption = option;
    this.currentOptions.set(id, option);
  }

  async generateDataReport(answers: Answer[]) {
    console.log(answers)
    await this.questionService.sendAnswers(answers, this.user).toPromise();
    this.router.navigate(['/congrats']);
  }

  async fetchQuestions() {
    this.questions = await this.questionService.fetchQuestions().toPromise();
    this.questionProgression = 1;
    this.currentQuestion = this.questions[this.questionProgression - 1];
    this.currentOptions = this.currentQuestion.options;
    this.questionCount = this.questions.length;
  }

  nextQuestion() {
    if (this.previousSelectedOption === undefined) {
      this.alert.showCustomAlert('No Option', 'No Option Selected!', 'Please select an option before proceeding');
    } else {
      this.questionProgression++;
      console.log(this.currentQuestion)
      if (this.questionProgression === this.questionCount + 1) {
        this.answers.push({ key: this.currentQuestion.questionKey, value: this.previousSelectedOption.option });
        this.generateDataReport(this.answers);
      } else {
        this.answers.push({ key: this.currentQuestion.questionKey, value: this.previousSelectedOption.option });
        this.currentQuestion = this.questions[this.questionProgression - 1];
        this.currentOptions = this.currentQuestion.options;
        this.previousSelectedOption = undefined;
        this.previousSelectedId = undefined;
        console.log("progression!", this.questionCount, this.questionProgression)
      }
    }
  }

  back() {
    this.questionProgression--;
    this.answers.push({ key: this.currentQuestion.questionKey, value: this.previousSelectedOption.option });
    this.currentQuestion = this.questions[this.questionProgression - 1];
    this.currentOptions = this.currentQuestion.options;
    this.previousSelectedOption = undefined;
    this.previousSelectedId = undefined;
    console.log("progression!", this.questionCount, this.questionProgression)
  }

  async ionViewDidEnter() {
    this.user = this.userService.getUser();
    this.fetchQuestions();
  }
}
