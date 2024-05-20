<img src="./readme/title1.svg"/>

<br><br>

<!-- project philosophy -->
<img src="./readme/title2.svg"/>

> Muser is a mobile app designed for musicians to connect with each others, spontaneously form bands, book venues, and have their performances livestreamed.
> Muser offers its user base Live streaming, Live messaging, and an AI-powered matchmaking system to form bands effortlessly.

### User Stories

Musician:

-   As a musician, I want to browse and message musicians to form a band so that I can connect with like-minded individuals.
-   As a musician, I want to view and book available venues so that I can find suitable places to showcase my band's performances and reach a wider audience.
-   As a musician, I want to have my performance livestreamed so that fans and potential collaborators can watch us play in real-time, regardless of their location.

Venue:

-   As a venue, I want to receive notifications and requests from bands interested in performing so that I can organize exiting events for my customers.
-   As a venue, I want to easily manage bookings through the app so that I can streamline the process and focus on providing a great experience.
-   As a venue, I want to livestream any show happening on my premises, so I can reach a broader audience online and attract more shows in the future.

<br><br>

<!-- Tech stack -->
<img src="./readme/title3.svg"/>

### Muser is built using the following technologies:

-   [Laravel 11](https://laravel.com/), a PHP framework that provides a robust set of tools for web apps development.
-   [React Native](https://reactnative.dev/), a popular framework for building mobile apps using JavaScript and React, allowing for cross-platform development with a single codebase.
-   [Firebase Cloud Firestore](https://firebase.google.com/products/firestore/), a scalable database from Firebase and Google Cloud Platform. It provides real-time data synchronization, querying, and offline support, making it ideal for building Live applications.
-   [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging/), a cross-platform messaging solution to send notifications reliably to users' devices.
-   [OpenAI](https://openai.com/), a provider of advanced artificial intelligence technologies and APIs. OpenAI powers our AI-driven matchmaking system, enhancing the user experience.
-   [MySQL](https://www.mysql.com/), a widely-used open-source relational database management system. It is known for its reliability, performance, and ease of use, making it an excellent choice for managing and organizing data in web apps.

<br><br>

<!-- UI UX -->
<img src="./readme/title4.svg"/>
> Muser was designed using wireframes and mockups, iterating on the design until reaching the ideal layout for easy navigation and a seamless user experience.

<img src='./readme/mockups/MuserCover.jpg' width='1080'>

-   Project design [Figma](https://www.figma.com/design/Bg7RZIYS3dprGnSqn3273D/Muser?node-id=541%3A2275&t=VXzTQUURH5dCvkfB-1)

### Mockups

<table style="width: 100%; text-align: center;">
  <tr>
    <th>Musician Profile</th>
    <th>Venues</th>
    <th>Venue Profile</th>
  </tr>
  <tr>
    <td>
      <img src="./readme/mockups/userProfile.png" alt="Musician Profile" width="250" height="511">
    </td>
    <td>
      <img src="./readme/mockups/venue.png" alt="Venues" width="250" height="511">
    </td>
    <td>
      <img src="./readme/mockups/venueProfile.png" alt="Venue Profile" width="250" height="511">
    </td>
  </tr>
</table>

<br><br>

<!-- Implementation -->
<img src="./readme/title6.svg"/>

### User Screens and Videos

<table style="margin: auto; width: 100%; margin-top: 32px;">
  <tr>
      <td align="center">

https://github.com/georges-mouawad/muser/assets/43368919/8fbc0e5e-f394-45e1-ab8f-43483eabbdf0

</td>
      <td align="center">

https://github.com/georges-mouawad/muser/assets/43368919/8fbc0e5e-f394-45e1-ab8f-43483eabbdf0

</td>
      <td align="center">

https://github.com/georges-mouawad/muser/assets/43368919/37f9158c-711e-425c-8c46-93be3afcfec3

</td>
</table>

<table style="margin: auto; width: 100%; margin-top: 32px;">
  <tr>
      <td align="center">

https://github.com/georges-mouawad/muser/assets/43368919/2140566d-4c1a-4e56-a44e-f20d1fbcb5a4

</td>
      <td align="center">
    
https://github.com/georges-mouawad/muser/assets/43368919/fe739bb3-50ac-4eff-a627-98f8fe433801

</td>
</table>

<br><br>

<!-- Database Design -->

<img src="./readme/title5.svg"/>

### Integrating the Best of Both Worlds:

Muser utilizes a relational database (MySQL) and a NoSQL database (Firebase Cloud Firestore) for a seamless user experience.

-   MySQL: with the power of Laravel Eloquent ORM and the reliability of MySQL, Muser efficiently handles structured data, complex queries, and relationships.
-   Cloud Firestore: Provides real-time data synchronization, ensuring users have up-to-date information instantly. It supports live messaging, band forming, streaming, and user reactions.

<img src='./readme//erDiagramD.jpg' width='1080'>

<br><br>

<!-- Prompt Engineering -->
<img src="./readme/title7.svg"/>

### Mastering AI Interaction: Unveiling the Power of Prompt Engineering:

-   We implemented an AI-powered matchmaking system using the latest OpenAI model. By crafting detailed prompts, the AI accurately interprets user input—considering musical genres, locations, required instruments, and experience levels—to dynamically match potential bandmates. This integration enhances the user experience, making finding and forming bands efficient and exciting.

<img src='./readme/aiPrompt.jpg' width='1080'>

<br><br>

<!-- AWS Deployment -->
<img src="./readme/title8.svg"/>

### Unleashing the Potential with AWS Integration:

-   This project utilizes AWS deployment strategies to seamlessly integrate and deploy backend services. Focusing on scalability, reliability, and performance, the Laravel backend for Muser delivers robust and responsive solutions for diverse use cases. By deploying the Laravel backend on AWS, Muser benefits from the comprehensive suite of services and tools that AWS offers, providing a solid foundation for future growth and enhancements.

<img src='./readme/awsGet.jpg' width='1080'>

By following these steps, we deployed our Laravel server on an AWS EC2 instance, ensuring a scalable and robust environment.

1. **Launch an EC2 Instance:**

    - Sign in to our AWS Management Console.
    - Navigate to the EC2 Dashboard and click "Launch Instance."
    - Choose an Amazon Machine Image (AMI). For a Laravel application, a Ubuntu Server is recommended.
    - Select an instance type (e.g., t2.micro for free tier eligibility).
    - Configure instance details and add storage as needed.
    - Add tags (optional) and configure security groups to allow HTTP, HTTPS, and SSH traffic.
    - Review and launch the instance, creating a new key pair or using an existing one for SSH access.

2. **Connect to Your EC2 Instance:**

    - Open our terminal and connect to the instance using SSH:
        ```sh
        ssh -i /path/to/key-pair.pem ubuntu@ec2-public-ip
        ```

3. **Install Required Software:**

    - Update the package list:
        ```sh
        sudo apt update
        ```
    - Install Apache, PHP, and other necessary extensions:
        ```sh
        sudo apt install apache2 php libapache2-mod-php php-mysql php-xml php-mbstring php-zip php-curl
        ```
    - Install Composer:
        ```sh
        sudo apt install composer
        ```

4. **Clone Your Laravel Project:**

    - Navigate to the web root directory:
        ```sh
        cd /var/www/html
        ```
    - Clone our Laravel project from GitHub:
        ```sh
        sudo git clone https://github.com/georges-mouawad/muser.git
        ```
    - Change the directory to our project:
        ```sh
        cd muser
        ```

5. **Set Permissions and Environment Configuration:**

    - Set the correct permissions for Laravel directories:
        ```sh
        sudo chown -R www-data:www-data /var/www/html/msuer
        sudo chmod -R 775 /var/www/html/muser/storage /var/www/html/muser/bootstrap/cache
        ```
    - Copy the `.env.example` file to `.env` and update it with our configuration:
        ```sh
        cp .env.example .env
        sudo nano .env
        ```
    - Generate the application key:
        ```sh
        php artisan key:generate
        ```

6. **Configure Apache for Laravel:**

    - Create a new Apache configuration file for our Laravel project:
        ```sh
        sudo nano /etc/apache2/sites-available/muser.conf
        ```
    - Add the following configuration:
        ```apache
        <VirtualHost *:80>
            ServerAdmin admin@example.com
            DocumentRoot /var/www/html/muser/api/public
            ServerName our-domain.com
            <Directory /var/www/html/muser>
                Options Indexes FollowSymLinks
                AllowOverride All
                Require all granted
            </Directory>
            ErrorLog ${APACHE_LOG_DIR}/error.log
            CustomLog ${APACHE_LOG_DIR}/access.log combined
        </VirtualHost>
        ```
    - Enable the new site and rewrite module:
        ```sh
        sudo a2ensite muser.conf
        sudo a2enmod rewrite
        sudo systemctl restart apache2
        ```

7. **Set Up Your Database:**

    - Install MySQL server:
        ```sh
        sudo apt install mysql-server
        ```
    - Secure the installation:
        ```sh
        sudo mysql_secure_installation
        ```
    - Log in to MySQL and create a new database and user:
        ```sh
        sudo mysql -u root -p
        ```
        ```sql
        CREATE DATABASE our_database_name;
        CREATE USER 'our_username'@'localhost' IDENTIFIED BY 'our_password';
        GRANT ALL PRIVILEGES ON our_database_name.* TO 'our_username'@'localhost';
        FLUSH PRIVILEGES;
        EXIT;
        ```
    - Update our `.env` file with the database credentials.

8. **Run Migrations and Seeders:**

    - Run Laravel migrations and seeders:
        ```sh
        php artisan migrate --seed
        ```

9. **Accessing the Laravel Application:**
    - Open browser and navigate to the public IP or domain of our EC2 instance to see our Laravel application in action.

<br><br>

<!-- Unit Testing -->
<img src="./readme/title9.svg"/>

### Precision in Development: Harnessing the Power of Unit Testing:

-   This project employs rigorous unit testing methodologies to ensure the reliability and accuracy of code components. By systematically evaluating individual units of the software, a robust foundation is guaranteed, allowing potential issues to be identified and addressed early in the development process. Specifically, Laravel's unit testing feature was used to test the API controllers, ensuring they function correctly and efficiently.

<img src="./readme/unitTesting.jpg"/>

<br><br>

<!-- How to run -->
<img src="./readme/title10.svg"/>

> To set up Muser locally, follow these steps:

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/MGeorgesM/muser.git
    ```
2. Navigate to the project directory and install NPM packages:
    ```sh
    cd muser
    npm install
    ```
3. Connect our phone to our computer using a USB cable and ensure that our device is set up for development.
4. Build and run the app on our connected device:

    ```sh
    # Build for Android
    - npx expo run:android
    # Build for iOS
    - npx expo run:ios

    ```

Now, you should be able to run Muser locally and explore its features.
