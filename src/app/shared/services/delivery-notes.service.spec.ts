import { TestBed } from '@angular/core/testing';

import { DeliveryNotesService } from './delivery-notes.service';

describe('DeliveryNotesService', () => {
  let service: DeliveryNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
