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
$mail->Username   = 'your-email@gmail.com';  
$mail->Password   = 'your-app-password';     
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port       = 587;  

$mail->Username = "jayjaysoriano723@gmail.com";
$mail->Password = "kpwj kkmf fxms utzn";

$mail->setFrom($email, $name);
$mail->addAddress("jayjaysoriano723@gmail.com", "Jay-jay");

$mail->Subject = $subject;
$mail->Body = $message;

$mail->send();

