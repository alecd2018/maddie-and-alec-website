web: java $JAVA_OPTS -Xmx256m -jar app/target/*.jar --spring.profiles.active=prod,heroku,no-liquibase --server.port=$PORT 
release: ./mvnw liquibase:update