import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit {
  ongoingTraining$: Observable<boolean>;

  constructor(private store: Store<fromTraining.State>) {
    this.ongoingTraining$ = this.store.select(
      fromTraining.getIsTrainingOngoing
    );
  }

  ngOnInit(): void {}
}
