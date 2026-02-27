# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/jarvis-0.0.1-SNAPSHOT.jar app.jar

# Install curl for health checks
RUN apk add --no-cache curl

# Add a small entrypoint script that waits for Ollama to be available
COPY wait-and-run.sh /app/wait-and-run.sh
RUN chmod +x /app/wait-and-run.sh

# Expose port
EXPOSE 8080

# Run the wait-and-run script
ENTRYPOINT ["/bin/sh", "/app/wait-and-run.sh"]
