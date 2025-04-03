# Vehicle API

This is a Spring Boot REST API project for vehicle management.

## Prerequisites

- Java 21
- Maven
- MySQL 8.0 or higher
- Your favorite IDE (IntelliJ IDEA, Eclipse, VS Code, etc.)

## Project Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd vehicle-api
```

2. Configure MySQL:
- Make sure MySQL is running on your system
- The default configuration uses:
  - Database: vehicle_db (will be created automatically)
  - Username: dfanso
  - Password: root
  - Port: 3306
- You can modify these settings in `src/main/resources/application.properties`

## Running the Application

### Using Maven Command Line

1. Clean and install dependencies:
```bash
./mvnw clean install
```

2. Run the application:
```bash
./mvnw spring-boot:run
```

### Using IDE

1. Import the project as a Maven project
2. Run the main class `VehicleApplication.java`

The application will start on `http://localhost:8080`

## Project Structure

- `src/main/java/com/vehicle` - Contains the application source code
- `src/main/resources` - Contains application properties and configurations
- `src/test` - Contains test cases

## Technologies Used

- Spring Boot 3.4.4
- Spring Web (REST APIs)
- Spring Data JPA (Database operations)
- MySQL (Database)
- Lombok (Reduce boilerplate code)
- Maven (Dependency management)

## API Documentation

### Health Check Endpoint

```http
GET /api/health
```

Returns the current health status of the API.

#### Response

```json
{
    "status": "UP",
    "timestamp": "2024-04-03T12:00:00",
    "service": "Vehicle API"
}
```

- `status`: Current status of the service
- `timestamp`: Current server time
- `service`: Name of the service

The API endpoints will be documented here once they are implemented. 