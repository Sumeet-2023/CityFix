# CityFix: Community Reporting and Engagement Platform

CityFix is a community-driven platform designed to promote sustainable cities and communities by providing a way for citizens to report issues, propose solutions, and engage in local sustainability projects. Aligned with **SDG 11: Sustainable Cities and Communities**, CityFix empowers citizens to actively participate in improving their communities and holds local authorities accountable for action.

## Project Vision

### Problem
Many cities face persistent issues with waste management, pollution, and infrastructure. However, these challenges often go unresolved due to a lack of efficient systems for citizens to report concerns and contribute to community-driven solutions.

### Solution
CityFix offers a solution by creating a collaborative platform where citizens can:
- Report community issues with geolocation tagging.
- Propose and vote on community-driven initiatives.
- Participate in sustainable projects.
- Track the status of reported issues.
- Engage in a volunteer network and form "Clans" or community groups for collective action.

---

## Features

### Core Features
- **Issue Reporting:** Citizens can report local problems like overflowing bins, potholes, pollution, or unsafe conditions. Reports are tagged with geolocation and tracked in real-time, providing status updates and notifications.
  
- **Community Projects:** Users can propose or join projects like tree planting drives, beach cleanups, or recycling initiatives, empowering them to contribute directly to their community’s sustainability.

- **Collaborative Mapping:** Highlights ongoing sustainable projects and areas that need attention, providing a comprehensive map for citizens to visualize sustainability efforts across the city.

- **Volunteer Network Integration:** Connects users with local NGOs, government agencies, or community groups in need of volunteers for sustainability projects.

- **Government Accountability Dashboard:** Publicly displays reported issues and their resolution status to promote transparency and accountability.

- **Clan System:** Users can create or join local "Clans," which are community groups centered around specific sustainability goals. Clans offer collaborative planning tools, including radius-based locale selection, member roles, payment tracking, and membership limits.

### Additional Features
- **Data Dashboard:** Provides city-level metrics on sustainability, such as air quality, recycling rates, water usage, and renewable energy adoption.

- **Rewards System:** Active participants in reporting or sustainability projects can earn points redeemable for local benefits or recognition.

- **NGO Support and Donation Hub:** Connects users with NGOs for donations, featuring sections for tracking support, and a feed of all NGOs in the area.

---

## Technologies Used

- **Database**: MongoDB
- **Authentication**: Firebase Authentication
- **ORM**: Prisma
- **Geocoding and Map Services**:
  - **Geocode Autocomplete**: OpenRoute Service
  - **Map Integration**: Google Maps via `react-native-maps`

---

## Getting Started

### Prerequisites
- **MongoDB** account and URI for the database.
- **Firebase** project for authentication.
- **OpenRoute Service API** key for geolocation and geocoding features.
- **Google Maps API** key for mapping capabilities.

### Installation
1. **Clone the repository**:
    ```bash
    git clone https://github.com/Sumeet-2023/CityFix.git
    cd CityFix
    ```
2. **Install dependencies**:
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. **Set up environment variables**:  
   Create a `.env` file in the root directory of client and add your API keys and database URI:
    ```plaintext
    EXPO_PUBLIC_FIREBASE_API_KEY=
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    EXPO_PUBLIC_FIREBASE_APP_ID=
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
    EXPO_PUBLIC_OPEN_ROUTER_API_KEY=
    EXPO_PUBLIC_SERVER_URL=
    ```
    For just development purpose, enter the github forwarded port url inside EXPO_PUBLIC_SERVER_URL.
   
    Create a `.env` file in the root directory of server and add your API keys and database URI:
    ```plaintext
        DATABASE_URL=

4. **Run the application**:
    first run these commands:
    ```bash
    npx prisma generate
    npm run seed
    ```

    For running fronted:
    ```bash
    cd client
    npx expo start
    ```

    For running server:
    ```bash
    cd server
    npm run dev
    ```

### Usage
- **Report an Issue**: Report issues directly from the home screen, and check for real-time status updates.
- **Engage in Community Projects**: Explore the Community Projects section to join or create local initiatives.
- **Join Clans**: Create or join local Clans with set radius and membership criteria.
- **Support NGOs**: Access the NGO support section to donate or volunteer for registered local organizations.

---

## Documentation and Planning

Our project is inspired by **SDG 11: Sustainable Cities and Communities** and designed according to the following plan:

### Community Reporting and Engagement Platform

**Features Summary**:
1. Issue reporting with geolocation and real-time updates.
2. Sustainable project voting and discussion forums (planned for future updates).
3. Community project engagement with transparency and accountability.
4. Volunteer network integration and Clan-based collaboration.
5. NGO section for donations and tracking support.

---

With CityFix, citizens have a platform to actively contribute to the betterment of their cities and build a sustainable community. We are committed to making our cities better, one report at a time!the betterment of their cities and build a sustainable community. We are committed to making our cities better, one report at a time!
