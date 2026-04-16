
export interface GeneratedContent {
  mapleCode: string;
  matlabCode: string;
  latexContent: string;
}

export interface ProblemInput {
  maplePrompt: string;
  matlabPrompt: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
