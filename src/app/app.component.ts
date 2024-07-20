import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { StudentListComponent } from './components/student-list/student-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, StudentFormComponent, StudentListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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

  onStudentAdded(student: { studentname: string; grade: number }) {
    this.studentExists = this.isStudentExists(student.studentname);
    if (!this.studentExists) {
      this.students.push(student);
      this.saveStudents();
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

  getAverageGrade(): number {
    const nonDeletedStudents = this.students.filter(student => !student.deleted);
    const total = nonDeletedStudents.reduce((sum, student) => sum + student.grade, 0);
    return nonDeletedStudents.length > 0 ? total / nonDeletedStudents.length : 0;
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
