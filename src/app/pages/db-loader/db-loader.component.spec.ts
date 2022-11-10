import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbLoaderComponent } from './db-loader.component';

describe('DbLoaderComponent', () => {
  let component: DbLoaderComponent;
  let fixture: ComponentFixture<DbLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
