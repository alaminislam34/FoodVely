# Provider Signup Component Structure

- `ProviderSignupFlow.tsx`: Orchestrates all steps, state management, and API calls.
- `types.ts`: Shared TypeScript types.
- `validation.ts`: Step-specific validation logic and slug generation.
- `api.ts`: API integration layer with clear endpoint placeholders for uploads and restaurant submission.
- `StepProgress.tsx`: Reusable progress indicator.
- `FormField.tsx`: Reusable label + error wrapper.
- `steps/AccountStep.tsx`: Step 1 UI.
- `steps/OtpStep.tsx`: Step 2 UI.
- `steps/RestaurantStep.tsx`: Step 3 UI.
