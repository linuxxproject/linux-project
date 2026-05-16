variable "ssh_public_key" {
  description = "Public SSH key allowed to connect to the EC2 instance."
  type        = string
}

variable "aws_region" {
  description = "AWS region where the EC2 instance is created."
  type        = string
  default     = "eu-west-3"
}

variable "server_name" {
  description = "Name of the Ubuntu server."
  type        = string
  default     = "freelance-pro-server"
}

variable "instance_type" {
  description = "EC2 instance type."
  type        = string
  default     = "t3.micro"
}

variable "ubuntu_version" {
  description = "Ubuntu AMI version pattern."
  type        = string
  default     = "ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"
}

variable "app_directory" {
  description = "Directory where GitHub Actions deploys the application."
  type        = string
  default     = "/home/ubuntu/app"
}
