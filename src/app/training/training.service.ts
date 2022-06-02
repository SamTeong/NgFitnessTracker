import { Injectable, OnDestroy } from '@angular/core';
import { map, Subscription, take } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Exercise, exerciseDefault } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService implements OnDestroy {
  private firebaseSubscription: Subscription[] = [];
  private availableExercisesCollection = this.db.collection<Exercise>(
    'available-exercises'
  );
  private finishedExercisesCollection =
    this.db.collection<Exercise>('finished-exercises');

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnDestroy(): void {
    this.cancelSubscriptions();
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.firebaseSubscription.push(
      this.availableExercisesCollection
        .snapshotChanges()
        .pipe(
          map((actions) =>
            actions.map((a) => {
              const data = a.payload.doc.data();
              data.id = a.payload.doc.id;
              return data;
            })
          )
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          },
          (error) => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar(error.message, undefined, 5000);
          }
        )
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise) => {
        if (exercise != exerciseDefault) {
          this.addDataToDatabase({
            ...exercise,
            date: new Date(),
            state: 'completed',
          });
        }
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise) => {
        if (exercise != exerciseDefault) {
          this.addDataToDatabase({
            ...exercise,
            duration: exercise.duration * (progress / 100),
            calories: exercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled',
          });
        }
        this.store.dispatch(new Training.StopTraining());
      });
  }

  fetchCompletedOrCancelledExercises() {
    this.firebaseSubscription.push(
      this.finishedExercisesCollection.valueChanges().subscribe(
        (exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        },
        () => {
          // console.log(error);
        }
      )
    );
  }

  cancelSubscriptions() {
    this.firebaseSubscription.forEach((sub) => sub?.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.finishedExercisesCollection.add(exercise);
  }
}
