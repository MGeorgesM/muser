<img src="./readme/title1.svg"/>

<br><br>

<!-- project philosophy -->
<img src="./readme/title2.svg"/>

> Muser is a mobile app designed for musicians to connect with each others, spontaneously form bands, book venues, and have their performances livestreamed.
> Muser offers its user base Live streaming, Live messaging, and an AI-powered matchmaking system to form bands effortlessly.

### User Stories

-   As a musician, I want to browse and message musicians to form a band so that I can connect with like-minded individuals.
-   As a musician, I want to view and book available venues so that I can find suitable places to showcase my band's performances and reach a wider audience.
-   As a musician, I want to have my performance livestreamed so that fans and potential collaborators can watch us play in real-time, regardless of their location.

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

> We designed Muser using wireframes and mockups, iterating on the design until we reached the ideal layout for easy navigation and a seamless user experience.

-   Project Figma design [figma](https://www.figma.com/design/Bg7RZIYS3dprGnSqn3273D/Muser?node-id=541%3A2275&t=VXzTQUURH5dCvkfB-1)

### Mockups

| Musician Profile                             | Venues                               | Venue Profile                               |
| -------------------------------------------- | ------------------------------------ | ------------------------------------------- |
| ![Landing](./readme/mockups/userProfile.png) | ![fsdaf](./readme/mockups/venue.png) | ![fsdaf](./readme/mockups/venueProfile.png) |

<br><br>

<!-- Database Design -->
<img src="./readme/title5.svg"/>

### Database Design:

<img src='./readme//erDiagramD.jpg' width='1080'>

<br><br>

<!-- Implementation -->
<img src="./readme/title6.svg"/>

### User Screens and Videos (Mobile)
<iframe src="https://1drv.ms/v/c/84fd3718045c4e7d/IQNeRVmpWktyRYvtwmsKAqdjATqKqOp5gFPwDdMFthZ-EyA" width="540" height="1168" frameborder="0" scrolling="no" allowfullscreen></iframe>

<!-- | Login screen                              | Register screen                         | Landing screen                          | Loading screen                          |
| ----------------------------------------- | --------------------------------------- | --------------------------------------- | --------------------------------------- |
| ![Landing](https://placehold.co/900x1600) | ![fsdaf](https://placehold.co/900x1600) | ![fsdaf](https://placehold.co/900x1600) | ![fsdaf](https://placehold.co/900x1600) |
| Home screen                               | Menu Screen                             | Order Screen                            | Checkout Screen                         |
| ![Landing](https://placehold.co/900x1600) | ![fsdaf](https://placehold.co/900x1600) | ![fsdaf](https://placehold.co/900x1600) | ![fsdaf](https://placehold.co/900x1600) | -->

<iframe src="https://1drv.ms/v/c/84fd3718045c4e7d/IQN9lqDt-P5SQarSFtqckOcoAQMPsLIK2CMvF0bd1pg_yy4" width="540" height="540" frameborder="0" scrolling="no" allowfullscreen></iframe>

<br><br>

<!-- Prompt Engineering -->
<img src="./readme/title7.svg"/>

### Mastering AI Interaction: Unveiling the Power of Prompt Engineering:

-   The implementation of an AI-powered matchmaking system by integrating the latest OpenAI model. Through prompt engineering, we crafted detailed instructions for the AI to accurately extract and interpret any user input, considering musical genres, user locations, required instruments, and experience level, the system dynamically matches potential bandmates based on these criteria. This seamless integration transforms the user experience, making the process of finding and forming bands not only efficient but also exciting and intuitive.

<br><br>

<!-- AWS Deployment -->
<img src="./readme/title8.svg"/>

### Efficient AI Deployment: Unleashing the Potential with AWS Integration:

-   This project leverages AWS deployment strategies to seamlessly integrate and deploy natural language processing models. With a focus on scalability, reliability, and performance, we ensure that AI applications powered by these models deliver robust and responsive solutions for diverse use cases.

<br><br>

<!-- Unit Testing -->
<img src="./readme/title9.svg"/>

### Precision in Development: Harnessing the Power of Unit Testing:.

<img src="./readme/unitTesting.jpg"/>


<br><br>

<!-- How to run -->
<img src="./readme/title10.svg"/>

> To set up Muser locally, follow these steps:

### Installation

1. Clone the repository:
   git clone https://github.com/MGeorgesM/muser.git
2. Navigate to the project directory and install NPM packages:
    ```sh
    cd muser
    npm install
    ```
3. Connect your phone to your computer using a USB cable and ensure that your device is set up for development.
4. Build and run the app on your connected device:
    ```sh
    # Build for Android
    - npx expo run:android
    # Build for iOS
    - npx expo run:ios

    ```

Now, you should be able to run Muser locally and explore its features.
