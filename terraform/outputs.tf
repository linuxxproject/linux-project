output "frontend_url" {
  value = "http://localhost:${var.frontend_port}"
  description = "URL du frontend Angular"
}

output "backend_url" {
  value = "http://localhost:${var.backend_port}"
  description = "URL du backend Laravel"
}
