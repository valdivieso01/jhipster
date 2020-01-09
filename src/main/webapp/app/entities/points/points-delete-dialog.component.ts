import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPoints } from 'app/shared/model/points.model';
import { PointsService } from './points.service';

@Component({
  templateUrl: './points-delete-dialog.component.html'
})
export class PointsDeleteDialogComponent {
  points?: IPoints;

  constructor(protected pointsService: PointsService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pointsService.delete(id).subscribe(() => {
      this.eventManager.broadcast('pointsListModification');
      this.activeModal.close();
    });
  }
}
