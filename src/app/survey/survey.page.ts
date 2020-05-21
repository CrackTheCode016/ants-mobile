import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Option {
  selected: boolean;
  option: string | boolean;
}

interface Question {
  questionKey: string;
  questionText: string;
  options: Map<number, Option>;
}

interface Answer {
  key: string;
  value: boolean | string;
}

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {

  constructor(private router: Router) { }

  previousSelectedId: number;
  previousSelectedOption: Option;
  currentOptions: Map<number, Option>;
  selectedOption: Option;
  currentQuestion: Question;
  questions: Question[] = [];
  answers: Answer[] = [];
  questionCount: number;
  questionProgression: number;

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

  generateDataReport(answers: Answer[]) {
    // answers to datareport, send to blockchain
    console.log(answers)
  }

  fetchQuestions() {
    // fetch schema for survey
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
    this.questionProgression = 0;
    this.currentQuestion = this.questions[this.questionProgression];
    this.currentOptions = this.currentQuestion.options;
    this.questionCount = this.questions.length;
  }

  nextQuestion() {
    console.log(this.previousSelectedOption);
    this.questionProgression++;
    this.answers.push({ key: this.currentQuestion.questionKey, value: this.previousSelectedOption.option });
    if (this.questionProgression === this.questions.length) {
      // Submit report from answer array, then navigate to congrats once done processing
      // last answer
      this.generateDataReport(this.answers);
      this.router.navigate(['/congrats']);
    } else {
      this.currentQuestion = this.questions[this.questionProgression];
    }
  }

  ngOnInit() {
    this.fetchQuestions();
  }

}
