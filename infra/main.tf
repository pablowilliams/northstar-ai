locals { name = "${var.service_name}-${var.environment}"; tags = { Service = var.service_name, Environment = var.environment, ManagedBy = "terraform", DataClass = "confidential" } }

resource "aws_kms_key" "northstar" { description = "Northstar application and audit encryption"; enable_key_rotation = true; deletion_window_in_days = 30; tags = local.tags }
resource "aws_s3_bucket" "evidence" { bucket = "${local.name}-evidence"; tags = local.tags }
resource "aws_s3_bucket_versioning" "evidence" { bucket = aws_s3_bucket.evidence.id; versioning_configuration { status = "Enabled" } }
resource "aws_s3_bucket_server_side_encryption_configuration" "evidence" { bucket = aws_s3_bucket.evidence.id; rule { apply_server_side_encryption_by_default { kms_master_key_id = aws_kms_key.northstar.arn; sse_algorithm = "aws:kms" } bucket_key_enabled = true } }
resource "aws_s3_bucket_public_access_block" "evidence" { bucket = aws_s3_bucket.evidence.id; block_public_acls = true; block_public_policy = true; ignore_public_acls = true; restrict_public_buckets = true }

resource "aws_dynamodb_table" "approvals" { name = "${local.name}-approvals"; billing_mode = "PAY_PER_REQUEST"; hash_key = "proposal_id"; range_key = "payload_hash"; attribute { name = "proposal_id"; type = "S" } attribute { name = "payload_hash"; type = "S" } ttl { attribute_name = "expires_at"; enabled = true } server_side_encryption { enabled = true; kms_key_arn = aws_kms_key.northstar.arn } point_in_time_recovery { enabled = true } tags = local.tags }
resource "aws_sqs_queue" "dead_letter" { name = "${local.name}-tool-dlq"; kms_master_key_id = aws_kms_key.northstar.arn; message_retention_seconds = 1209600; tags = local.tags }
resource "aws_sqs_queue" "tool_actions" { name = "${local.name}-tool-actions"; kms_master_key_id = aws_kms_key.northstar.arn; visibility_timeout_seconds = 60; redrive_policy = jsonencode({ deadLetterTargetArn = aws_sqs_queue.dead_letter.arn, maxReceiveCount = 3 }); tags = local.tags }

resource "aws_cloudwatch_log_group" "application" { name = "/northstar/${var.environment}/application"; retention_in_days = 365; kms_key_id = aws_kms_key.northstar.arn; tags = local.tags }
resource "aws_sns_topic" "alarms" { name = "${local.name}-alarms"; kms_master_key_id = aws_kms_key.northstar.id; tags = local.tags }
resource "aws_sns_topic_subscription" "email" { topic_arn = aws_sns_topic.alarms.arn; protocol = "email"; endpoint = var.alarm_email }
resource "aws_cloudwatch_metric_alarm" "unsafe_write" { alarm_name = "${local.name}-unsafe-write"; comparison_operator = "GreaterThanThreshold"; evaluation_periods = 1; metric_name = "UnauthorizedWriteAttempts"; namespace = "Northstar/Controls"; period = 60; statistic = "Sum"; threshold = 0; alarm_description = "Page immediately and activate write kill switch"; alarm_actions = [aws_sns_topic.alarms.arn]; treat_missing_data = "notBreaching"; tags = local.tags }
