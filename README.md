# Depay — Bills. Sorted.

The Depay marketing site **and the real customer-facing web app**, wired end to
end to `DEPAY_BACKEND`. Built with Vite, React, TypeScript, Tailwind CSS,
TanStack Query, and Socket.IO.

Registration, login, wallet funding, and all four bill-payment flows
(airtime, data, TV, electricity) talk to the live API — nothing here is
mocked or simulated.

## Getting started

```bash
npm i
cp .env.example .env
# edit .env and set VITE_API_URL to your backend's base URL
npm run dev
```

Then open http://localhost:3000 (the dev server is pinned to port 3000 to
match the backend's CORS allowlist — see `vite.config.ts`).

## Other commands

```bash
npm run build     # type-check + production build into dist/
npm run preview   # preview the production build locally
```

## Pages

**Marketing site**
- `/` — Home: hero, service overview, how it works, referral teaser, testimonials, FAQ
- `/services` — Full catalogue of every bill category with sample pricing
- `/referrals` — Referral tiers, vouchers and coupons explained
- `/about` — Company story, values, timeline, team
- `/contact` — Contact info + a client-side contact form

**App** (all real, API-backed)
- `/login` — Real login against the backend
- `/register` — The actual 3-step signup the backend requires: email → OTP → account details
- `/forgot-password` — Password reset via emailed OTP
- `/dashboard` — Wallet balance, quick actions, recent activity (from the ledger)
- `/dashboard/airtime` — Airtime top-up — live network list, network auto-detect from phone prefix
- `/dashboard/data` — Data bundles — live network + plan list per network
- `/dashboard/tv` — TV subscription — live provider/bouquet list, smartcard verification
- `/dashboard/electricity` — Electricity — live DisCo list, meter verification, prepaid/postpaid
- `/dashboard/fund-wallet` — Shows the user's real dedicated bank account (Paystack NUBAN); credits
  land automatically and reflect live via Socket.IO — no "confirm payment" button, because there's
  nothing to confirm client-side
- `/dashboard/transactions` — Full ledger history (every wallet movement — bills, funding, refunds,
  referral bonuses — not just bill payments), paginated, filterable by category
- `/dashboard/profile` — Account details, referral code, change transaction PIN, log out

Every bill payment is gated by the same PIN-confirmation step as the mobile
app: enter the 4-digit transaction PIN, the app verifies it against the
backend, then submits the payment — with a "Verifying your PIN" →
"Processing your payment" stage indicator during the wait, mirroring the
mobile app's OTP screen.

## Architecture

```
src/
  lib/
    api/
      client.ts      axios instance — attaches the bearer token, auto-retries
                      once on 401 via /user/refresh-token, then logs out if
                      that also fails
      auth.ts         registration (3-step OTP), login, profile, password reset
      wallet.ts       dedicated account creation, ledger history
      bills.ts        service listing, plan variations, verification, payment
      pin.ts          set / verify / update transaction PIN
    socket.ts          Socket.IO singleton — joins the user's room, used for
                       live balance updates when a wallet funding webhook lands
    networkDetect.ts   Nigerian mobile network prefix → name (static, no API)
    ledgerDisplay.ts   ledger category → icon/label mapping
  hooks/
    useBills.ts        React Query hooks wrapping lib/api/bills.ts
    useWallet.ts        React Query hooks wrapping lib/api/wallet.ts
  context/
    AuthContext.tsx    real session state — token, cached user, live balance,
                       backed by lib/api/auth.ts + lib/storage.ts
  types.ts             types mirrored from the backend's actual response shapes
  components/
    dashboard/PinModal.tsx    PIN verification + payment submission, with the
                              stage-based loading overlay
    dashboard/Receipt.tsx     post-payment receipt, built from the real
                              VTPass response (token/units/pin where applicable)
    dashboard/TransactionRow.tsx   renders a real ledger entry
  pages/
    dashboard/*        each bill-payment page: fetch live services → fetch
                       plans/variations → verify (where applicable) → PIN → pay
```

## Notes and known limitations

- **Transaction history search.** The `/wallet/ledger` endpoint supports
  pagination and category filtering but not a text search param, so there's
  no search box on `/dashboard/transactions` — only category pills. Adding
  search would need a small backend change first.
- **PIN change security.** The backend's `/PIN/update-pin` endpoint does not
  itself verify the current PIN before overwriting it — this frontend
  compensates by calling `/PIN/verify-PIN` first and only proceeding to
  `update-pin` if that succeeds, but a stricter fix (verifying server-side)
  belongs in `DEPAY_BACKEND`, not here.
- **A few user-lookup endpoints are unauthenticated on the backend**
  (`GET /user/user/:email`, `GET /user/balance/:email`) — anyone who knows an
  email can query it. Worth tightening in `DEPAY_BACKEND` behind
  `verifyToken` at some point; not something the frontend can fix on its own.
- **Google login** — the backend has a `/user/auth/google-login` route, but
  there's no Google OAuth client wired up here yet (needs a client ID from
  Google Cloud Console plus a decision on how the popup/redirect flow should
  look). Not included in this pass.

## Notes for wiring up the marketing site's own CTAs

- The contact form in `/contact` only manages local state; connect its `handleSubmit`
  to your API or a service like Formspree/Resend when ready.
- Prices and stats in `src/data.ts` are placeholders — update with real figures.
