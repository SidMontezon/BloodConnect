<?php

$name = $_POST["name"];
$email = $_POST["email"];
$subject = $_POST["subject"];
$message = $_POST["message"];

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer(true);



$mail->isSMTP();
$mail->SMTPAuth = true;

$mail->Host       = 'smtp.gmail.com';
$mail->SMTPAuth   = true;
$mail->Username   = getenv('SMTP_USER') ?: 'your-email@example.com';
$mail->Password   = getenv('SMTP_PASS') ?: '';
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port       = 587;  

// IMPORTANT: set environment variables SMTP_USER and SMTP_PASS in your server environment.
// If SMTP_PASS is empty the mail send will be skipped to avoid accidental leakage.

$mail->setFrom($email, $name);
$mail->addAddress("jayjaysoriano723@gmail.com", "Jay-jay");

$mail->Subject = $subject;
$mail->Body = $message;

try {
	if (empty($mail->Password)) {
		// Do not attempt send without credentials
		error_log('send-email.php: SMTP credentials not configured. Mail not sent.');
		header("Location: sent.html");
		exit;
	}

	$mail->send();
	header("Location: sent.html");
} catch (Exception $e) {
	error_log('Mail error: ' . $e->getMessage());
	header("Location: sent.html");
}