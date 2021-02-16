import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReqListPage } from './req-list.page';

describe('ReqListPage', () => {
  let component: ReqListPage;
  let fixture: ComponentFixture<ReqListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReqListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
