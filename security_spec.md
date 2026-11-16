# Security Specification — كل كلمة حكاية

## 1. Data Invariants
1. **Strict RBAC Hierarchy**: Only verified Super Admins (`isSuperAdmin()`) can create/modify `/roles/{userId}` or `/team/{memberId}` documents. Assistants (`isAssistant()`) can curate `/books` and `/quotes` and review `/contactMessages`, but never escalate privileges or edit team leadership.
2. **PII Isolation**: `/users/{userId}` documents contain user email addresses and private reading preferences; `get` is strictly limited to the document owner (`request.auth.uid == userId`) or `isSuperAdmin()`, and `list` is prohibited for regular users.
3. **No Shadow Fields or Self-Assigned Roles**: Every `create` operation enforces `hasAll` and `hasOnly` key checks. Every `update` validates `isValid[Entity](incoming())` and `affectedKeys().hasOnly(...)`.
4. **Immutable Ownership & Server Timestamps**: `createdAt` and `createdBy` cannot be altered after creation; `createdAt` and `updatedAt` must equal `request.time`.
5. **Path Variable Guarding**: All single-document operations validate `isValidId(docId)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).

## 2. "Dirty Dozen" Adversarial Payloads (All Must Fail with PERMISSION_DENIED)
1. **Self-Privilege Escalation**: Regular user writes `/roles/{uid}` with `{ role: "super_admin" }` -> DENIED.
2. **Shadow Field Injection on User Profile**: Owner updates `/users/{uid}` adding `{ isAdmin: true }` -> DENIED (`hasOnly` check fails).
3. **Cross-User PII Read**: Authenticated User A reads `/users/{userB_uid}` -> DENIED.
4. **Cross-User List Scraping**: Authenticated User A queries `collection(db, "users")` -> DENIED (`allow list` restricted to `isSuperAdmin()`).
5. **Unverified Email Admin Spoof**: Token has admin email with `email_verified: false` -> DENIED.
6. **Unauthorized Book Creation**: Regular reader creates a document in `/books/{bookId}` -> DENIED.
7. **ID Poisoning**: Admin creates `/books/a...200_chars` or invalid characters `book/../../evil` -> DENIED (`isValidId`).
8. **Client Timestamp Forgery**: Admin creates `/books/{bookId}` with `createdAt` set to a past timestamp instead of `request.time` -> DENIED.
9. **Immutable Owner Tampering**: Assistant updates `/books/{bookId}` trying to change `createdBy` -> DENIED.
10. **Contact Message Status Spoof on Create**: Visitor submits `/contactMessages/{id}` with `status: "reviewed"` -> DENIED (must be `"new"` on create).
11. **Contact Message Snooping**: Non-admin authenticated user lists `/contactMessages` -> DENIED.
12. **Assistant Team Modification**: Assistant attempts to edit `/team/malak` to change `roleLevel` -> DENIED (only `isSuperAdmin()`).
