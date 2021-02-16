import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReqDetailPage } from './req-detail.page';

describe('ReqDetailPage', () => {
  let component: ReqDetailPage;
  let fixture: ComponentFixture<ReqDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReqDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
