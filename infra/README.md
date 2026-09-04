# Target AWS infrastructure

The Terraform captures the control-plane primitives that can be reviewed without incurring cloud spend: KMS encryption, immutable/versioned evidence storage, expiring payload-bound approvals, asynchronous tool actions with a dead-letter queue, year-long audit logs and a severity-one unsafe-write alarm.

The production expansion should add private subnets, API Gateway, Lambda/Step Functions, Bedrock, Aurora PostgreSQL with pgvector or OpenSearch, Cognito federation, WAF, CloudTrail, AWS Config and separate workload accounts. Those resources are intentionally not provisioned by default from a portfolio repository.

```bash
terraform init
terraform validate
terraform plan -var='alarm_email=owner@example.com'
```
