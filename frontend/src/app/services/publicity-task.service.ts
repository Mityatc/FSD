import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { PublicityTask } from '../models/publicity-task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicityTaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {
    console.log('PublicityTaskService initialized with API URL:', this.apiUrl);
  }

  private validateTask(task: PublicityTask): string[] {
    const errors: string[] = [];
    
    if (!task.title || task.title.trim() === '') {
      errors.push('Title is required');
    }
    
    if (!task.type) {
      errors.push('Type is required');
    }
    
    if (!task.status) {
      errors.push('Status is required');
    }
    
    if (!task.deadline) {
      errors.push('Deadline is required');
    } else {
      const date = new Date(task.deadline);
      if (isNaN(date.getTime())) {
        errors.push('Invalid deadline date');
      }
    }
    
    return errors;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'Something went wrong; please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      console.error(`Server returned code ${error.status}, body was:`, error.error);
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Could not connect to the server. Please check if the backend is running.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid data provided. Please check your input.';
        if (error.error && error.error.errors) {
          errorMessage += '\n' + JSON.stringify(error.error.errors);
        }
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
        if (error.error && error.error.message) {
          errorMessage += '\n' + error.error.message;
        }
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  getAllTasks(): Observable<PublicityTask[]> {
    console.log('Fetching all tasks from:', this.apiUrl);
    return this.http.get<PublicityTask[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTaskById(id: number): Observable<PublicityTask> {
    return this.http.get<PublicityTask>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createTask(task: PublicityTask): Observable<PublicityTask> {
    console.log('Service: Creating task - Input:', task);
    
    // Validate task data
    const validationErrors = this.validateTask(task);
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return throwError(() => new Error(validationErrors.join('\n')));
    }
    
    // Format the task data for the backend
    const taskToSend = {
      title: task.title.trim(),
      description: task.description ? task.description.trim() : '',
      type: task.type,
      status: task.status,
      assignedTo: task.assignedTo ? task.assignedTo.trim() : '',
      deadline: this.formatDateForBackend(task.deadline)
    };

    console.log('Service: Task data to send:', taskToSend);
    console.log('Service: Deadline value:', taskToSend.deadline);
    console.log('Service: Making POST request to:', this.apiUrl);
    
    return this.http.post<PublicityTask>(this.apiUrl, taskToSend)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Service: API Error Response:', error);
          console.error('Service: Error Status:', error.status);
          console.error('Service: Error Headers:', error.headers);
          console.error('Service: Error Body:', error.error);
          return this.handleError(error);
        })
      );
  }

  private formatDateForBackend(date: Date | string): string {
    if (!date) {
      console.error('No date provided to formatDateForBackend');
      return '';
    }
    
    try {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) {
        console.error('Invalid date provided:', date);
        return '';
      }
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      console.log('Formatted date:', formattedDate);
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  updateTask(id: number, task: PublicityTask): Observable<PublicityTask> {
    console.log('Service: Updating task - ID:', id, 'Input:', task);
    
    // Validate task data
    const validationErrors = this.validateTask(task);
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors);
      return throwError(() => new Error(validationErrors.join('\n')));
    }
    
    const taskToSend = {
      title: task.title.trim(),
      description: task.description ? task.description.trim() : '',
      type: task.type,
      status: task.status,
      assignedTo: task.assignedTo ? task.assignedTo.trim() : '',
      deadline: this.formatDateForBackend(task.deadline)
    };
    
    console.log('Service: Task data to send:', taskToSend);
    console.log('Service: Making PUT request to:', `${this.apiUrl}/${id}`);
    
    return this.http.put<PublicityTask>(`${this.apiUrl}/${id}`, taskToSend)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTask(id: number): Observable<void> {
    console.log('Service: Deleting task - ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
} 