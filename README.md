# UnMess - Managing Mess Made Simple 🍛

**UnMess** is a comprehensive Progressive Web Application (PWA) designed to streamline the management of shared dining and living expenses (Mess) for students, bachelors, and hostels. It replaces manual paper-based record-keeping with a smart, automated, and offline-capable digital solution.

🔗 **Live URL:** [https://un-mess.netlify.app/](https://un-mess.netlify.app/)

---

## 🔐 Demo Credentials

Try out the application with these test accounts:

**Admin Account:**

- Email: `akash@mail.com`
- Password: `123456`
- _Full administrative access to create bills, manage members, and handle expenses_

**Member Account:**

- Email: `rafi@mail.com`
- Password: `123456`
- _Standard member access to view meals, bills, and personal statistics_

---

## 🌟 Key Features

### 🚀 Core Functionality

- **Smart Dashboard:** Real-time overview of meal counts, current balance, and mess status.
- **Mess Management:** seamless **Create Mess** and **Join Mess** flows.
- **Role-Based Access:** Distinct features for **Admin** (Manager) and **Members**.
- **Offline Ready (PWA):** Works without internet! View records and navigate the app offline.

### 📝 Daily Operations

- **Meal Entry System:** Easy daily meal recording for single or multiple members.
- **Bazar Notes:** Digital log of marketing/grocery expenses with dates and descriptions.
- **Deposits & Costs:** Track member deposits and shared operational costs instantly.

### 📊 Financial Automation

- **Automated Billing:** One-click calculation of Meal Rate, Total Cost, and Balance per member.
- **Monthly Reports:** Historical data archiving for past months.
- **Transparency:** Every member can view live statistics of their usage.

### 🎨 Modern UI/UX

- **Dark Mode First:** Sleek "Midnight Purple" theme.
- **Responsive Design:** Optimized for Mobile, Tablet, and Desktop.
- **Interactive Animations:** Smooth transitions and loading states.

---

## 📖 User Guide

### 1️⃣ Getting Started

1.  **Sign Up:** Create an account using your email.
2.  **Choose Your Path:**
    - **Create a Mess:** If you are the manager. You will get a unique `Mess ID`.
    - **Join a Mess:** If you are a member. Ask your manager for the `Mess ID` to join.

### 2️⃣ For Managers (Admins)

- **Approve Requests:** Go to _Notifications_ to accept new member join requests.
- **Add Daily Meals:** Use the _Meal Entry_ page to update breakfast/lunch/dinner counts for all members.
- **Manage Expenses:** Log grocery costs in _Bazar Notes_ and extra costs in _Other Expenses_.
- **Monthly Closing:** Use the _Admin Panel_ to calculate bills and close the current month.

### 3️⃣ For Members

- **Check Status:** View your total meals and deposit balance on the _Home_ screen.
- **Verify Meals:** Check the _Meal Entry_ logs to ensure your meals are recorded correctly.
- **View Bill:** See your final calculated bill at the end of the month in the _Bills_ section.

---

## 🛠️ Tech Stack

- **Frontend Reference:** React.js, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn/UI
- **State Management:** Zustand
- **PWA:** Custom Service Worker (Available Offline)
- **Routing:** React Router DOM
- **HTTP Client:** Axios

---

## 💻 Local Installation

To run this project locally:

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-repo/mess-manager-client-side.git
    cd mess-manager-client-side
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Run Development Server**

    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 📱 PWA Instructions (Mobile)

To install **UnMess** on your phone:

1.  Open the Live URL in Chrome (Android) or Safari (iOS).
2.  Tap **"Add to Home Screen"**.
3.  The app will install as a native-like application.
4.  **Offline Mode:** You can open the app and view your data even without an internet connection!
