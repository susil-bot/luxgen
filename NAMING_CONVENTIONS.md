# 📝 Strict File Naming Conventions

## 🎯 **Naming Standards**

### **React Components (PascalCase)**
- ✅ **Correct**: `UserProfile.tsx`, `LoginForm.tsx`, `DashboardCard.tsx`
- ❌ **Incorrect**: `userProfile.tsx`, `login-form.tsx`, `dashboard_card.tsx`

### **Utility Files (camelCase)**
- ✅ **Correct**: `apiClient.ts`, `validationUtils.ts`, `dateHelpers.ts`
- ❌ **Incorrect**: `ApiClient.ts`, `validation-utils.ts`, `date_helpers.ts`

### **Constants (UPPER_CASE)**
- ✅ **Correct**: `API_ENDPOINTS.ts`, `USER_ROLES.ts`, `CONFIG_VALUES.ts`
- ❌ **Incorrect**: `apiEndpoints.ts`, `user-roles.ts`, `configValues.ts`

### **Directories (kebab-case)**
- ✅ **Correct**: `user-management/`, `auth-forms/`, `api-services/`
- ❌ **Incorrect**: `userManagement/`, `authForms/`, `api_services/`

### **Test Files (PascalCase.spec.tsx)**
- ✅ **Correct**: `UserProfile.spec.tsx`, `LoginForm.spec.tsx`
- ❌ **Incorrect**: `userProfile.spec.tsx`, `login-form.spec.tsx`

### **Type Files (PascalCase.types.ts)**
- ✅ **Correct**: `User.types.ts`, `ApiResponse.types.ts`
- ❌ **Incorrect**: `user.types.ts`, `api-response.types.ts`

## 📁 **Directory Structure**

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ForgotPasswordForm.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── services/
│   ├── apiClient.ts
│   ├── authService.ts
│   └── userService.ts
├── utils/
│   ├── validationUtils.ts
│   ├── dateHelpers.ts
│   └── formatters.ts
├── types/
│   ├── User.types.ts
│   ├── ApiResponse.types.ts
│   └── Common.types.ts
└── constants/
    ├── API_ENDPOINTS.ts
    ├── USER_ROLES.ts
    └── CONFIG_VALUES.ts
```

## 🔧 **File Naming Rules**

### **1. React Components**
- **Pattern**: `ComponentName.tsx`
- **Example**: `UserProfile.tsx`, `LoginForm.tsx`
- **Test**: `ComponentName.spec.tsx`

### **2. Hooks**
- **Pattern**: `useHookName.ts`
- **Example**: `useAuth.ts`, `useApi.ts`
- **Test**: `useHookName.spec.ts`

### **3. Services**
- **Pattern**: `serviceName.ts`
- **Example**: `apiClient.ts`, `authService.ts`
- **Test**: `serviceName.spec.ts`

### **4. Utils**
- **Pattern**: `utilityName.ts`
- **Example**: `validationUtils.ts`, `dateHelpers.ts`
- **Test**: `utilityName.spec.ts`

### **5. Types**
- **Pattern**: `TypeName.types.ts`
- **Example**: `User.types.ts`, `ApiResponse.types.ts`

### **6. Constants**
- **Pattern**: `CONSTANT_NAME.ts`
- **Example**: `API_ENDPOINTS.ts`, `USER_ROLES.ts`

### **7. Directories**
- **Pattern**: `kebab-case`
- **Example**: `user-management/`, `auth-forms/`

## ✅ **Validation Checklist**

- [ ] All React components use PascalCase
- [ ] All utility files use camelCase
- [ ] All constants use UPPER_CASE
- [ ] All directories use kebab-case
- [ ] All test files end with `.spec.tsx` or `.spec.ts`
- [ ] All type files end with `.types.ts`
- [ ] No spaces in file names
- [ ] No special characters except hyphens in directories
- [ ] Consistent naming across similar files

## 🚫 **Common Mistakes to Avoid**

1. **Mixed Case**: `userProfile.tsx` → `UserProfile.tsx`
2. **Snake Case**: `user_profile.tsx` → `UserProfile.tsx`
3. **Kebab Case**: `user-profile.tsx` → `UserProfile.tsx`
4. **Lowercase**: `userprofile.tsx` → `UserProfile.tsx`
5. **Spaces**: `User Profile.tsx` → `UserProfile.tsx`
6. **Special Characters**: `User@Profile.tsx` → `UserProfile.tsx`

## 🎯 **Benefits of Strict Naming**

- **Consistency**: Easy to find and understand files
- **Maintainability**: Clear file organization
- **Team Collaboration**: Everyone follows the same pattern
- **IDE Support**: Better autocomplete and navigation
- **Build Tools**: Consistent with bundler expectations
