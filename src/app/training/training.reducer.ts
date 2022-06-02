import { Exercise, exerciseDefault } from './exercise.model';
import {
  SET_AVAILABLETRAININGS,
  SET_FINISHEDTRAININGS,
  START_TRAINING,
  STOP_TRAINING,
  TrainingActions,
} from './training.actions';
import * as fromRoot from '../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: exerciseDefault,
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLETRAININGS:
      return {
        ...state,
        availableExercises: action.payload,
      };
    case SET_FINISHEDTRAININGS:
      return {
        ...state,
        finishedExercises: action.payload,
      };
    case START_TRAINING:
      return {
        ...state,
        activeTraining: {
          ...state.availableExercises.find((x) => x.id === action.payload),
        },
      };
    case STOP_TRAINING:
      return { ...state, activeTraining: exerciseDefault };
    default:
      return state;
  }
}

export const getTrainingState =
  createFeatureSelector<TrainingState>('training');

export const getAvailableTrainings = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercises
);
export const getFinishedTrainings = createSelector(
  getTrainingState,
  (state: TrainingState) => state.finishedExercises
);
export const getActiveTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining
);
export const getIsTrainingOngoing = createSelector(
  getTrainingState,
  (state: TrainingState) =>
    !!state.activeTraining && state.activeTraining != exerciseDefault
);
