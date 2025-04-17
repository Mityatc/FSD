package com.example.publicity.service;

import java.util.List;
import java.util.Optional;

import com.example.publicity.model.PublicityTask;

public interface PublicityTaskService {
    List<PublicityTask> getAllTasks();
    Optional<PublicityTask> getTaskById(Long id);
    PublicityTask createTask(PublicityTask task);
    PublicityTask updateTask(Long id, PublicityTask task);
    void deleteTask(Long id);
    List<PublicityTask> getTasksByStatus(String status);
    List<PublicityTask> getTasksByAssignedTo(String assignedTo);
} 