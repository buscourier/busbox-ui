// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const ngrx = require('@ngrx/eslint-plugin/v9');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const importPlugin = require('eslint-plugin-import');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    ignores: ['src/environments/*.ts'],
    plugins: {
      import: importPlugin,
      perfectionist: require('eslint-plugin-perfectionist'),
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...ngrx.configs.all,
      eslintPluginPrettierRecommended,
    ],
    processor: angular.processInlineTemplates,
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@ngrx/prefix-selectors-with-select': 'off',
      'max-len': [
        'error',
        {
          code: 100,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@angular/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@ngrx/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: 'rxjs/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: 'rxjs',
              group: 'external',
              position: 'after',
            },
            {
              pattern: 'rxjs/operators',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@taiga-ui/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@core/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@shared/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@utils/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@env/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@delivery/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '../../**',
              group: 'parent',
              position: 'before',
            },
            {
              pattern: '../**',
              group: 'parent',
              position: 'before',
            },
            {
              pattern: './**',
              group: 'sibling',
              position: 'before',
            },
          ],
          // pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/app/core',
              from: './src/app/features',
              message: 'Core модуль не должен зависеть от feature модулей',
            },
            {
              target: './src/app/shared',
              from: './src/app/features',
              message: 'Shared модуль не должен зависеть от feature модулей',
            },
            {
              target: './src/app/utils',
              from: './src/app/features',
              message: 'Shared модуль не должен зависеть от feature модулей',
            },
          ],
        },
      ],
      'import/no-internal-modules': [
        'error',
        {
          allow: [
            '@angular/**/*',
            'rxjs/*',
            'app/*',
            '@delivery/*',
            '@delivery/base/*',
            '@delivery/*/types',
            '@delivery/*/constants',
            '@shared/components/*',
            '@shared/features/*',
            '@shared/features/*/types',
            '@shared/layouts/*',
            'features/*',
            '*/services/*',
            'components/*',
            'guards/*',
            'html-to-image/**',
          ],
        },
      ],
      'import/no-cycle': ['error', { maxDepth: Infinity }],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      // 'perfectionist/sort-classes': 'error',
      // 'perfectionist/sort-imports': 'error',
      // 'perfectionist/sort-objects': 'error',
      // 'perfectionist/sort-interfaces': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
  {
    files: ['**/*.service.ts', '**/services/**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
);
