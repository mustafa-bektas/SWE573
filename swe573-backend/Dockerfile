# Use OpenJDK as the base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the built Spring Boot JAR into the container
COPY target/swe573-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the backend application port (usually 8080)
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
