## **1. General Architecture**

* Use **feature-based folder structure**, not giant `/components` or `/screens` dumps.
  Example:

  ```
  app/
    auth/
      components/
      screens/
      hooks/
      services/
    profile/
    home/
  ```
* Keep components **pure and presentational** when possible. Move logic to hooks.
* Use **TypeScript everywhere**.
* Use **React Query** or **SWR** for network cache + state. Avoid storing API data in Redux.

---

## **2. State Management**

* Prefer **React Query** for server state.
* Use **Zustand or Jotai** for simple client state (theme, filters, UI toggles).
* Avoid Redux unless project requires enterprise-scale global state.
* Keep state minimal; don’t duplicate state that can be derived.

---

## **3. Components**

* All components must be:

  * Function components
  * Typed with TypeScript (`FC<Props>` is allowed but not required)
  * Wrapped in `memo()` if they receive heavy props or re-render often

* Create reusable components for spacing, layout, and typography (e.g., `<Row>`, `<Spacer>`, `<TextXXL>`).

* Avoid deeply nested inline styles. Use:

  * `StyleSheet.create()`
  * Tailwind via **nativewind** when needed

---

## **4. Navigation**

* Use **React Navigation v6+**.
* Use **type-safe navigation** with `ParamList` for all stacks.
* Keep navigation definitions in their own folder (`navigation/`).
* Never put business logic inside screens directly; delegate to hooks.

---

## **5. API Layer**

* Create a dedicated folder for API logic:

  ```
  services/api/
  ```
* Use a single API client (e.g. Axios or fetch wrapper).
* Implement:

  * Interceptors for auth refresh
  * Automatic error normalization
* Always define **typed API responses** and **error shapes**.
* Never call `fetch()` directly inside screens.

---

## **6. Error Handling & Logging**

* Centralize all app errors:

  * API errors
  * Validation errors
  * Unexpected exceptions

* Use:

  * `ErrorBoundary` for UI-level failures
  * `Sentry` for production crash reports

---

## **7. Performance**

* Use `FlatList`/`SectionList` correctly:

  * Provide `keyExtractor`
  * Memoize `renderItem`
  * Use `getItemLayout` when list has fixed-size items

* Avoid anonymous inline functions inside render trees.

* Use `useCallback`, `useMemo`, and `memo` intentionally (not everywhere).

* Images:

  * Use **react-native-fast-image** for caching.
  * Always define explicit width/height.

---

## **8. Styling**

* Prefer:

  * **StyleSheet** for fixed styles
  * **nativewind** for dynamic styles
  * Avoid inline styles unless trivial (`<View style={{ flex: 1 }}>`)

* Follow a **design system**:

  * Colors in `theme/colors.ts`
  * Spacing in `theme/spacing.ts`
  * Typography in `theme/typography.ts`

* Always use consistent spacing (ex: 4/8/12/16/24).

---

## **9. Forms**

* Use **react-hook-form** + **zod** or **yup**.
* Store validation schemas next to form components.
* Do NOT manage form fields manually with local state.

---

## **10. File Organization**

```
src/
  app.tsx
  navigation/
  screens/
  components/
  hooks/
  services/
    api/
    auth/
  store/
  theme/
  utils/
  assets/
```

---

## **11. Security**

* Never store JWTs in plain AsyncStorage. Use:

  * **Expo SecureStore**
  * or Keychain/Keystore

* Always enable HTTPS.

* Disable all console logs in production.

---

## **12. Testing**

* Use **Jest** + **React Native Testing Library**.
* Snapshot test only stable UI components.
* Unit test:

  * hooks
  * services
  * pure components

---

## **13. Build & Deployment**

* Use **EAS Build** (Expo) or CI pipelines.
* Generate app icons & splash screens via tools (not manual resizing).
* Keep `.env` files out of version control.
* Use a config wrapper to access env variables.

---

## **14. Code Quality**

* Enforce:

  * ESLint (with react-native & react hooks plugins)
  * Prettier
  * TypeScript strict mode
  * Module path aliasing using `tsconfig.json`

* Never commit commented-out code.

* Avoid large components (>300 lines) — extract logic.