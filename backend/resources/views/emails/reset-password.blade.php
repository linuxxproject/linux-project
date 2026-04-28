<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Réinitialiser votre mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .header {
            text-align: center;
            color: #1a56db;
            margin-bottom: 20px;
        }
        .content {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #1a56db;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>FreelancePro</h1>
        </div>

        <div class="content">
            <h2>Réinitialiser votre mot de passe</h2>
            <p>Bonjour,</p>
            <p>Vous avez demandé une réinitialisation de votre mot de passe FreelancePro.</p>
            <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>

            <a href="{{ $resetLink }}" class="button">Réinitialiser mon mot de passe</a>

            <p>Ou copiez ce lien dans votre navigateur :</p>
            <p><a href="{{ $resetLink }}">{{ $resetLink }}</a></p>

            <p><strong>Ce lien expirera dans 24 heures.</strong></p>

            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>

            <p>Cordialement,<br>L'équipe FreelancePro</p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} FreelancePro. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
