# Use an official Maven image to build the app
FROM maven:3.8.4-openjdk-17 AS build

# Set working directory
WORKDIR /app

# Copy the pom.xml and install dependencies
COPY pom.xml .

# Download dependencies (this will cache the dependencies)
RUN mvn dependency:go-offline

# Copy the rest of the backend code
COPY src /app/src

# Build the Spring Boot app (produces a jar file in target/)
RUN mvn clean package -DskipTests

# Now, build a second image to run the jar
FROM openjdk:17-jdk-slim

# Set working directory for the running app
WORKDIR /app

# Copy the jar file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 for Spring Boot
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "app.jar"] 