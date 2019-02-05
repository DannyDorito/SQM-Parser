import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassTemplateComponent } from './class-template.component';

describe('ClassTemplateComponent', () => {
  let component: ClassTemplateComponent;
  let fixture: ComponentFixture<ClassTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
