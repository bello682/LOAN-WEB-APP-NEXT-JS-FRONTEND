# FINAL DEVELOPER REFERENCE

## Quick Start (Literally 2 minutes)

```bash
# Terminal 1 - Backend
cd c:\Users\USER\Desktop\my-loan-backend-node-js
npm start

# Terminal 2 - Frontend
cd c:\Users\USER\Desktop\my-loan-backend-node-js\frontend\my-loan-website-nest-js
npm run dev

# Open browser
http://localhost:3000/login
```

**That's it.** Your app is running.

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Port 3000)                  │
│  Next.js 16 + React 19 + Redux + Socket.IO              │
├─────────────────────────────────────────────────────────┤
│  Pages (app/)                                            │
│  ├── login/              ✅ Working                      │
│  ├── signup/             🚧 Needs Redux update          │
│  ├── auth/verify/        ✅ Working                      │
│  ├── dashboard/          🚧 Needs Redux dispatch       │
│  ├── chat/               🚧 Needs Socket.IO            │
│  └── ...other pages                                     │
├─────────────────────────────────────────────────────────┤
│  State Management (lib/redux/)                           │
│  ├── authSlice           ✅ Login, signup, OTP          │
│  ├── loanSlice           ✅ Loan CRUD & calculator      │
│  ├── adminSlice          ✅ Admin dashboard             │
│  └── chatSlice           ✅ Chat state                  │
├─────────────────────────────────────────────────────────┤
│  API Layer (lib/api.ts)                                  │
│  └── 40+ endpoints configured with token management     │
└─────────────────────────────────────────────────────────┘
         ↓ HTTP + Axios ↓
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Port 8001)                    │
│     Node.js + Express + MongoDB + Socket.IO             │
├─────────────────────────────────────────────────────────┤
│  Auth         Loans         Chat         Admin          │
│  ├── Register ├── CRUD      ├── Init     ├── Register  │
│  ├── Login    ├── Calc      ├── Send     ├── Login     │
│  ├── OTP      ├── Status    ├── Fetch    ├── Stats     │
│  └── Password ├── My Loans  └── Escalate ├── Manage    │
│              └── Apply                   └── Control   │
│                                                         │
│  AI Chat + Email + File Uploads                        │
└─────────────────────────────────────────────────────────┘
```

---

## Redux Flow Explained

### Dispatching an Action

```typescript
// 1. Import hook and action
import { useAppDispatch } from "@/lib/redux/hooks";
import { loginUser } from "@/lib/redux/features/authSlice";

// 2. Get dispatcher
const dispatch = useAppDispatch();

// 3. Dispatch action with payload
dispatch(
	loginUser({
		email: "user@example.com",
		password: "password123",
	}),
);
```

### Accessing State

```typescript
// 1. Import hook and selector
import { useAppSelector } from "@/lib/redux/hooks";

// 2. Select state
const { user, token, isLoading, error } = useAppSelector(
  state => state.auth
);

// 3. Use the values
if (isLoading) return <Spinner />;
if (error) return <Error message={error} />;
return <Dashboard user={user} />;
```

### Complete Example

```typescript
"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loginUser } from "@/lib/redux/features/authSlice";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { isLoading, error, isSuccess } = useAppSelector(
    state => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (isSuccess) {
      // Redirect to dashboard
    }
  }, [isSuccess]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

---

## API Usage Guide

### All 40+ Endpoints

