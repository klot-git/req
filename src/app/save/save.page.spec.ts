import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SavePage } from './save.page';

describe('SavePage', () => {
  let component: SavePage;
  let fixture: ComponentFixture<SavePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
