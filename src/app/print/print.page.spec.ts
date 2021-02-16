import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrintPage } from './print.page';

describe('PrintPage', () => {
  let component: PrintPage;
  let fixture: ComponentFixture<PrintPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
