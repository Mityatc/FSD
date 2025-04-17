import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PublicityTaskService } from '../../services/publicity-task.service';
import { PublicityTask } from '../../models/publicity-task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: PublicityTask[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    @Inject(PublicityTaskService) private taskService: PublicityTaskService,
    private router: Router
  ) {
    console.log('TaskListComponent initialized');
  }

  ngOnInit(): void {
    console.log('TaskListComponent ngOnInit called');
    this.loadTasks();
  }

  loadTasks(): void {
    console.log('Loading tasks...');
    this.loading = true;
    this.error = null;
    this.taskService.getAllTasks().subscribe({
      next: (tasks: PublicityTask[]) => {
        console.log('Tasks loaded successfully:', tasks);
        this.tasks = tasks;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading tasks:', err);
        this.error = 'Failed to load tasks. Please try again later.';
        this.loading = false;
      }
    });
  }

  createTask(): void {
    console.log('Navigating to create task');
    this.router.navigate(['/tasks/new']);
  }

  editTask(id: number | undefined): void {
    if (id !== undefined) {
      console.log('Navigating to edit task:', id);
      this.router.navigate(['/tasks', id, 'edit']);
    }
  }

  deleteTask(id: number | undefined): void {
    if (id !== undefined) {
      console.log('Deleting task:', id);
      if (confirm('Are you sure you want to delete this task?')) {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            console.log('Task deleted successfully');
            this.tasks = this.tasks.filter(task => task.id !== id);
          },
          error: (err: any) => {
            console.error('Error deleting task:', err);
            alert('Failed to delete task. Please try again later.');
          }
        });
      }
    }
  }

  getStatusClass(status: string): string {
    const statusClass = `status-${status.toLowerCase().replace(' ', '-')}`;
    console.log('Status class for', status, ':', statusClass);
    return statusClass;
  }
}
