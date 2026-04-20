চমৎকার। এখন তোমাকে এমনভাবে roadmap দিচ্ছি যাতে তুমি Copilot Chat-কে command করে phase by phase strong output নিতে পারো, scope নষ্ট না করে।

**How To Use Copilot Best (Execution System)**
1. প্রতিটা phase আলাদা chat thread-এ করো।
2. একবারে পুরো project না দিয়ে, এক feature এক prompt দাও।
3. Prompt-এ সবসময় 5টা জিনিস থাকবে:
1. Goal
2. Scope (কোন file touch করবে, কোনটা করবে না)
3. API contract source
4. Acceptance criteria
5. Validation command
4. প্রতিটা কাজ শেষে Copilot-কে বলবে:
1. changed files list দাও
2. কেন change করেছ explain করো
3. compile বা lint errors check করো
4. regression risk বলো
5. যেখানে দরকার না সেখানে refactor করতে দিও না।

**Global Master Prompt Template (সব phase-এ ব্যবহার করবে)**
এই template copy করে শুধু feature অনুযায়ী replace করবে:

1. Context: আমি FoodValy project-এ কাজ করছি। API contract follow করো from API_IMPLEMENTATION_GUIDE.md।
2. Task: (exact feature)
3. Scope allowed files: (list)
4. Do not touch: (list)
5. Requirements:
1. TypeScript strict safe
2. Loading, error, empty state
3. Toast feedback
4. Responsive UI
5. Reusable components
6. Output needed:
1. Implementation
2. Changed file list
3. Manual test steps
4. Risk notes
7. শেষে get_errors run করে fix করো।

**Phase By Phase Copilot Implementation Playbook**

**Phase 0: Foundation Lock**
Prompt 1:
- Provider routes audit করো এবং dead routes list করো from page.tsx and layout.tsx।
- Route map markdown file বানাও: needed_frontend_route_map.md
- Output: existing route, missing route, dead link route.

Prompt 2:
- Shared UI blocks create করো:
1. PageHeader
2. StatCard
3. TableSkeleton
4. EmptyState
5. ErrorState
- Scope only নতুন reusable component folder.

Prompt 3:
- Provider pages-এর common filters and pagination utility বানাও।
- Existing pages refactor না করে helper utilities only add করো।

Acceptance:
1. কোন page broken হবে না
2. new shared components ready থাকবে

---

**Phase 1: Provider Core**
Prompt 1:
- Missing routes create করো:
1. /provider/finance
2. /provider/performance
3. /provider/menu
4. /provider/menu/add
- UI professional but lightweight placeholder না, functional skeleton state সহ।

Prompt 2:
- page.tsx কে API-ready form বানাও:
1. form validation
2. submit handler
3. success এবং error toast
4. disable submit while loading

Prompt 3:
- page.tsx কে real data architecture-এ নাও:
1. fetch abstraction
2. filter/search/sort/page param sync
3. edit/delete action handlers stub with API calls

Acceptance:
1. Provider entry থেকে dead link শূন্য
2. Product এবং add product real flow ready

---

**Phase 2: Provider Operations**
Prompt 1:
- page.tsx এ:
1. order status update action
2. detail modal বা drawer
3. retry on failure

Prompt 2:
- page.tsx:
1. reply submit API wire
2. reply edit support
3. pending/replied badges correct

Prompt 3:
- page.tsx:
1. create
2. update
3. activate/deactivate
4. delete
5. optimistic UI না, safe refresh pattern

Acceptance:
1. Orders, reviews, coupons তিনটাই operational

---

**Phase 3: Analytics & Reports**
Prompt 1:
- page.tsx mock numbers remove করে API-driven summary/chart data বসাও।

Prompt 2:
- page.tsx:
1. date range filter
2. payment mix
3. csv export button handler

Prompt 3:
- page.tsx:
1. status/channel filters
2. hourly volume
3. completion এবং cancellation insights

Acceptance:
1. কোন mock business value থাকবে না
2. সব chart empty/error fallback handle করবে

---

**Phase 4: Account Professionalization**
Prompt 1:
- Account module split pages add করো:
1. orders list
2. order detail
3. addresses
4. payment methods
5. settings

Prompt 2:
- Profile duplication audit করে একটাকে canonical route করো:
- src/app/(home)/account/profile/page.tsx/account/profile/page.tsx)
- [src/app/(home)/account/[username]/page.tsx](src/app/(home)/account/[username]/page.tsx)

Prompt 3:
- Checkout + tracking UX consistency improve করো, step states and validation fix করো।

Acceptance:
1. User dashboard full lifecycle complete
2. duplicate profile confusion remove

---

**Phase 5: Public UX + SEO**
Prompt 1:
- products landing add:
1. /products
2. /products/[slug]
- existing menu logic reuse করো

Prompt 2:
- contact map placeholder replace করো at src/app/(home)/contact/page.tsx/contact/page.tsx)

Prompt 3:
- route-level error/loading polish:
1. not-found
2. provider/admin/home specific loading ও error handling

Acceptance:
1. Public UX production-ready
2. SEO-friendly routing improved

---

**Phase 6: Differentiator Features**
Prompt 1:
- loyalty and rewards page
Prompt 2:
- referral page
Prompt 3:
- support center page
Prompt 4:
- personalized recommendations section (history/cart ভিত্তিক)

Acceptance:
1. product feels unique
2. retention features visible

---

**Copilot Output Quality Booster Prompts**
1. “Only edit files necessary for this task. Do not refactor unrelated code.”
2. “Before coding, list exact files you will change.”
3. “After coding, run error checks and fix all new issues.”
4. “If API is missing, create typed service stubs with TODO comments and safe fallback UI.”
5. “Preserve existing visual language of this project.”

**Regression Guard Prompt (খুব দরকারি)**
- “If you detect unexpected changes in unrelated files, stop and ask before continuing.”

**Per-Phase Done Checklist**
1. Routes কাজ করছে
2. Loading কাজ করছে
3. Error state আছে
4. Empty state আছে
5. Toast feedback আছে
6. No new TypeScript সমস্যা
7. Mobile responsive okay
8. Changed files documented

**Execution Tip (Very Important)**
1. একদিনে এক phase এর বেশি নিও না।
2. প্রতিটা বড় page-এর জন্য আলাদা Copilot prompt দাও।
3. প্রথমে architecture, পরে UI polish।
4. API না থাকলে fake data নয়, structured fallback and TODO stubs দাও।

চাইলে আমি এখনই তোমার জন্য Phase 1 এর exact copy-paste prompts লিখে দিতে পারি, page অনুযায়ী আলাদা করে।