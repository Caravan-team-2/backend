## Overview 
this document outlines the integration architecture for our system, detailing the components, data flow, and interaction patterns that enable seamless communication between different inssurance services and our centralized platform.
## Goal
 the primary goal of this architecture is to make sure to keep the abbility to use both of the platforms (the inssurance providers platform and our platform) without any issues, and also to make sure that the data is consistent across all systems.
## Architecture  Diagram

 ```mermaid 
graph TB
    subgraph "E-assurance Platform"
        EA[E-assurance Core]
        EADB[(E-assurance DB)]
    end
    
    subgraph "Kafka Cluster"
        K1[saa-constat.created]
        K2[trust-constat.updated]
        K3[provider-vehicle.verified]
    end
    
    subgraph "SAA Platform" 
        SAA[SAA Core]
        SAADB[(SAA DB)]
        SAAAPI[SAA REST API]
    end
    
    subgraph "Trust Platform"
        TRUST[Trust Core]
        TRUSTDB[(Trust DB)]
        TRUSTAPI[Trust REST API]
    end
    
    EA -->|Publish| K1
    EA -->|Publish| K2
    K1 -->|Subscribe| SAA
    K2 -->|Subscribe| TRUST
    
    SAA -->|Publish| K1
    TRUST -->|Publish| K2
    K1 -->|Subscribe| EA
    K2 -->|Subscribe| EA
    
    %% REST API exposure for GET operations
    SAAAPI -.->|GET Requests| EA
    TRUSTAPI -.->|GET Requests| EA
    
```
## components
 1. **KAFKA** 
    - **Description**: A distributed event streaming platform used for building real-time data pipelines and streaming applications.
    - **Role**: Acts as the backbone for data ingestion and real-time processing, enabling asynchronous communication between services.
    - **details**: so what will happen is that our app will publish events to kafka topics (those topics are generated based on a static topic names and the id of the provider meant for it for example: `providerA-constat.created`), and other services can subscribe to these topics to consume the events.
2 **Eassurance**
    - **Description**: A centralized platform that aggregates data from various insurance providers and offers a unified interface for users.
    - **Role**: Serves as the main hub for data processing, storage, and user interaction.
    - **details**: Eassurance will produce events  to Kafka when a an inssurance providers decides to use the platform , and also consume events from Kafka when the company uses their own platform to update its database . 
3. **Insurance Providers Platforms**
    - **Description**: Individual platforms operated by different insurance providers.
    - **Role**:
      - Publish events to Kafka when there are updates or changes in their systems (e.g., new claims, policy updates).
        - Consume events from Kafka to keep their systems in sync with the centralized platform.
        - expose restful APIs for specific operations that cannot be handled through event streaming. (Get Operrations)
    - **details**: Each insurance provider will have its own Platforms

## Specifications 
1. **Event Topics**: Define Kafka topics for different event types (e.g., `constat.created`, `constat.updated`, `vehicle.verified `).
2. **Data Models**: Standardize data models for events to ensure consistency across different services. that will be included on the documentation
3. **API Endpoints**: Define RESTful API endpoints for operations that require direct interaction that will also be included on the documentation
4. **Security**: Implement authentication and authorization using api keys 
## Data flow
1. **Event Publishing**: When an event occurs in either the E-assurance platform or an insurance provider's platform (e.g., a new claim is created), the respective service publishes an event to the appropriate Kafka topic.
2. **Event Consumption**: Other services that are interested in these events subscribe to the relevant Kafka topics. When an event is published, the subscribing services consume the event and process it accordingly.
3. **Data Synchronization**: The consuming services update their databases based on the events they receive, ensuring that all systems remain consistent and up-to-date.
4. **API Interactions**: For operations that require direct interaction (e.g., fetching specific data), services can make RESTful API calls to each other as needed.
## Interaction patterns
1. **Asynchronous Communication**: The primary mode of interaction between services is through Kafka, allowing for decoupled and scalable communication.
2. **Event-Driven Architecture**: Services react to events as they occur, enabling real-time data processing and responsiveness.
3. **RESTful APIs**: For specific operations that cannot be handled through event streaming, services expose RESTful APIs for direct interaction.
## Conclusion
this integration architecture provides a robust framework for seamless communication between the E-assurance platform and various insurance providers. By leveraging Kafka for event streaming and RESTful APIs for direct interactions, we ensure data consistency
