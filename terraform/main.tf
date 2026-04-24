terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Image Angular (frontend)
resource "docker_image" "frontend" {
  name         = "freelancepro-frontend"
  build {
    context = "../my-app"
  }
}

# Image Laravel (backend)
resource "docker_image" "backend" {
  name         = "freelancepro-backend"
  build {
    context = "../backend"
  }
}

# Container Frontend
resource "docker_container" "frontend" {
  name  = "freelancepro-frontend"
  image = docker_image.frontend.image_id
  ports {
    internal = 80
    external = 4200
  }
}

# Container Backend
resource "docker_container" "backend" {
  name  = "freelancepro-backend"
  image = docker_image.backend.image_id
  ports {
    internal = 8000
    external = 8000
  }
}
