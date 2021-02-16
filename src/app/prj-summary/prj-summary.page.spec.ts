import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrjSummaryPage } from './prj-summary.page';

describe('PrjSummaryPage', () => {
  let component: PrjSummaryPage;
  let fixture: ComponentFixture<PrjSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrjSummaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrjSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
