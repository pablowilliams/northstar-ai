output "evidence_bucket" { value = aws_s3_bucket.evidence.id }
output "approval_table" { value = aws_dynamodb_table.approvals.name }
output "tool_queue_url" { value = aws_sqs_queue.tool_actions.url }
output "application_log_group" { value = aws_cloudwatch_log_group.application.name }
