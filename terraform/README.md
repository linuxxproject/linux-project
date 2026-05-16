# Terraform Deployment AWS

Ce dossier cree une instance Ubuntu EC2 sur AWS, installe Docker et prepare le dossier utilise par GitHub Actions.

## 1. Preparer les variables

Configurez d'abord vos identifiants AWS localement avec AWS CLI :

```bash
aws configure
```

Copiez l'exemple puis ajoutez vos vraies valeurs locales :

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` ne doit pas etre envoye sur Git, car il contient votre cle SSH publique et vos parametres locaux.

## 2. Creer le serveur

```bash
terraform init
terraform apply
```

A la fin, Terraform affiche `server_ip`. Ajoutez cette adresse dans les secrets GitHub.

## 3. Secrets GitHub Actions

Dans `Settings > Secrets and variables > Actions`, ajoutez :

- `DEPLOY_HOST` : IP du serveur Terraform.
- `DEPLOY_USER` : `ubuntu` avec l'image Ubuntu AWS.
- `DEPLOY_KEY` : cle SSH privee correspondant a `ssh_public_key`.
