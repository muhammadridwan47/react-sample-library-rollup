
# Module Export Test Component

Library React component sederhana yang dapat di-publish ke NPM. Library ini berisi komponen `MyButton` yang dapat digunakan di project React lainnya.

## 📦 Instalasi

```bash
npm install module-export-test-component
```

atau dengan yarn:

```bash
yarn add module-export-test-component
```

## 🚀 Cara Penggunaan

### Import Component

```tsx
import { MyButton } from 'module-export-test-component';

function App() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div>
      <MyButton 
        label="Click Me" 
        onClick={handleClick} 
      />
      
      <MyButton 
        label="Disabled Button" 
        disabled={true} 
      />
    </div>
  );
}

export default App;
```

### Props

Component `MyButton` menerima props berikut:

| Prop | Type | Required | Default | Deskripsi |
|------|------|----------|---------|-----------|
| `label` | `string` | ✅ Yes | - | Text yang ditampilkan pada button |
| `onClick` | `() => void` | ❌ No | `undefined` | Fungsi callback ketika button diklik |
| `disabled` | `boolean` | ❌ No | `false` | Status disabled button |

## 🛠️ Development

### Struktur Project

```
module-export/
├── src/
│   ├── index.ts                    # Entry point, export semua components
│   └── components/
│       └── MyButton/
│           ├── index.ts            # Export MyButton component
│           └── MyButton.tsx        # Component implementation
├── dist/                           # Build output (generated)
│   ├── esm/                        # ES Module format
│   ├── cjs/                        # CommonJS format
│   └── types/                      # TypeScript declarations
├── package.json
├── tsconfig.json
├── rollup.config.mjs
└── README.md
```

### Prerequisites

- Node.js >= 16
- npm atau yarn
- TypeScript
- React 19.x (peer dependency)

### Install Dependencies

```bash
npm install
```

### Build Library

```bash
npm run build
```

Perintah ini akan:
1. Compile TypeScript dan generate type declarations (`tsc`)
2. Bundle dengan Rollup untuk format ESM dan CJS
3. Minify code dengan Terser
4. Output ke folder `dist/`

### Scripts

- `npm run build` - Build library untuk production
- `npm run prepublishOnly` - Otomatis build sebelum publish ke npm

## 📤 Publish ke NPM

### 1. Persiapan Sebelum Publish

#### a. Login ke NPM

```bash
npm login
```

Masukkan username, password, dan email NPM Anda.

#### b. Update package.json

Pastikan field berikut sudah diisi dengan benar:

```json
{
  "name": "module-export-test-component",
  "version": "1.0.0",
  "description": "React button component library",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "keywords": ["react", "component", "button", "ui"],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/module-export.git"
  },
  "bugs": {
    "url": "https://github.com/username/module-export/issues"
  },
  "homepage": "https://github.com/username/module-export#readme"
}
```

#### c. Cek Nama Package

Pastikan nama package belum digunakan:

```bash
npm search module-export-test-component
```

Jika sudah ada, ganti nama di `package.json` dengan nama yang unik.

### 2. Build Library

```bash
npm run build
```

### 3. Test Package Secara Lokal (Opsional)

Sebelum publish, Anda bisa test package secara lokal:

```bash
# Di folder library
npm pack

# Akan generate file .tgz, misalnya:
# module-export-test-component-1.0.0.tgz

# Di project lain, install dari file tersebut:
npm install /path/to/module-export-test-component-1.0.0.tgz
```

### 4. Publish ke NPM

#### Publish Public Package (Gratis)

```bash
npm publish --access public
```

#### Publish Private Package (Berbayar)

```bash
npm publish
```

### 5. Verifikasi

Cek apakah package berhasil di-publish:

```bash
npm view module-export-test-component
```

Atau kunjungi: `https://www.npmjs.com/package/module-export-test-component`

## 🔄 Update Version

Setiap kali ada perubahan, update versi mengikuti [Semantic Versioning](https://semver.org/):

```bash
# Patch (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor (1.0.0 -> 1.1.0) - New features (backward compatible)
npm version minor

# Major (1.0.0 -> 2.0.0) - Breaking changes
npm version major
```

Kemudian publish lagi:

```bash
npm publish --access public
```

## 📋 Checklist Sebelum Publish

- [ ] Build berhasil tanpa error (`npm run build`)
- [ ] Nama package unik dan sesuai naming convention
- [ ] Version number sudah di-update
- [ ] `package.json` sudah lengkap (name, version, description, author, license, keywords)
- [ ] README.md sudah informatif
- [ ] File `.npmignore` atau `files` field di package.json sudah dikonfigurasi
- [ ] Test package secara lokal
- [ ] Login ke NPM account (`npm whoami`)

## 🔧 Konfigurasi Penting

### package.json

```json
{
  "main": "./dist/cjs/index.js",           // Entry point untuk CommonJS
  "module": "./dist/esm/index.js",         // Entry point untuk ES Module
  "types": "./dist/types/index.d.ts",      // TypeScript declarations
  "exports": {                              // Modern export maps
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    }
  },
  "files": ["dist"],                        // Hanya publish folder dist
  "sideEffects": false,                     // Untuk tree-shaking optimization
  "peerDependencies": {                     // Dependencies yang harus ada di project user
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  }
}
```

### rollup.config.mjs

Rollup digunakan untuk bundle library dengan konfigurasi:
- **Output**: ESM dan CJS format
- **Plugins**: 
  - `peerDepsExternal` - Exclude peer dependencies dari bundle
  - `resolve` - Resolve node_modules
  - `commonjs` - Convert CommonJS ke ESM
  - `typescript` - Transpile TypeScript
  - `terser` - Minify code

### tsconfig.json

TypeScript dikonfigurasi untuk:
- Generate type declarations (`.d.ts`)
- Target ES2020
- Support JSX dengan `react-jsx`
- Module resolution: `bundler`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Your Name]

## 🐛 Issues

Jika menemukan bug atau ingin request feature, silakan buat issue di [GitHub Issues](https://github.com/username/module-export/issues).

## 📚 Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Rollup Documentation](https://rollupjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Documentation](https://react.dev/)

---

## 💡 Tips Tambahan

### Menambah Component Baru

Untuk menambah component baru ke library:

1. Buat folder baru di `src/components/`, misalnya `MyInput/`
2. Buat file `MyInput.tsx` dan `index.ts`
3. Export component di `src/components/MyInput/index.ts`
4. Export di `src/index.ts`: `export * from './components/MyInput';`
5. Build ulang: `npm run build`

### Testing di Project Lain

```bash
# Di folder library
npm link

# Di project React lain
npm link module-export-test-component

# Import seperti biasa
import { MyButton } from 'module-export-test-component';
```

### Unpublish Package (Hati-hati!)

```bash
# Unpublish versi tertentu
npm unpublish module-export-test-component@1.0.0

# Unpublish semua versi (hanya bisa dalam 72 jam pertama)
npm unpublish module-export-test-component --force
```

### Melihat Siapa yang Sudah Login

```bash
npm whoami
```

### Logout dari NPM

```bash
npm logout
```