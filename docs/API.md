# Chat Application — API Documentation

This document outlines the REST API and WebSocket events for the Chat Application, based on the live backend deployment at `https://frontend-task-chatapp.onrender.com`.

---

## 1. Overview & Base URLs

- **REST API Base URL**: `https://frontend-task-chatapp.onrender.com/api`
- **WebSocket URL**: `https://frontend-task-chatapp.onrender.com` (connect to root origin, not `/api`)
- **Authentication**: JWT Bearer token passed in the `Authorization: Bearer <token>` HTTP header and in the Socket.io connection `auth: { token: '<token>' }` handshake.

---

## 2. Authentication Endpoints

### 2.1. Log in / Register
- **Endpoint**: `POST /auth/login`
- **Auth Required**: No
- **Description**: Single-step login and registration. If the phone number is new, a user account is automatically registered. If it already exists, the user is authenticated.
- **Request Body**:
  ```json
  {
    "phone": "+12345678901",
    "name": "Alex Mercer"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6a8826abe5d6aac97521e28f",
      "name": "Alex Mercer",
      "phone": "+12345678901",
      "createdAt": "2026-08-21T10:21:31.538Z"
    }
  }
  ```

### 2.2. Get Current User Session
- **Endpoint**: `GET /auth/me`
- **Auth Required**: Yes (`Bearer <token>`)
- **Description**: Restores session and returns the currently authenticated user's profile.
- **Response (200 OK)**:
  ```json
  {
    "_id": "6a8826abe5d6aac97521e28f",
    "name": "Alex Mercer",
    "phone": "+12345678901",
    "createdAt": "2026-08-21T10:21:31.538Z"
  }
  ```

---

## 3. User Search Endpoint

### 3.1. Search Users
- **Endpoint**: `GET /users/search?q={query}`
- **Auth Required**: Yes (`Bearer <token>`)
- **Description**: Searches users across the platform by matching name or phone number.
- **Query Parameters**:
  - `q` (string, required): The search string (e.g. `Ada`, `017`, `+1555`).
- **Response (200 OK)**:
  ```json
  [
    {
      "_id": "6a882468e5d6aac97521e25e",
      "name": "Ada Lovelace",
      "phone": "+15551234567"
    }
  ]
  ```

---

## 4. Conversation Endpoints

### 4.1. List Conversations
- **Endpoint**: `GET /conversations`
- **Auth Required**: Yes (`Bearer <token>`)
- **Description**: Returns all direct (1-to-1) and group conversations the current user is a member of, sorted by most recent activity.
- **Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "_id": "6a88f80ae5d6aac97525fa12",
        "type": "group",
        "name": "Weekend plans",
        "createdBy": "6a88f804e5d6aac97525f9e6",
        "admins": ["6a88f804e5d6aac97525f9e6"],
        "participants": [
          {
            "_id": "6a88f804e5d6aac97525f9e6",
            "name": "Sohan200",
            "phone": "7700754200"
          },
          {
            "_id": "6a8826abe5d6aac97521e28f",
            "name": "Alex Mercer",
            "phone": "+12345678901"
          }
        ],
        "lastMessage": {
          "text": "van is booked. refundable, mostly.",
          "sender": "6a88f804e5d6aac97525f9e6",
          "createdAt": "2026-08-22T01:14:52.098Z"
        },
        "updatedAt": "2026-08-22T01:14:52.333Z"
      }
    ]
  }
  ```

### 4.2. Start or Open Direct 1-to-1 Conversation
- **Endpoint**: `POST /conversations`
- **Auth Required**: Yes (`Bearer <token>`)
- **Description**: Opens an existing 1-to-1 conversation or creates a new one with the specified user.
- **Request Body**:
  ```json
  {
    "userId": "6a882468e5d6aac97521e25e"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "_id": "6a890ffee5d6aac97526310f",
    "participants": [
      "6a8826abe5d6aac97521e28f",
      "6a882468e5d6aac97521e25e"
    ],
    "createdAt": "2026-08-22T02:57:02.890Z"
  }
  ```

### 4.3. Get Message History
- **Endpoint**: `GET /conversations/{id}/messages`
- **Auth Required**: Yes (`Bearer <token>`)
- **Query Parameters**:
  - `limit` (integer, optional): Maximum messages to return per page (e.g. `20` or `50`).
  - `before` (string, optional): Message ID cursor for loading older messages.
- **Response (200 OK)**:
  ```json
  {
    "messages": [
      {
        "_id": "6a88f80ce5d6aac97525fa17",
        "conversation": "6a88f80ae5d6aac97525fa12",
        "sender": "6a88f804e5d6aac97525f9e6",
        "text": "van is booked. refundable, mostly.",
        "createdAt": "2026-08-22T01:14:52.098Z"
      }
    ],
    "hasMore": false
  }
  ```

---

## 5. Group Conversation Management

### 5.1. Create Group
- **Endpoint**: `POST /conversations/group`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "name": "Engineering Team",
    "participantIds": [
      "6a882468e5d6aac97521e25e",
      "6a884bcce5d6aac975222ed5"
    ]
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "_id": "6a891008e5d6aac975263165",
    "type": "group",
    "name": "Engineering Team",
    "createdBy": "6a8826abe5d6aac97521e28f",
    "admins": ["6a8826abe5d6aac97521e28f"],
    "participants": [
      {
        "_id": "6a8826abe5d6aac97521e28f",
        "name": "Alex Mercer",
        "phone": "+12345678901"
      },
      {
        "_id": "6a882468e5d6aac97521e25e",
        "name": "Ada Lovelace",
        "phone": "+15551234567"
      }
    ],
    "createdAt": "2026-08-22T02:57:12.854Z",
    "updatedAt": "2026-08-22T02:57:12.854Z"
  }
  ```

