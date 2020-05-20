import { Component, OnInit } from '@angular/core';

interface Option {
  selected: boolean;
  option: string;
}

interface Question {
  questionKey: string;
  questionText: string;
  options: Map<number, Option>;
}

interface Answer {
  key: string,
  value: boolean | string;
}

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {

  constructor() { }

  previousSelectedId: number;
  previousSelectedOption: Option;
  currentOptions: Map<number, Option>;
  currentQuestion: Question;
  questions: Question[] = [];
  answers: Answer[] = [];
  questionCount: number;
  questionProgression: number;

  handleSelection(id: number, option: Option) {
    console.log(id, this.previousSelectedId)
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

  generateDataReport(answers: Answer[]) {
    // answers to datareport, send to blockchain
  }

  fetchQuestions() {
    // fetch schema for survey
  }

  nextQuestion() {
  }

  ngOnInit() {
    const options: Map<number, Option> = new Map();
    options.set(1, {
      selected: false,
      option: 'NULL'
    });
    options.set(2, {
      selected: false,
      option: 'NULL'
    });
    options.set(3, {
      selected: false,
      option: 'NULL'
    });
    options.set(4, {
      selected: false,
      option: 'NULL'
    });
    options.set(5, {
      selected: false,
      option: 'NULL'
    });
    this.questions.push({ questionKey: 'feeling', questionText: 'How are you feeling?', options });
    this.questions.push({ questionKey: 'sentiment', questionText: 'How are you feeling?', options });
    this.currentQuestion = this.questions[0];
    this.currentOptions = this.currentQuestion.options;
    this.questionProgression = 1;
    this.questionCount = this.questions.length;
  }

}