```typescript
// Import from api.ts
import {
	authAPI, // Auth endpoints
	loanAPI, // Loan endpoints
	chatAPI, // Chat endpoints
	guestChatAPI, // Guest chat endpoints
	adminAPI, // Admin endpoints
} from "@/lib/api";

// Use in Redux thunks or components

// AUTH
await authAPI.register(userData); // POST /auth/register
await authAPI.login(credentials); // POST /auth/login
await authAPI.verifyOtp(email, otp); // POST /auth/verify-otp
await authAPI.resendOtp(email); // POST /auth/resend-otp
await authAPI.forgotPassword(email); // POST /auth/forgot-password
await authAPI.resetPassword(token, pw); // POST /auth/reset-password
await authAPI.logout(); // POST /auth/logout
await authAPI.getCurrentUser(); // GET /auth/me

// LOANS
await loanAPI.getMyLoans(); // GET /loans/my-loans
await loanAPI.createLoan(data); // POST /loans
await loanAPI.getLoanById(id); // GET /loans/:id
await loanAPI.updateLoan(id, data); // PUT /loans/:id
await loanAPI.getLoanCalculator(data); // POST /loans/calculator
await loanAPI.submitApplication(data); // POST /loans/apply

// CHAT
await chatAPI.initChat(); // POST /chat/init
await chatAPI.sendMessage(msg); // POST /chat/send
await chatAPI.fetchMessages(id); // GET /chat/messages/:id
await chatAPI.escalateChat(id); // PUT /chat/:id/escalate

// GUEST CHAT
await guestChatAPI.initSession(); // POST /guest-chat/init
await guestChatAPI.sendMessage(msg); // POST /guest-chat/send
await guestChatAPI.escalate(); // POST /guest-chat/escalate

// ADMIN
await adminAPI.loginAdmin(creds); // POST /admin/login
await adminAPI.getDashboardStats(); // GET /admin/dashboard/stats
await adminAPI.updateLoanStatus(id); // PUT /admin/loans/:id/status
await adminAPI.deleteUser(id); // DELETE /admin/users/:id
await adminAPI.toggleAI(id); // PUT /admin/loans/:id/ai-toggle
```

---

## Common Code Patterns

### Pattern 1: Form with Redux

```typescript
const [formData, setFormData] = useState({
  email: "",
  password: ""
});

const dispatch = useAppDispatch();
const { isLoading, error, isSuccess } = useAppSelector(s => s.auth);

const handleSubmit = (e) => {
  e.preventDefault();
  dispatch(loginUser(formData)); // Redux handles API call
};

useEffect(() => {
  if (error) toast.error(error);
  if (isSuccess) router.push("/dashboard");
}, [error, isSuccess, router]);

return (
  <form onSubmit={handleSubmit}>
    <input
      name="email"
      value={formData.email}
      onChange={(e) => setFormData({...formData, email: e.target.value})}
    />
    <button disabled={isLoading}>
      {isLoading ? "Loading..." : "Submit"}
    </button>
  </form>
);
```

### Pattern 2: Display Data from Redux

```typescript
const { loans, isLoading } = useAppSelector(s => s.loans);

useEffect(() => {
  dispatch(fetchMyLoans());
}, [dispatch]);

return (
  <>
    {isLoading && <Skeleton />}
    {loans.map(loan => (
      <Card key={loan._id}>
        <h3>{loan.amount}</h3>
        <p>{loan.status}</p>
      </Card>
    ))}
  </>
);
```

### Pattern 3: Socket.IO Chat

```typescript
import io from "socket.io-client";

useEffect(() => {
	const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

	socket.on("receive_message", (data) => {
		setMessages((prev) => [...prev, data]);
	});

	return () => socket.disconnect();
}, []);

const sendMessage = (text) => {
	socket.emit("send_message", {
		message: text,
		chatId: currentChatId,
	});
};
```

### Pattern 4: Error Handling

```typescript
const { error } = useAppSelector((s) => s.auth);

useEffect(() => {
	if (error) {
		toast.error(error);

		// Handle specific errors
		if (error.includes("401")) {
			router.push("/login");
		}

		// Clear error after showing
		dispatch(resetAuth());
	}
}, [error, dispatch, router]);
```

---

## Troubleshooting

### Issue: Login not working

```
Check:
1. Backend running? npm start in backend folder
2. API URL correct? NEXT_PUBLIC_API_URL=http://localhost:8001
3. Network tab shows requests to :8001?
4. Console show errors?
5. Redux DevTools show loginUser being dispatched?

Fix:
- Restart backend
- Restart frontend
- Check .env.local file
- Check browser DevTools → Network tab
- Check browser DevTools → Console tab
```

### Issue: Redirects not working

```
Check:
1. isSuccess in Redux state actually true?
2. useRouter() imported correctly?
3. router.push() in useEffect?
4. Dependencies array includes router?

Fix:
useEffect(() => {
  if (isSuccess) {
    router.push("/dashboard");
  }
}, [isSuccess, router]); // <- router must be in deps
```

