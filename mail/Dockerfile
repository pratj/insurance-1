FROM openjdk:11.0-slim
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} app.jar
CMD ["mkdir","src"]
COPY ./src/key.txt src/key.txt
ENTRYPOINT ["java","-jar","/app.jar"]

