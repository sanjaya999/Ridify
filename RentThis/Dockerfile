FROM openjdk:17-jdk-slim

RUN addgroup --system spring && adduser --system spring --ingroup spring

WORKDIR /app

RUN mkdir -p /app/uploads && chown -R spring:spring /app/uploads

COPY target/RentThis-0.0.1-SNAPSHOT.jar app.jar

RUN chown spring:spring app.jar

USER spring

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD java -cp app.jar org.springframework.boot.actuator.health.HealthEndpoint || exit 1

EXPOSE 8080

# Use exec form and add JVM options for containers
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]