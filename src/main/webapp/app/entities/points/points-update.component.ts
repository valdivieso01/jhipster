import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { IPoints, Points } from 'app/shared/model/points.model';
import { PointsService } from './points.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-points-update',
  templateUrl: './points-update.component.html'
})
export class PointsUpdateComponent implements OnInit {
  isSaving = false;

  users: IUser[] = [];
  dateDp: any;

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    exercise: [],
    meals: [],
    alcohol: [],
    notes: [null, [Validators.maxLength(140)]],
    user: []
  });

  constructor(
    protected pointsService: PointsService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ points }) => {
      this.updateForm(points);

      this.userService
        .query()
        .pipe(
          map((res: HttpResponse<IUser[]>) => {
            return res.body ? res.body : [];
          })
        )
        .subscribe((resBody: IUser[]) => (this.users = resBody));
    });
  }

  updateForm(points: IPoints): void {
    this.editForm.patchValue({
      id: points.id,
      date: points.date,
      exercise: points.exercise,
      meals: points.meals,
      alcohol: points.alcohol,
      notes: points.notes,
      user: points.user
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const points = this.createFromForm();
    if (points.id !== undefined) {
      this.subscribeToSaveResponse(this.pointsService.update(points));
    } else {
      this.subscribeToSaveResponse(this.pointsService.create(points));
    }
  }

  private createFromForm(): IPoints {
    return {
      ...new Points(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      exercise: this.editForm.get(['exercise'])!.value,
      meals: this.editForm.get(['meals'])!.value,
      alcohol: this.editForm.get(['alcohol'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      user: this.editForm.get(['user'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPoints>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IUser): any {
    return item.id;
  }
}
