source: https://chat.qwen.ai/c/524b3ded-3ced-428b-94ca-442c4d37f72f
# Panduan Membuat React Library dari Nol hingga Publish ke NPM

Dokumentasi lengkap untuk membuat React component library yang dapat di-publish ke NPM dengan TypeScript, Rollup, dan best practices modern.

---

## 📋 Daftar Isi

1. [Persiapan Awal](#persiapan-awal)
2. [Setup Project](#setup-project)
3. [Konfigurasi TypeScript](#konfigurasi-typescript)
4. [Setup Build Tools](#setup-build-tools)
5. [Membuat Component](#membuat-component)
6. [Build dan Test Lokal](#build-dan-test-lokal)
7. [Publish ke NPM](#publish-ke-npm)
8. [Tips & Troubleshooting](#tips--troubleshooting)

---

## 🎯 Persiapan Awal

### Prerequisites

Pastikan sudah terinstall:

```bash
# Check Node.js version (minimal v16.0.0)
node --version

# Check npm version (minimal v7.0.0)
npm --version
```

Jika belum terinstall, download dari [nodejs.org](https://nodejs.org)

### Buat NPM Account

1. Kunjungi [npmjs.com](https://www.npmjs.com)
2. Klik "Sign Up"
3. Isi form registrasi dengan email, username, dan password
4. Verifikasi email Anda
5. Siap untuk publish!

---

## 🚀 Setup Project

### Step 1: Buat Folder Project

```bash
mkdir module-export-test-component
cd module-export-test-component
```

### Step 2: Inisialisasi npm

```bash
npm init -y
```

Ini akan membuat file `package.json` dengan konfigurasi default. Anda bisa edit nanti sesuai kebutuhan.

### Step 3: Buat Struktur Folder

```bash
mkdir -p src/components/MyButton
```

Struktur akan terlihat seperti:
```
module-export-test-component/
├── src/
│   └── components/
│       └── MyButton/
├── package.json
└── node_modules/
```

### Step 4: Install Dependencies

#### Install Dev Dependencies

```bash
npm install --save-dev \
  typescript \
  @types/react \
  @types/react-dom \
  rollup \
  @rollup/plugin-typescript \
  @rollup/plugin-node-resolve \
  @rollup/plugin-commonjs \
  @rollup/plugin-terser \
  rollup-plugin-peer-deps-external \
  react \
  react-dom
```

#### Atau gunakan one-liner:

```bash
npm install --save-dev typescript @types/react @types/react-dom rollup @rollup/plugin-typescript @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-terser rollup-plugin-peer-deps-external react react-dom
```

#### Install Runtime Dependencies

```bash
npm install tslib
```

---

## ⚙️ Konfigurasi TypeScript

### Step 1: Buat `tsconfig.json`

Buat file `tsconfig.json` di root folder:

```bash
touch tsconfig.json
```

### Step 2: Isi `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "ES2020"],
    "jsx": "react-jsx",
    
    // Output configuration
    "rootDir": "./src",
    "declaration": true,
    "declarationDir": "./dist/types",
    "emitDeclarationOnly": true,
    
    // Module resolution
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    
    // Strict checking
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Penjelasan:**
- `target: "ES2020"` - Target output JavaScript ES2020
- `module: "ESNext"` - Module format akan dihandle oleh Rollup
- `jsx: "react-jsx"` - Support JSX modern
- `declaration: true` - Generate `.d.ts` files
- `strict: true` - Enable all strict type checking

---

## 🛠️ Setup Build Tools

### Step 1: Buat `rollup.config.mjs`

Buat file `rollup.config.mjs` di root:

```bash
touch rollup.config.mjs
```

### Step 2: Isi `rollup.config.mjs`

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser';

export default {
  // Entry point
  input: 'src/index.ts',
  
  // Output formats
  output: [
    {
      // ES Module format
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      // CommonJS format
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  ],
  
  // Plugins
  plugins: [
    // 1. Mark peer dependencies sebagai external
    peerDepsExternal(),
    
    // 2. Resolve node_modules dan file extensions
    resolve({ 
      extensions: ['.js', '.jsx', '.ts', '.tsx'] 
    }),
    
    // 3. Convert CommonJS ke ESM
    commonjs(),
    
    // 4. Transpile TypeScript
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false, // TypeScript akan handle ini
      declarationDir: undefined,
    }),
    
    // 5. Minify untuk production
    terser(),
  ],
};
```

**Penjelasan Plugin:**

| Plugin | Fungsi |
|--------|--------|
| `peerDepsExternal` | Exclude React dari bundle (user sudah punya) |
| `resolve` | Resolve import dari node_modules |
| `commonjs` | Konversi CommonJS modules ke ESM |
| `typescript` | Transpile TS & JSX ke JavaScript |
| `terser` | Minify & optimasi code |

### Step 3: Update `package.json`

Buka `package.json` dan update dengan:

```json
{
  "name": "module-export-test-component",
  "version": "1.0.0",
  "description": "React button component library",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "keywords": ["react", "component", "button", "ui"],
  
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/types/index.d.ts",
  
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    }
  },
  
  "files": ["dist"],
  "sideEffects": false,
  
  "scripts": {
    "build": "tsc && rollup -c",
    "prepublishOnly": "npm run build",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  
  "peerDependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  
  "devDependencies": {
    "@rollup/plugin-commonjs": "^29.0.3",
    "@rollup/plugin-node-resolve": "^16.0.3",
    "@rollup/plugin-terser": "^1.0.0",
    "@rollup/plugin-typescript": "^12.3.0",
    "@types/react": "^19.2.16",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "rollup": "^4.61.0",
    "rollup-plugin-peer-deps-external": "^2.2.4",
    "typescript": "^6.0.3"
  },
  
  "dependencies": {
    "tslib": "^2.8.1"
  }
}
```

**Penjelasan Field Penting:**

| Field | Penjelasan |
|-------|-----------|
| `main` | Entry point untuk CommonJS |
| `module` | Entry point untuk ES Modules |
| `types` | Location dari TypeScript declarations |
| `exports` | Modern export maps (Node 12.20+) |
| `files` | Hanya publish file dari folder `dist` |
| `sideEffects` | Set `false` untuk tree-shaking optimization |
| `peerDependencies` | Dependencies yang perlu di-install user |

---

## 📦 Membuat Component

### Step 1: Buat Component File

Buat file `src/components/MyButton/MyButton.tsx`:

```bash
touch src/components/MyButton/MyButton.tsx
```

### Step 2: Isi Component Code

```tsx
import React from 'react';

export interface MyButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const MyButton: React.FC<MyButtonProps> = ({ 
  label, 
  onClick, 
  disabled 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ 
        padding: '8px 16px', 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  );
};
```

### Step 3: Buat Index File untuk Export

Buat file `src/components/MyButton/index.ts`:

```bash
touch src/components/MyButton/index.ts
```

Isi dengan:

```typescript
export * from './MyButton';
```

### Step 4: Buat Root Index File

Buat file `src/index.ts`:

```bash
touch src/index.ts
```

Isi dengan:

```typescript
export * from './components/MyButton';
```

**Struktur Final:**

```
src/
├── index.ts
└── components/
    └── MyButton/
        ├── index.ts
        └── MyButton.tsx
```

---

## 🔨 Build dan Test Lokal

### Step 1: Build Library

```bash
npm run build
```

Output akan terlihat seperti:

```
✓ built in 2.3s

dist/esm/index.js
dist/cjs/index.js
dist/types/index.d.ts
```

### Step 2: Cek Hasil Build

```bash
# Cek struktur folder dist
ls -la dist/

# Output:
# dist/
# ├── cjs/
# │   ├── index.js
# │   └── index.js.map
# ├── esm/
# │   ├── index.js
# │   └── index.js.map
# └── types/
#     └── index.d.ts
```

### Step 3: Test Install Lokal

#### Opsi A: Menggunakan `npm pack`

```bash
# Di folder library
npm pack

# Output: module-export-test-component-1.0.0.tgz
```

#### Opsi B: Menggunakan `npm link`

```bash
# Di folder library
npm link

# Di project React lain
npm link module-export-test-component

# Verifikasi
npm ls module-export-test-component
```

### Step 4: Test di React App

Buat test file atau coba di project React lainnya:

```tsx
import { MyButton } from 'module-export-test-component';

function App() {
  return (
    <MyButton 
      label="Click Me!" 
      onClick={() => alert('Hello!')}
    />
  );
}

export default App;
```

---

## 📤 Publish ke NPM

### Step 1: Login ke NPM

```bash
npm login
```

Masukkan:
- Username NPM Anda
- Password NPM Anda
- Email NPM Anda (optional)

Verifikasi login:

```bash
npm whoami
```

### Step 2: Update Version (Optional)

Jika sudah publish sebelumnya, update version:

```bash
# Patch release (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# Minor release (new features): 1.0.0 -> 1.1.0
npm version minor

# Major release (breaking changes): 1.0.0 -> 2.0.0
npm version major
```

### Step 3: Verifikasi package.json

Pastikan field ini sudah lengkap:

```bash
npm pkg get name description version author license keywords
```

Contoh output yang bagus:

```json
{
  "name": "module-export-test-component",
  "description": "React button component library",
  "version": "1.0.0",
  "author": "John Doe <john@example.com>",
  "license": "MIT",
  "keywords": ["react", "component", "button", "ui"]
}
```

### Step 4: Publish ke NPM

#### Public Package (Default - Gratis)

```bash
npm publish --access public
```

#### Private Package (Berbayar, untuk org namespace)

```bash
npm publish
```

### Step 5: Verifikasi Publish

```bash
# Cek di NPM registry
npm view module-export-test-component

# Atau kunjungi:
# https://www.npmjs.com/package/module-export-test-component
```

Output akan menampilkan info package:

```
module-export-test-component@1.0.0 | MIT | ...
React button component library

keywords: react, component, button, ui

dist
.tarball: https://registry.npmjs.org/...
.shasum: abc123...
.integrity: sha512-xyz...
.unpackedSize: 5.2 kB

maintainers:
- your-username <your.email@example.com>

dist-tags:
latest: 1.0.0

published x minutes ago
```

---

## 🎉 Setelah Publish

### Install dari NPM

Sekarang orang lain bisa install:

```bash
npm install module-export-test-component
```

### Import di Project

```tsx
import { MyButton } from 'module-export-test-component';

// Gunakan component
<MyButton label="Hello" onClick={() => {}} />
```

---

## 🔄 Update Package

### Scenario: Ada bug atau fitur baru

```bash
# 1. Edit code di src/
# 2. Build ulang
npm run build

# 3. Update version
npm version patch  # atau minor/major

# 4. Publish
npm publish --access public
```

### Scenario: Unpublish (Emergency)

```bash
# Unpublish versi tertentu
npm unpublish module-export-test-component@1.0.0

# Unpublish semua (hanya dalam 72 jam pertama!)
npm unpublish module-export-test-component --force
```

---

## 📝 Tips & Troubleshooting

### Build Issues

#### Error: "Cannot find module 'react'"

**Solusi:** Pastikan React installed sebagai peer dependency:

```bash
npm ls react
```

#### Error: "Unexpected token 'export'"

**Solusi:** Update `tsconfig.json` module resolution:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

### Publish Issues

#### Error: "401 Unauthorized"

**Solusi:** Login ulang

```bash
npm logout
npm login
```

#### Error: "Package name already exists"

**Solusi:** Ganti nama di `package.json`:

```json
{
  "name": "@your-username/unique-name"
}
```

#### Error: "npm ERR! need auth"

**Solusi:** Cek apakah sudah login

```bash
npm whoami
npm adduser
```

### File Not Found Issues

Pastikan `files` field di package.json ada:

```json
{
  "files": ["dist"],
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/types/index.d.ts"
}
```

### Import Issues di Project User

#### Error: "Cannot find module"

**Solusi:** Pastikan user install dependencies:

```bash
npm install module-export-test-component react react-dom
```

#### CommonJS vs ESM

Library support keduanya:

```javascript
// ESM (Modern)
import { MyButton } from 'module-export-test-component';

// CommonJS (Legacy)
const { MyButton } = require('module-export-test-component');
```

---

## 📚 File Checklist

Setelah selesai, folder project harus punya:

```bash
✓ package.json          # Metadata package
✓ tsconfig.json         # TypeScript config
✓ rollup.config.mjs     # Bundler config
✓ src/                  # Source code
✓ README.md             # Dokumentasi usage
✓ Create.md             # Dokumentasi pembuatan (ini)
✓ dist/                 # Build output (generated)
✓ node_modules/         # Dependencies (generated)
```

---

## 🚀 Best Practices

### 1. Semantic Versioning

```
MAJOR.MINOR.PATCH
1.   2.     3

- MAJOR: Breaking changes (user harus update code)
- MINOR: New features (backward compatible)
- PATCH: Bug fixes
```

### 2. Meaningful Commit Messages

```
✓ "feat: add disabled state to MyButton"
✓ "fix: button padding styling"
✗ "update"
✗ "fix stuff"
```

### 3. Add .npmignore (Optional)

Buat file `.npmignore` untuk exclude file tertentu:

```
src/
tsconfig.json
rollup.config.mjs
Create.md
.gitignore
*.test.ts
node_modules/
```

### 4. Add .gitignore

```
node_modules/
dist/
*.tgz
.DS_Store
```

### 5. Add License

Buat file `LICENSE` (MIT):

```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 📖 References

- [NPM Docs](https://docs.npmjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rollup Docs](https://rollupjs.org/)
- [Semantic Versioning](https://semver.org/)
- [React Documentation](https://react.dev/)

---

## ✅ Ringkasan Langkah Cepat

Untuk yang ingin langsung tanpa detail:

```bash
# 1. Setup
mkdir my-lib && cd my-lib
npm init -y
npm install --save-dev typescript @types/react @types/react-dom rollup @rollup/plugin-typescript @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-terser rollup-plugin-peer-deps-external react react-dom
npm install tslib

# 2. Buat struktur
mkdir -p src/components/MyButton

# 3. Buat files (tsconfig.json, rollup.config.mjs, src files)
# ... lihat bagian di atas ...

# 4. Build
npm run build

# 5. Publish
npm login
npm publish --access public
```

---

**Selamat! Library Anda sudah siap di-publish ke NPM!** 🎊
