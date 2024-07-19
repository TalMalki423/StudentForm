import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  form: FormGroup;
  students: { studentname: string, grade: number, deleted?: boolean }[] = [];
  sortAscending: boolean = true;
  studentExists: boolean = false;

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

  ngOnInit() {
    if (this.isBrowser()) {
      const savedStudents = localStorage.getItem('students');
      if (savedStudents) {
        this.students = JSON.parse(savedStudents);
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const newStudent = this.form.value;
      if (this.isStudentExists(newStudent.studentname)) {
        this.studentExists = true;
      } else {
        this.studentExists = false;
        this.students.push(newStudent);
        this.saveStudents();
        this.form.reset();
      }
    }
  }

  isStudentExists(studentname: string): boolean {
    return this.students.some(student => student.studentname === studentname);
  }

  saveStudents() {
    if (this.isBrowser()) {
      localStorage.setItem('students', JSON.stringify(this.students));
    }
  }

  deleteStudent(student: { studentname: string, grade: number, deleted?: boolean }) {
    student.deleted = !student.deleted;
    this.saveStudents();
  }

  restoreStudent(student: { studentname: string, grade: number, deleted?: boolean }) {
    student.deleted = false;
    this.saveStudents();
  }

  getGradeClass(grade: number) {
    if (grade >= 80) {
      return 'grade-high';
    } else if (grade >= 55) {
      return 'grade-medium';
    } else {
      return 'grade-low';
    }
  }

  sortGrades() {
    this.students.sort((a, b) => this.sortAscending ? b.grade - a.grade : a.grade - b.grade);
    this.sortAscending = !this.sortAscending;
    this.saveStudents();
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
