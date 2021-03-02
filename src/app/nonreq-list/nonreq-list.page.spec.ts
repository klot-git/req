import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NonreqListPage } from './nonreq-list.page';

describe('NonreqListPage', () => {
  let component: NonreqListPage;
  let fixture: ComponentFixture<NonreqListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonreqListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NonreqListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
