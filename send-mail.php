<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $email = str_replace(["\r", "\n"], '', $email);
  $phone = trim($_POST['phone'] ?? '');
  $class = trim($_POST['class'] ?? '');
  $message = trim($_POST['message'] ?? '');

  if (
    $name === '' ||
    $email === '' ||
    $phone === '' ||
    $class === '' ||
    $message === '' ||
    !filter_var($email, FILTER_VALIDATE_EMAIL)
  ) {
    header("Location: contact.html?status=error");
    exit();
  }

  $safe_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
  $safe_email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
  $safe_phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
  $safe_class = htmlspecialchars($class, ENT_QUOTES, 'UTF-8');
  $safe_message = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

  $to = "sindhujastephenraj33@gmail.com";
  $subject = "New School Enquiry";

  $body = "
  <html>
  <body>
    <h2>New Enquiry</h2>
    <p>Name: {$safe_name}</p>
    <p>Email: {$safe_email}</p>
    <p>Phone: {$safe_phone}</p>
    <p>Class: {$safe_class}</p>
    <p>Message: {$safe_message}</p>
  </body>
  </html>
  ";

  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8\r\n";
  $headers .= "From: {$to}\r\n";
  $headers .= "Reply-To: {$safe_email}\r\n";

  if (mail($to, $subject, $body, $headers)) {
    header("Location: contact.html?status=success");
  } else {
    header("Location: contact.html?status=error");
  }

  exit();
}
?>
