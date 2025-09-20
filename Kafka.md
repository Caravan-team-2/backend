# Kafka Authorization Model & Automated Provider Provisioning

## Architecture Overview

Our E-assurance platform uses a centralized Kafka cluster for event-driven communication between insurance providers, with automated provisioning for new providers.

### Core Components
- **E-assurance Platform**: Central platform that consumes all provider events
- **Centralized Kafka Cluster**: Message broker with topic-level security
- **Insurance Providers**: Individual platforms (SAA, Trust, etc.) with REST APIs
- **Provider Registration Service**: Automated onboarding system (A nestjs Module to be impleneted soon with automations integration )

## Topic Naming Convention

```
Format: {providerPrefix}-{eventType}.{action}

Examples:
- saa-constat.created
- trust-policy.updated  
- allianz-claim.processed
- shared-vehicle.verified
```

## Kafka Authorization Model

### User Authentication Setup

```bash
# Create E-assurance admin user
kafka-configs.sh --bootstrap-server kafka-cluster:9092 --alter \
  --add-config 'SCRAM-SHA-256=[password=eassurance-admin-secret]' \
  --entity-type users --entity-name eassurance-user

# Create provider users
kafka-configs.sh --bootstrap-server kafka-cluster:9092 --alter \
  --add-config 'SCRAM-SHA-256=[password=saa-secret-key]' \
  --entity-type users --entity-name saa-user

kafka-configs.sh --bootstrap-server kafka-cluster:9092 --alter \
  --add-config 'SCRAM-SHA-256=[password=trust-secret-key]' \
  --entity-type users --entity-name trust-user
```

### Access Control Lists (ACLs)

#### E-assurance Platform Permissions
```bash
# E-assurance can read from ALL provider topics to consume events
kafka-acls.sh --bootstrap-server kafka-cluster:9092 --add \
  --allow-principal User:eassurance-user \
  --operation Read --topic "*-constat.created" \
  --operation Read --topic "*-policy.updated" \
  --operation Read --topic "*-claim.processed"

# E-assurance can write to shared topics
kafka-acls.sh --bootstrap-server kafka-cluster:9092 --add \
  --allow-principal User:eassurance-user \
  --operation Write --topic "shared-*"

# E-assurance consumer group permissions
kafka-acls.sh --bootstrap-server kafka-cluster:9092 --add \
  --allow-principal User:eassurance-user \
  --operation Read --group "eassurance-consumer-group"
```

#### Provider-Specific Permissions
```bash
# SAA Platform - can only read/write SAA topics + shared topics
kafka-acls.sh --bootstrap-server kafka-cluster:9092 --add \
  --allow-principal User:saa-user \
  --operation Read --topic "saa-*" \
  --operation Write --topic "saa-*" \
  --operation Read --topic "shared-*" \
  --operation Read --group "saa-consumer-group"

# Trust Platform - can only read/write Trust topics + shared topics
kafka-acls.sh --bootstrap-server kafka-cluster:9092 --add \
  --allow-principal User:trust-user \
  --operation Read --topic "trust-*" \
  --operation Write --topic "trust-*" \
  --operation Read --topic "shared-*" \
  --operation Read --group "trust-consumer-group"
```

## Automated Provider Provisioning

### Provider Registration API

```typescript
// POST /api/providers/register
interface ProviderRegistrationRequest {
  providerId: string;           // e.g., "allianz"
  providerName: string;         // e.g., "Allianz Insurance"
  contactEmail: string;
  apiEndpoints: {
    baseUrl: string;
    healthCheck: string;
  };
  eventTypes: string[];         // e.g., ["constat.created", "policy.updated"]
}
```

### Auto-Provisioning Script

```bash
#!/bin/bash
# auto-provision-provider.sh

set -e

PROVIDER_ID=$1
KAFKA_CLUSTER="kafka-cluster:9092"
EVENT_TYPES=("constat.created" "policy.updated" "claim.processed")

echo "🚀 Provisioning new provider: $PROVIDER_ID"

# 1. Create provider-specific topics
echo "📝 Creating topics for $PROVIDER_ID..."
for event_type in "${EVENT_TYPES[@]}"; do
    topic_name="${PROVIDER_ID}-${event_type}"
    
    kafka-topics.sh --create \
        --bootstrap-server $KAFKA_CLUSTER \
        --topic $topic_name \
        --partitions 3 \
        --replication-factor 3 \
        --config cleanup.policy=compact \
        --config retention.ms=604800000
    
    echo "✅ Created topic: $topic_name"
done

# 2. Generate secure credentials
KAFKA_USERNAME="${PROVIDER_ID}-user"
KAFKA_PASSWORD=$(openssl rand -base64 32)

echo "🔐 Creating Kafka user: $KAFKA_USERNAME"
kafka-configs.sh --bootstrap-server $KAFKA_CLUSTER --alter \
    --add-config "SCRAM-SHA-256=[password=$KAFKA_PASSWORD]" \
    --entity-type users --entity-name $KAFKA_USERNAME

# 3. Set up ACLs for the new provider
echo "🛡️ Setting up permissions..."

# Provider can read/write their own topics
kafka-acls.sh --bootstrap-server $KAFKA_CLUSTER --add \
    --allow-principal "User:$KAFKA_USERNAME" \
    --operation Read --topic "${PROVIDER_ID}-*" \
    --operation Write --topic "${PROVIDER_ID}-*"

# Provider can read shared topics
kafka-acls.sh --bootstrap-server $KAFKA_CLUSTER --add \
    --allow-principal "User:$KAFKA_USERNAME" \
    --operation Read --topic "shared-*"

# Provider can use their consumer group
kafka-acls.sh --bootstrap-server $KAFKA_CLUSTER --add \
    --allow-principal "User:$KAFKA_USERNAME" \
    --operation Read --group "${PROVIDER_ID}-consumer-group"

# 4. Update E-assurance permissions to read new provider topics
echo "🔄 Updating E-assurance permissions..."
for event_type in "${EVENT_TYPES[@]}"; do
    kafka-acls.sh --bootstrap-server $KAFKA_CLUSTER --add \
        --allow-principal "User:eassurance-user" \
        --operation Read --topic "${PROVIDER_ID}-${event_type}"
done

# 5. Generate provider configuration file
cat > "${PROVIDER_ID}-config.yaml" << EOF
provider:
  id: "$PROVIDER_ID"
  name: "$PROVIDER_ID Insurance Platform"
  
kafka:
  bootstrapServers: "$KAFKA_CLUSTER"
  security:
    protocol: "SASL_SSL"
    sasl:
      mechanism: "SCRAM-SHA-256"
      username: "$KAFKA_USERNAME"
      password: "$KAFKA_PASSWORD"
  consumer:
    groupId: "${PROVIDER_ID}-consumer-group"
  topics:
    consume: ["${PROVIDER_ID}-constat.created", "shared-vehicle.verified"]
    produce: ["${PROVIDER_ID}-policy.updated", "${PROVIDER_ID}-claim.processed"]

api:
  key: "ak_${PROVIDER_ID}_$(openssl rand -hex 16)"
  secret: "as_$(openssl rand -hex 24)"
  baseUrl: "https://eassurance-api.com/v1"
EOF

echo "✅ Provider $PROVIDER_ID provisioned successfully!"
echo "📋 Configuration saved to: ${PROVIDER_ID}-config.yaml"
echo "🔑 Kafka Username: $KAFKA_USERNAME"
echo "🗂️  Topics created: ${EVENT_TYPES[@]/#/${PROVIDER_ID}-}"
```


