import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnChanges {
  form: FormGroup;
  @Output() studentAdded = new EventEmitter<{ studentname: string; grade: number }>();
  @Input() studentExists: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      studentname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[א-ת]+$')
      ]],
      grade: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$')
      ]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['studentExists']) {
      this.studentExists = changes['studentExists'].currentValue;
    }
  }

  onSubmit() {
    if (this.form.valid && !this.studentExists) {
      this.studentAdded.emit(this.form.value);
      this.form.reset();
    }
  }
}
