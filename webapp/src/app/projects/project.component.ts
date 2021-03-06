import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material';

import {Project} from './project';
import {ProjectService} from './project.service';
import {AddProjectComponent} from './dialogs/add-project/add-project.component';
import {EditProjectTitleComponent} from './dialogs/edit-project-title/edit-project-title.component';
import {AddEmployeeToProjectComponent} from './dialogs/add-employee-to-project/add-employee-to-project.component';
import {Employee} from '../employees/employee';
import {EditEmployeeInProjectComponent} from './dialogs/edit-employee-in-project/edit-employee-in-project.component';
import {DeleteProjectComponent} from './dialogs/delete-project/delete-project.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {
  dataSource: Project[] = [];
  isLoadingResults = true;
  displayedColumns: string[] = ['name', 'beginDate', 'endDate', 'employeesCount', 'employees'];
  private subscription: Subscription = null;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private service: ProjectService
  ) { }

  ngOnInit(): void {
    this.refreshTable();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refreshTable(): void {
    this.subscription = this.service.getAll().subscribe(
      data => {
      this.isLoadingResults = false;
      this.dataSource = data;
    });
  }

  getEmployeesCount(project: Project): number {
    return project.employees.length;
  }

  isEmptyEmployees(project: Project): boolean {
    return project.employees.length > 0;
  }

  openAddProjectDialog(): void {
    const project = new Project();
    const dialogRef = this.dialog.open(AddProjectComponent, {
      data: project
    });
    dialogRef.afterClosed().subscribe(
      outProject => {
        if (outProject) {
          this.service.add(project).subscribe(
            proj => {
              this.dataSource.push(proj);
              this.refreshTable();
            });
        }
      });
  }

  openEditTitleDialog(id: number, name: any): void {
    const currentName = name;
    const dialogRef = this.dialog.open(EditProjectTitleComponent, {
      data: currentName
    });
    dialogRef.afterClosed().subscribe(
      outName => {
        if (outName && outName !== currentName) {
          this.service.editProjectName(id, outName).subscribe(
            proj => {
              this.dataSource.push(proj);
              this.refreshTable();
            });
        }
      });
  }

  deleteProject(id: number, name: string): void {
    const dialogRef = this.dialog.open(DeleteProjectComponent, {
      data: name
    });
    dialogRef.afterClosed().subscribe(
      isYes => {
        if (isYes) {
          this.service.delete(id).subscribe(
            () => this.refreshTable()
          );
        }
      });
  }

  openAddEmployeeDialog(project: Project) {
    const dialogRef = this.dialog.open(AddEmployeeToProjectComponent, {
      data: project.name
    });
    dialogRef.afterClosed().subscribe(
      outEmployee => {
        if (outEmployee) {
          this.service.addEmployee(project.id, outEmployee.id).subscribe(
            proj => {
              this.dataSource.push(proj);
              this.refreshTable();
            });
        }
      });
  }

  openChangeEmployeeDialog(project: Project, oldEmployee: Employee): void {
    const currentEmployeeId = oldEmployee.id;
    const dialogRef = this.dialog.open(EditEmployeeInProjectComponent, {
      data: {
        projectName: project.name,
        employeeId: currentEmployeeId
      }
    });
    dialogRef.afterClosed().subscribe(
      outEmployeeId => {
        if (outEmployeeId && outEmployeeId !== currentEmployeeId) {
          this.service.editEmployee(project.id, currentEmployeeId, outEmployeeId).subscribe(
            proj => {
              this.dataSource.push(proj);
              this.refreshTable();
            });
        }
      });
  }

  deleteEmployee(projectId: number, employeeId: number): void {
    this.service.deleteEmployee(projectId, employeeId).subscribe(
      () => this.refreshTable()
    );
  }
}
