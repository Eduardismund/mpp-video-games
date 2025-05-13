# Stage 1: Build the Java Application (Gradle)
FROM gradle:8.13.0-jdk21 AS gradle-builder

# Set the working directory in the container
WORKDIR /backend

# Copy the Gradle files
COPY ./ /backend/

# Run the Gradle build (build the Java application)
RUN gradle assemble --no-daemon

# Stage 2: Create the Final Image (JRE 21)
FROM eclipse-temurin:21.0.6_7-jre-ubi9-minimal

# Set working directory
WORKDIR /app

# Copy the built Java application from the gradle-builder stage
COPY --from=gradle-builder /backend/build/libs/mpp-videogames-backend-1.0-SNAPSHOT.jar /app/app.jar

# Expose tomcat port
EXPOSE 8080

#Run Tomcat embedded
CMD ["java", "-jar", "app.jar"]
