<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - BloodConnect</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Navbar -->
    <header>
        <div class="logo">
            <h1>BloodConnect</h1>
        </div>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="about.php">About Us</a></li>
                <li><a href="contactus.php">Contact Us</a></li>
            </ul>
        </nav>
    </header>

    <!-- Contact Us Section -->
    <section id="contact" class="section">
        <h2>Contact Us</h2>
        <form action="send-email.php" method="post" id="contactForm">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div>
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <div>
                <button type="submit">Send Message</button>
            </div>
        </form>
        <div id="responseMessage"></div>
    </section>

    <footer>
        <p>&copy; 2025 BloodConnect. All rights reserved.</p>
    </footer>
</body>
</html>
