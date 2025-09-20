# Djezzy Cloud Cost Estimation for 50,000 Daily Requests (Production Ready)

This document provides a detailed cost and resource usage estimation for running a scalable backend system on Djezzy Cloud, designed to handle approximately 50,000 API requests per day with capacity for traffic spikes. The backend architecture references the Caravan NestJS backend with integrated services like PostgreSQL, Kafka, Redis, Cloudinary, and BullMQ.

---

## 1. Overview

- **Daily traffic:** 50,000 requests (~1.5 million requests monthly)
- **Architecture:** Modular, microservice-ready backend with database, message queue, WebSocket, caching, cloud storage, and real-time features
- **Environment:** Production with scalable infrastructure and monitoring for availability and performance

---

## 2. Djezzy Cloud Pricing Summary

| Tier                  | Estimated Monthly Cost (DZD) | Description                                |
|-----------------------|------------------------------|--------------------------------------------|
| Entry-Level           | ~7,600                       | Basic plan suitable for prototypes         |
| Mid-Tier Production   | 22,000 – 60,000+             | Suitable for sustained production workload |
| Enterprise / Custom   | 60,000+                      | High availability, load balancing, and SLA|

*Note: Pricing scales based on provisioned compute, storage, bandwidth, and ancillary services.*

---

## 3. Production Resource Requirements & Estimated Metrics 
Full ranges are on the summary below

| Resource Type           | Estimated Specs              | Notes on Usage & Spikes                      |
|------------------------|------------------------------|----------------------------------------------|
| **CPU Cores**             | 6 vCPUs                  | Scalable with traffic spikes, multi-core recommended for concurrency |
| **RAM**                   | 8GB RAM                | Supports app services, DB cache, Redis, etc. |
| **Disk Storage (SSD)**    | 250 GB                 | For PostgreSQL DB, logs, media storage       |
| **Disk I/O Throughput**   | 1000 IOPS              | SSD based storage recommended for DB performance |
| **Network Bandwidth**     | 100 Mbps – 1 Gbps            | Handles request payloads, media uploads/downloads, Kafka traffic |
| **Data Transfer (Monthly)** | ~1 – 5 TB                    | Traffic dependent on average payload size and file/media handling |
| **Load Balancer**         | Included (optional scaling)  | Required for fault tolerance and traffic spikes |
| **Caching Layer (Redis)** | 4 – 8 GB RAM                 | Reduces DB load, improves response times     |
| **Message Queue (Kafka)** | Provisioned Topics & Brokers | Handles async communication, scales with event volume |

---

## 4. Cost Breakdown (Approximate)

| Component               | Monthly Cost Estimate (DZD) | Commentary                                   |
|------------------------|-----------------------------|----------------------------------------------|
| Base Subscription Plan | 7,600                       | Entry level, base resource pool               |
| Compute (vCPUs & RAM)  | 12,000 – 30,000             | CPU/RAM provisioning for peak load            |
| Storage (SSD + DB)     | 3,000 – 10,000              | Persistent all-flash storage                   |
| Bandwidth & Traffic     | 4,000 – 15,000              | Depends heavily on request sizes & media loads |
| Ancillary Services     | 3,000 – 8,000               | Redis cache, Kafka brokers, email, PDF gen.  |
| **Total Estimated Cost**| **29,600 – 70,600+**        | Fully operational backend capable of scaling |

---

## 5. Traffic & Performance Considerations

- Backend must handle **peak concurrent spikes** exceeding typical traffic by 25-50%.
- Proper **auto-scaling** or manual provisioning to avoid request lag or downtime.
- Use of **Redis caching** and **Kafka asynchronous processing** to smooth burst loads.
- Bandwidth includes API payloads, WebSocket messages, media uploads/downloads, and possible PDF generation payloads.
- Disk I/O performance crucial for database responsiveness under load.
- Monitoring of **CPU, RAM, disk, and network** with alerting to enable proactivity.

---

## 6. Infrastructure Notes on Djezzy Cloud

- Djezzy Cloud runs on a **hyperconverged, software-defined infrastructure** across multiple data centers, offering high flexibility and reliability.
- Supports a **single API interface** for resource management including compute, storage, and network provisioning.
- Infrastructure designed with **scalability, security, and digital sovereignty** in mind, fitting Algeria’s local enterprise standards.

---

## 7. Summary

| Metric              | Specification Range            |
|---------------------|-------------------------------|
| CPU Cores           | 4 – 8                         |
| RAM                 | 8 – 32 GB                     |
| SSD Storage         | 100 – 500 GB                  |
| Disk IOPS           | 500 – 2000                    |
| Network Bandwidth   | 100 Mbps – 1 Gbps             |
| Monthly Data Transfer| 1 – 5 TB                      |
| Estimated Cost (DZD)| 29,600 – 70,600+              |

This provides a scalable, production-ready setup for handling 50k daily requests with room for traffic spikes and additional services.

---

*Note: All cost estimates and resource specifications are best approximations based on available data and standard cloud infrastructure practices. For final pricing and provisioning, engaging directly with Djezzy Cloud sales with workload specifics is essential.*


