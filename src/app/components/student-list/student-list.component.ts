import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent {
  @Input() students: { studentname: string; grade: number; deleted?: boolean }[] = [];
  @Output() studentDeleted = new EventEmitter<{ studentname: string; grade: number; deleted?: boolean }>();
  @Output() studentRestored = new EventEmitter<{ studentname: string; grade: number; deleted?: boolean }>();
  @Output() gradesSorted = new EventEmitter<void>();

  onDelete(student: { studentname: string; grade: number; deleted?: boolean }) {
    this.studentDeleted.emit(student);
  }

  onRestore(student: { studentname: string; grade: number; deleted?: boolean }) {
    this.studentRestored.emit(student);
  }

  onSortGrades() {
    this.gradesSorted.emit();
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
}
