output "server_ip" {
  description = "Public IPv4 address of the Ubuntu server."
  value       = aws_instance.app.public_ip
}

output "app_url" {
  description = "Laravel application URL exposed by docker-compose."
  value       = "http://${aws_instance.app.public_ip}:8000"
}

output "angular_url" {
  description = "Angular application URL exposed by docker-compose."
  value       = "http://${aws_instance.app.public_ip}:4200"
}

output "phpmyadmin_url" {
  description = "phpMyAdmin URL exposed by docker-compose."
  value       = "http://${aws_instance.app.public_ip}:8080"
}

output "ssh_user" {
  description = "Default SSH user for the Ubuntu AMI."
  value       = "ubuntu"
}
