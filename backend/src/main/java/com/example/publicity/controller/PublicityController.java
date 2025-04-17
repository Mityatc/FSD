package com.example.publicity.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.publicity.model.PublicityTask;
import com.example.publicity.service.PublicityTaskService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class PublicityController {

    @Autowired
    private PublicityTaskService taskService;

    @GetMapping("/hello")
    public String hello() {
        return "Welcome to Publicity Management System!";
    }

    @PostMapping("/tasks")
    public PublicityTask createTask(@RequestBody PublicityTask task) {
        return taskService.createTask(task);
    }

    @GetMapping("/tasks")
    public List<PublicityTask> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<PublicityTask> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<PublicityTask> updateTask(@PathVariable Long id, @RequestBody PublicityTask task) {
        return ResponseEntity.ok(taskService.updateTask(id, task));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/tasks/status/{status}")
    public ResponseEntity<List<PublicityTask>> getTasksByStatus(@PathVariable String status) {
        return ResponseEntity.ok(taskService.getTasksByStatus(status));
    }

    @GetMapping("/tasks/assigned/{assignedTo}")
    public ResponseEntity<List<PublicityTask>> getTasksByAssignedTo(@PathVariable String assignedTo) {
        return ResponseEntity.ok(taskService.getTasksByAssignedTo(assignedTo));
    }
} 