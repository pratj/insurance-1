FROM openjdk:11.0-slim
ARG JAR_FILE=./target/insurance-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 9090
