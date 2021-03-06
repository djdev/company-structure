import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {EmployeeService} from '../../../employees/employee.service';
import {Employee} from '../../../employees/employee';

@Component({
  selector: 'app-edit-employee-in-project',
  templateUrl: './edit-employee-in-project.component.html',
  styleUrls: ['./edit-employee-in-project.component.css']
})
export class EditEmployeeInProjectComponent implements OnInit, OnDestroy {
  projectName: string;
  employeeId: number;
  employees: Employee[] = [];
  private subscription: Subscription = null;

  constructor(
    public employeeService: EmployeeService,
    public dialogRef: MatDialogRef<EditEmployeeInProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      projectName: string,
      employeeId: number
    }
  ) {
    this.projectName = data.projectName;
    this.employeeId = data.employeeId;
  }

  ngOnInit(): void {
    this.subscription = this.employeeService.getAll().subscribe(
      employees => this.employees = employees
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
