package com.example.publicity.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.publicity.model.PublicityTask;
import com.example.publicity.repository.PublicityTaskRepository;

@Service
@Transactional
public class PublicityTaskServiceImpl implements PublicityTaskService {

    private final PublicityTaskRepository taskRepository;

    @Autowired
    public PublicityTaskServiceImpl(PublicityTaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<PublicityTask> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Optional<PublicityTask> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public PublicityTask createTask(PublicityTask task) {
        return taskRepository.save(task);
    }

    @Override
    public PublicityTask updateTask(Long id, PublicityTask task) {
        task.setId(id);
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public List<PublicityTask> getTasksByStatus(String status) {
        return taskRepository.findByStatus(status);
    }

    @Override
    public List<PublicityTask> getTasksByAssignedTo(String assignedTo) {
        return taskRepository.findByAssignedTo(assignedTo);
    }
} 