import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicityTaskService } from '../../services/publicity-task.service';
import { PublicityTask } from '../../models/publicity-task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  taskId: number | null = null;

  constructor(
    @Inject(PublicityTaskService) private taskService: PublicityTaskService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['', Validators.required],
      status: ['PENDING', Validators.required],
      assignedTo: [''],
      deadline: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task: PublicityTask) => {
        if (task.deadline) {
          const date = new Date(task.deadline);
          this.taskForm.patchValue({
            ...task,
            deadline: date
          });
        } else {
          this.taskForm.patchValue(task);
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load task. Please try again later.';
        this.loading = false;
        console.error('Error loading task:', err);
      }
    });
  }

  onSubmit(): void {
    console.log('Form submission started');
    console.log('Form valid:', this.taskForm.valid);
    console.log('Form values:', this.taskForm.value);
    
    if (this.taskForm.valid) {
      this.loading = true;
      this.error = null;

      const formValue = this.taskForm.value;
      console.log('Raw form values:', formValue);

      // Validate required fields
      if (!formValue.title || !formValue.type || !formValue.status || !formValue.deadline) {
        this.error = 'Please fill in all required fields';
        this.loading = false;
        return;
      }

      // Create a new Date object from the form's date string
      const deadlineDate = new Date(formValue.deadline);
      // Set time to noon to avoid timezone issues
      deadlineDate.setHours(12, 0, 0, 0);

      const taskData: PublicityTask = {
        title: formValue.title,
        description: formValue.description || '',
        type: formValue.type,
        status: formValue.status,
        assignedTo: formValue.assignedTo || '',
        deadline: deadlineDate
      };

      console.log('Task data to be sent:', taskData);

      const observable = this.isEditMode && this.taskId
        ? this.taskService.updateTask(this.taskId, taskData)
        : this.taskService.createTask(taskData);

      observable.subscribe({
        next: (task: PublicityTask) => {
          console.log('Task saved successfully:', task);
          this.loading = false;
          this.router.navigate(['/tasks']);
        },
        error: (err: any) => {
          console.error('Error saving task:', err);
          this.error = err.message || 'Failed to save task. Please try again later.';
          this.loading = false;
        }
      });
    } else {
      console.log('Form is invalid');
      console.log('Form control errors:', Object.keys(this.taskForm.controls).reduce((acc, key) => {
        const control = this.taskForm.get(key);
        if (control?.errors) {
          acc[key] = control.errors;
        }
        return acc;
      }, {} as any));
      
      this.error = 'Please fix the validation errors before submitting.';
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
