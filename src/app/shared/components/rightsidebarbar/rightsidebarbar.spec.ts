import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rightsidebarbar } from './rightsidebarbar';

describe('Rightsidebarbar', () => {
  let component: Rightsidebarbar;
  let fixture: ComponentFixture<Rightsidebarbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rightsidebarbar],
    }).compileComponents();

    fixture = TestBed.createComponent(Rightsidebarbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
