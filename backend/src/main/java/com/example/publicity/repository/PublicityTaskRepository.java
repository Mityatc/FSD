package com.example.publicity.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.publicity.model.PublicityTask;

public interface PublicityTaskRepository extends JpaRepository<PublicityTask, Long> {
    List<PublicityTask> findByStatus(String status);
    List<PublicityTask> findByAssignedTo(String assignedTo);
} 