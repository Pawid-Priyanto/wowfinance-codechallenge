# 📱 Pokemon Explorer - React Native Coding Challenge



A React Native mobile application built with the Bare Workflow (React Native CLI). This project demonstrates the implementation of authentication (Mock JWT), REST API integration using PokeAPI, list virtualization, and reusable components.## ✨ Features- **Authentication (Login Screen):**  - Form validation for email and password.  - Secure mock JWT generation and storage using `AsyncStorage`.- **Home Screen:**  - Displays the logged-in user's email.  - Fetches and displays a list of Pokemon from [PokeAPI](https://pokeapi.co/).  - Highly optimized list rendering using `FlatList`.  - Implements Pull-to-Refresh, loading states, and empty states.- **Detail Screen:**  - Displays detailed information about the selected Pokemon.  - Implements the DRY (Don't Repeat Yourself) principle by utilizing a **Reusable Component** (`PokemonCard`) at the top of the screen.## 🛠 Tech Stack- **Framework:** React Native CLI - *Bare Workflow*- **Navigation:** React Navigation (Native Stack)- **HTTP Client:** Axios- **Local Storage:** AsyncStorage- **API:** PokeAPI (Public REST API)## 📂 Project Architecture



This project follows a feature-based folder structure inside the `src` directory for better readability and scalability:```text

src/

 ┣ components/     # Reusable UI elements (e.g., PokemonCard)

 ┣ screens/        # Main application screens (Login, Home, Detail)

 ┣ navigation/     # App routing and stack navigators

 ┣ services/       # API configuration and Axios instances

 ┗ App.js          # Entry point of the application

🚀 Getting Started

Installation

Clone the repository:

Bash



git clone <your-github-repo-url>cd PokemonApp

Install JavaScript dependencies:

Bash



npm install

Install iOS dependencies (Mac only):

Bash



cd ios && pod install && cd ..

Running the Application

Step 1: Start the Metro Bundler

Bash



npm start

Step 2: Start the App on Emulator/Device

For Android:

Bash



npm run android

For iOS:

Bash



npm run ios

📝 Key Implementations & Best Practices

Performance Optimization: Used React.memo and useCallback on the reusable components and FlatList renderers to prevent unnecessary re-renders.

Error Handling: Wrapped API calls inside try-catch blocks and handled edge cases such as network failures and empty data responses.

Security: Stored authentication tokens securely in local storage rather than keeping them in temporary state.

Built for Mobile Developer Coding Assessment.