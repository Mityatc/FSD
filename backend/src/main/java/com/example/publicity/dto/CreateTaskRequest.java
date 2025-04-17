package com.example.publicity.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    private String assignedTo;
    
    @NotNull(message = "Deadline is required")
    private LocalDateTime deadline;
} 