import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RolesListPage } from './roles-list.page';

describe('RolesListPage', () => {
  let component: RolesListPage;
  let fixture: ComponentFixture<RolesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RolesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