### 5.2. Add Participants to Group
- **Endpoint**: `POST /conversations/{id}/participants`
- **Auth Required**: Yes (Admins only)
- **Request Body**:
  ```json
  {
    "userIds": ["6a883b25e5d6aac975220317"]
  }
  ```

### 5.3. Remove Participant / Leave Group
- **Endpoint**: `DELETE /conversations/{id}/participants/{userId}`
- **Auth Required**: Yes (Admins to kick, or user's own `userId` to leave)

### 5.4. Rename Group
- **Endpoint**: `PATCH /conversations/{id}`
- **Auth Required**: Yes (Admins only)
- **Request Body**:
  ```json
  {
    "name": "New Team Name"
  }
  ```

### 5.5. Promote Member to Admin
- **Endpoint**: `POST /conversations/{id}/admins`
- **Auth Required**: Yes (Admins only)
- **Request Body**:
  ```json
  {
    "userId": "6a882468e5d6aac97521e25e"
  }
  ```

---

## 6. Message Endpoints

### 6.1. Send Message
- **Endpoint**: `POST /messages`
- **Auth Required**: Yes (`Bearer <token>`)
- **Description**: Sends a message to a direct or group conversation.
- **Request Body**:
  ```json
  {
    "conversationId": "6a890ffee5d6aac97526310f",
    "text": "Hello, how is the project going?"
  }
  ```
- **Response (200 OK / 201 Created)**:
  ```json
  {
    "_id": "6a890fffe5d6aac975263117",
    "conversation": "6a890ffee5d6aac97526310f",
    "sender": "6a8826abe5d6aac97521e28f",
    "text": "Hello, how is the project going?",
    "createdAt": "2026-08-22T02:57:03.840Z"
  }
  ```

---

## 7. WebSocket (Socket.io) Specification

- **Connection URL**: `https://frontend-task-chatapp.onrender.com`
- **Handshake Authentication**:
  ```javascript
  import { io } from 'socket.io-client';

  const socket = io('https://frontend-task-chatapp.onrender.com', {
    auth: { token: '<JWT_TOKEN>' },
    transports: ['websocket', 'polling']
  });
  ```

### Events

#### Client → Server:
- `message:send`: `{ conversationId: string, text: string }`

#### Server → Client:
- `message:new`: Dispatched when any new message arrives in any conversation the user is part of.
  Payload:
  ```json
  {
    "_id": "6a890fffe5d6aac975263117",
    "conversation": "6a890ffee5d6aac97526310f",
    "sender": {
      "_id": "6a882468e5d6aac97521e25e",
      "name": "Ada Lovelace"
    },
    "text": "Doing great!",
    "createdAt": "2026-08-22T02:58:00.000Z"
  }
  ```
- `conversation:updated`: Dispatched when a group is created, renamed, or participants change.

---

## 8. Error Handling & Inconsistencies Discovered

1. **Direct Conversations Return Singular `participant`**:
   - For `type: "direct"` conversations, the API returns a singular `participant: { _id, name, phone }` object representing the other user.
   - For `type: "group"` conversations, the API returns `participants: [{ _id, name, phone }, ...]` and `admins: [...]`.
   - The frontend automatically normalizes both shapes via `getConversationTitle()` and `getConversationSubtitle()`.
2. **Sender Field Polymorphism**:
   - In `GET /conversations/:id/messages`, `sender` is returned as an ID string (e.g. `"6a88f804e5d6aac97525f9e6"`).
   - In some socket events, `sender` can be an object `{ _id, name }` or string. The client normalizes `senderId` seamlessly.
3. **Conversations Envelope**:
   - `GET /conversations` wraps results in `{ data: [...] }`. The client handles both `{ data: [...] }` and raw arrays `[...]`.
