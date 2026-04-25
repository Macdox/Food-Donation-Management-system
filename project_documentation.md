# TagAlong Project Documentation

TagAlong is a high-performance, real-time ride-sharing and pooling backend designed for the Indian commuter market. It prioritizes security, efficient route matching, and a seamless mobile experience.

---

## 🏗️ Architecture & Technology Stack

### Core Stack
- **Backend**: Node.js & Express.js (Modular Design)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Real-time Engine**: Socket.io (WebSocket Layer)
- **Validation**: Schema-based validation using **Zod**
- **Environment**: Configured for cross-platform local development (0.0.0.0 binding for Flutter access)

### Security & Authentication
- **Dual-Token System**: Short-lived **Access Tokens** for API calls and long-lived **Refresh Tokens** for persistent sessions.
- **Token Rotation**: Every refresh cycle generates a new refresh token to prevent hijack attempts.
- **Device Sessions**: Supports multiple active devices with the ability to manage/revoke specific sessions.

---

## 🔐 Core Modules

### 1. Stepwise Onboarding Flow
The platform enforces a strict onboarding sequence managed by the `sessionStepManager`:
1.  **registration**: Account creation.
2.  **email_verification**: Mandatory OTP verification (Nodemailer).
3.  **phone_verification**: Mandatory SMS verification (Twilio).
4.  **profile_completion**: Basic bio and role selection.
5.  **document_upload**: KYC/Documentation for drivers.
6.  **active**: Full access granted.

### 2. Booking & Matching Engine
Designed for urban pooling efficiency:
- **Estimation**: Calculates fares based on distance and vehicle type.
- **Creation**: Users initiate or join ride requests.
- **Matching (The Brain)**: 
    - Scans for active pools heading in a similar direction.
    - Uses coordinate delta logic (~2km range) to group passengers.
    - Automatically dissolves pools to keep search efficiency high if cancellations occur.

### 3. Real-time WebSocket Layer
Enables "Push" notifications for a responsive UI:
- **Handshake Validation**: JWT-based authentication for secure socket connections.
- **Event Handling**: Modular handlers for `booking`, `tracking`, and `notifications`.
- **Rooms**: Uses Socket.io Rooms for group messaging within a specific pool or booking.

---

## 📩 WebSocket Event Registry

| Event | Direction | Purpose |
| :--- | :--- | :--- |
| `booking:created` | Server -> Client | Confirmation of ride request receipt. |
| `booking:statusUpdate` | Server -> Client | Notifies user of status (searching, matched, cancelled). |
| `pool:memberJoined` | Server -> Pool Room | Alerts existing members when a new passenger is matched. |
| `pool:memberLeft` | Server -> Pool Room | Alerts members when someone leaves the ride group. |
| `pool:statusUpdate` | Server -> Pool Room | Updates the entire pool state (e.g., driver arrived). |

---

## 🚦 Project Status

-   [x] **Authentication Core**: Tokens, Rotation, Session Tracking.
-   [x] **Verification Systems**: Email & Phone OTP integration.
-   [x] **Booking Service**: CRUD operations for ride requests.
-   [x] **Pooling Logic**: Proximity-based matching engine.
-   [x] **Real-time Layer**: Socket.io integration across services.
-   [ ] **Driver Dispatch**: Logic for assigning drivers to matched pools.
-   [ ] **Live GPS Stream**: Real-time movement tracking on maps.
-   [ ] **Payment Integration**: Razorpay/UPI gateway integration.

---

## 📁 Key File Structure
```text
backend/
├── controllers/          # Business logic (Auth, Booking, Pooling)
├── middleware/           # Hooks for Auth, Logging, Device detection
├── model/                # MongoDB Schema Definitions
├── routes/               # API Endpoint grouping
├── socket/               # WebSocket Services and Handlers
├── utils/                # Helpers (Token, Session, Phone, Email)
└── index.js              # Server Entry Point (HTTP + Socket)
```

---

## 🧪 Testing the Ecosystem
The project includes a simulation script `test_realtime.js` which verifies the entire flow:
1. Registers two users.
2. Connects them to sockets.
3. Performs a match-making booking.
4. Verifies User A receives a "Match Found" signal in real-time.
5. Verifies dissolution alerts when User B cancels.
