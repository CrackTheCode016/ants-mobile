export interface Option {
    selected: boolean;
    option: string | boolean;
}

export interface Question {
    questionKey: string;
    questionText: string;
    options: Map<number, Option>;
}

export interface Answer {
    key: string;
    value: boolean | string;
}