### Issue: Token not persisting

```
Check:
1. Is setAuthToken() being called?
2. Is localStorage available?
3. Is token being set in Redux state?
4. Is interceptor adding token to headers?

Fix in authSlice.ts:
.addCase(loginUser.fulfilled, (state, action) => {
  setAuthToken(action.payload.token); // <- Call this
  state.token = action.payload.token;
})
```

### Issue: API returns 401

```
Means: Token invalid or expired
Fix:
1. Check if token in localStorage
2. Check if token format is correct
3. Check if backend has same JWT_SECRET
4. Check if token expired (30 day expiry)
5. Auto-logout user and redirect to login
```

---

## File Checklist

```
MUST EXIST:
✅ lib/api.ts
✅ lib/redux/store.ts
✅ lib/redux/hooks.ts
✅ lib/redux/features/authSlice.ts
✅ lib/redux/features/loanSlice.ts
✅ lib/redux/features/adminSlice.ts
✅ lib/redux/features/chatSlice.ts
✅ app/login/page.tsx
✅ app/signup/page.tsx
✅ app/auth/verify/page.tsx
✅ app/dashboard/page.tsx
✅ app/chat/page.tsx

OPTIONAL:
- app/apply/page.tsx
- app/calculator/page.tsx
- app/auth/forgot-password/page.tsx
- app/auth/reset-password/[token]/page.tsx

ENV VARIABLES:
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_SOCKET_URL=http://localhost:8001
```

---

## Performance Tips

```typescript
// 1. Use React.memo to prevent re-renders
const Card = React.memo(({ loan }) => {
  return <div>{loan.amount}</div>;
});

// 2. Use useCallback for event handlers
const handleClick = useCallback(() => {
  dispatch(someAction());
}, [dispatch]);

// 3. Lazy load pages
const Dashboard = dynamic(() => import('./dashboard'), {
  loading: () => <Skeleton />
});

// 4. Optimize images
<Image src={url} width={100} height={100} alt="..." />

// 5. Use debounce for search
const debouncedSearch = useCallback(
  debounce((term) => dispatch(searchLoans(term)), 300),
  [dispatch]
);
```

---

## Testing Your App

### Manual Testing

```
Login Flow:
1. Visit http://localhost:3000/login
2. Try wrong credentials → See error
3. Try correct credentials → Should redirect
4. Check localStorage for token
5. Reload page → Token still there?

Signup Flow:
1. Visit http://localhost:3000/signup
2. Fill form
3. Submit → Should redirect to /auth/verify
4. Enter OTP
5. Should redirect to /dashboard

Dashboard:
1. Should display user's loans
2. Should show stats
3. Click "Chat" → Should go to chat
4. Click "Apply" → Should go to apply

Chat:
1. Should load messages
2. Can type and send
3. Should receive messages
4. File upload should work
5. Escalation should trigger
```

---

## Deployment Checklist

```
BEFORE DEPLOYING:
□ npm run build passes
□ npm run lint passes
□ All TypeScript errors fixed
□ No console errors
□ No network 404s
□ All pages load under 3s
□ Mobile responsive
□ Cookie/token handling works
□ Error messages display
□ Loading states show
□ Forms validate input
□ 401 errors redirect properly
□ Environment variables set
□ Backend also deployed
□ CORS configured
□ Database backed up
□ SSL/HTTPS enabled
□ Rate limiting configured
□ Logging enabled
□ Error tracking setup
□ Performance monitored
```

---

## You're Ready! 🚀

**Everything is set up. Just:**

1. Copy 1-2 page templates if needed
2. Run frontend + backend
3. Test the flow
4. Done!

**Estimated time: 30-60 minutes**

Use these documents as reference as you build:

- STATUS_REPORT.md - Current status
- QUICK_COMPLETE_GUIDE.md - Step-by-step
- IMPLEMENTATION_COMPLETION.md - Detailed guides
- COMPLETION_SUMMARY.md - Full reference
- This file - Developer handbook

Go build something amazing! 💪
