import { Action } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLETRAININGS: string =
  '[Training] Set Available Trainings';
export const SET_FINISHEDTRAININGS: string =
  '[Training] Set Finished Trainings';
export const START_TRAINING: string = '[Training] Start Training';
export const STOP_TRAINING: string = '[Training] Stop Training';

export class SetAvailableTrainings implements Action {
  readonly type = SET_AVAILABLETRAININGS;

  constructor(public payload: Exercise[]) {}
}

export class SetFinishedTrainings implements Action {
  readonly type = SET_FINISHEDTRAININGS;

  constructor(public payload: Exercise[]) {}
}

export class StartTraining implements Action {
  readonly type = START_TRAINING;

  constructor(public payload: string) {}
}

export class StopTraining implements Action {
  readonly type = STOP_TRAINING;
  readonly payload: undefined;
}

export type TrainingActions =
  | SetAvailableTrainings
  | SetFinishedTrainings
  | StartTraining
  | StopTraining;
