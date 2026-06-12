# In-Between Days – Project TODO

## Phase 1: Database Schema & Backend API
- [x] Define DB schema: posts, categories, booklet_subscribers, media, about_page
- [x] Run drizzle migration
- [x] Backend tRPC routers: posts CRUD, categories, booklet subscriptions, about
- [x] File upload endpoint (images & PDF booklets)
- [x] Email sending for booklet (notify owner + send PDF to subscriber)

## Phase 2: Global Styles, Fonts, Nav & Footer
- [x] Google Fonts: Noto Serif TC + Noto Sans TC (Japanese-minimal feel)
- [x] Global CSS: low-saturation palette, generous whitespace, light typography
- [x] Top navigation bar (desktop + mobile hamburger)
- [x] Footer: copyright, social links, email

## Phase 3: Homepage
- [x] Full-bleed hero image with slogan overlay
- [x] Latest 3 posts preview section
- [x] Featured destinations section (6 categories)
- [x] Booklet CTA button
- [x] Japanese-minimal layout with generous whitespace

## Phase 4: Posts & Destinations
- [x] Post list page with card layout + category filter
- [x] Single post inner page (long-scroll, large images, wide line-height)
- [x] Optional film/book recommendation sections in post
- [x] Destination category page (filter by region)

## Phase 5: Column Pages & About
- [x] Travel × Film × Books column page
- [x] Booklet request page (name + email form, auto-send PDF)
- [x] About me page (philosophy, countries visited, personal photo)

## Phase 6: Admin Backend
- [x] Admin-only route guard (owner role check)
- [x] Admin dashboard: create/edit/delete posts
- [x] Photo upload in post editor
- [x] Manage booklet PDF files
- [x] View booklet subscribers list

## Phase 7: Integration, Tests & Delivery
- [x] Email integration test (booklet send + owner notification)
- [x] Vitest unit tests
- [x] Final responsive check (mobile/desktop)
- [x] Save checkpoint and deliver

## Phase 8: Multi-Booklet Tabs
- [x] Add slug, coverUrl, sortOrder columns to booklets table
- [x] Add getPublicBooklets() and getBookletBySlug() db helpers
- [x] Add publicList and bySlug procedures to booklets router
- [x] Update subscribe mutation to accept optional bookletSlug
- [x] Rewrite Booklet.tsx with tab navigation (熊野古道 / 沙巴神山)
- [x] Hero image switches when tab changes
- [x] Each tab has independent subscription form + success state
- [x] Update AdminBooklets.tsx with slug, coverUrl, sortOrder fields
- [x] Seed 熊野古道 and 沙巴神山 booklet records in DB

## Phase 9: Fix Admin Login
- [x] Fix upsertUser: always enforce admin role for owner (regardless of what role value was passed in)
- [x] Fix authenticateRequest in sdk.ts: re-check ownerOpenId on every request and upgrade role if needed
- [x] Fetch fresh user record after upsertUser so returned role is always current
- [x] Improve AdminLayout login screen: clear instructions, Manus account login button, back to site link
- [x] Improve AdminLayout "no permission" screen: show current account name, logout + re-login button
- [x] Add "← 前台" link in admin top bar for easy navigation back

## Phase 10: Email/Password Login for Admin
- [x] Add admin_credentials table (email, hashed password)
- [x] Backend: emailLogin mutation (verify email+password, issue JWT session)
- [x] Backend: setAdminPassword mutation (first-time setup, owner only)
- [x] Backend: changePassword mutation (change password when logged in)
- [x] Admin login page: email + password form
- [x] First-time setup page: set password if none configured
- [x] Ensure all admin pages work after email login (posts, booklets, about)
- [x] Tests for email login flow
