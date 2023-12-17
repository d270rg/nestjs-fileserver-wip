// @ts-check
import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import * as esImport from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins:{
      'import': esImport,
      'unused-imports': unusedImports
    },
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        project: ['./tsconfig.eslint.json', './**/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules:{
      ...esImport.configs.errors.rules,
      "no-restricted-imports": [
        "error", 
        {
          "patterns": [{"group":["src/*"],"message": "Use relative import instead"}] 
        }
      ],
      "import/no-unresolved": "off",
      "import/order": [
        "error",
        {
          "alphabetize": {"order": "asc"}
        }
      ],
      "import/namespace": ["off"],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
            "warn",
            {
                "vars": "all",
                "varsIgnorePattern": "^_",
                "args": "after-used",
                "argsIgnorePattern": "^_",
            },
        ]
    }
  },
  {
    files: ['*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: ["**/*.config.ts","**/common/src/clients/*"]
  }
);