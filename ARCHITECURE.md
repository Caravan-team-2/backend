
## Table of Contents

* [ High Level Architecture](#-high-level-architecture)
* [ Constat Session Management](#-constat-session-management)
* [Integration Module Architecture](#-integration-module-architecture)

## High Level Architecture

```mermaid 
flowchart TB
 subgraph Saa["Saa"]
        Saa1[" "]
        Saa2["Rest"]
        SaaKafka[("Kafka")]
  end
 subgraph Trust["Trust"]
        Trust1[" "]
        Trust2["Rest"]
        TrustKafka[("Kafka")]
  end
 subgraph Other["Other"]
        Other1[" "]
        Other2["Rest"]
        OtherKafka[("Kafka")]
  end
 subgraph subGraph3["Event Broker"]
        Broker["Publish Event to message broker, with topic=company-uid
---
A company can listen to events, parse them, handle side effects,
and emit events back to the same topic"]
  end
 subgraph subGraph4["AI Server"]
        AI1["Fraud Detection"]
        AI2["OCR verifcation"]
        AI3["Video Generation"]
        AI4["Cost Estimiation"]
  end
 subgraph subGraph5["Core Service"]
        Core["Core Service"]
  end
    SaaKafka --> Broker
    TrustKafka --> Broker
    OtherKafka --> Broker
    Broker --> Kafka[("Kafka")]
    Kafka --> Broker & Redis[("Redis")] & Core
    AI1 --> Core
    AI2 --> Core
    App["App"] --> GraphQL["GraphQL"]
    GraphQL --> Core
    Cloud["Cloud Provider Djezzy"] <--> Core
    Core --> Postgres[("PostgreSQL")]
    n1["Deep<br>Search"] --> AI3
    subGraph4 --> Kafka

    n1@{ shape: cyl}
```
## Constat Session Management 
```mermaid
sequenceDiagram
    participant A as Device A
    participant Socket as Socket Server
   participant Server as Backend Server
    participant Redis as Redis
    participant B as Device B
    participant DB as PostgreSQL
participant Saa as Saa

    A->>Socket: 1/ open a session
    Socket->>Redis: 2/ open the session on redis
    B->>Socket: 3/ join session
    A->>Redis: 4/ update data
    B->>Redis: 4/ update data
    Redis-->>A: 4/ update data
    Redis-->>B: 4/ update data
    A->>Redis: 5/ accept and sign
    B->>Redis: 5/ accept and sign
    Socket->>Server: save constat
    Server->>DB: save constat
    Server->>Saa: send constat via kafka
    Socket->>Redis: close the session
```

## Integration Module Architecture
for more details about this module, please refer to the [INTEGRATION_ARCHITECURE.md](INTEGRATION_ARCHITECURE.md) file.
