variable "aws_region" { type = string; default = "eu-west-2" }
variable "environment" { type = string; default = "dev"; validation { condition = contains(["dev", "staging", "prod"], var.environment); error_message = "Use dev, staging or prod." } }
variable "service_name" { type = string; default = "northstar" }
variable "alarm_email" { type = string; sensitive = true }
