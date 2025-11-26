import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CanaryWeather API",
      version: "1.0.0",
      description:
        "API documentation for CanaryWeather - Weather alerts and points of interest for the Canary Islands",
      contact: {
        name: "CanaryWeather Team",
        email: "support@canaryweather.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:85",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT token obtained from login or registration",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "User unique identifier",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            username: {
              type: "string",
              description: "User display name",
            },
            profile_picture_url: {
              type: "string",
              nullable: true,
              description: "URL to user profile picture",
            },
            is_admin: {
              type: "boolean",
              description: "Admin privileges flag",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Location: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Location unique identifier",
            },
            name: {
              type: "string",
              description: "Location name",
            },
            latitude: {
              type: "number",
              format: "float",
              nullable: true,
            },
            longitude: {
              type: "number",
              format: "float",
              nullable: true,
            },
          },
        },
        PointOfInterest: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              description: "POI name",
            },
            description: {
              type: "string",
              nullable: true,
            },
            latitude: {
              type: "number",
              format: "float",
            },
            longitude: {
              type: "number",
              format: "float",
            },
            type: {
              type: "string",
              enum: ["local", "global", "personal"],
              description: "Type of point of interest",
            },
            image_url: {
              type: "string",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Alert: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            title: {
              type: "string",
            },
            description: {
              type: "string",
              nullable: true,
            },
            severity: {
              type: "string",
              enum: ["low", "medium", "high", "critical"],
            },
            location_id: {
              type: "integer",
              nullable: true,
            },
            start_time: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            end_time: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            user_id: {
              type: "string",
              format: "uuid",
            },
            message: {
              type: "string",
            },
            is_read: {
              type: "boolean",
              default: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Points of Interest",
        description: "POI management endpoints",
      },
      {
        name: "Alerts",
        description: "Weather alert endpoints",
      },
      {
        name: "Notifications",
        description: "User notification endpoints",
      },
      {
        name: "User Locations",
        description: "User location preferences",
      },
      {
        name: "Admin",
        description: "Administrative endpoints (requires admin privileges)",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
