'use strict';

module.exports = {
    parser: '@typescript-eslint/parser',
    ignorePatterns: ['venv/', 'CMakeFiles/'],
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        browser: true
    },
    extends: [
        'plugin:@hapi/recommended'
    ],
    plugins: [
        'eslint-plugin-import',
        'eslint-plugin-header',
        'eslint-plugin-unused-imports',
        'eslint-plugin-sort-class-members'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        'quote-props': ['error', 'as-needed'],
        'no-console': 'error',
        '@hapi/scope-start': 'off',
        'padding-line-between-statements': 'off',
        'max-len': [2, 120],
        'prefer-rest-params': 'off',
        'import/newline-after-import': ['error'],
        'import/first': 'error',
        'import/order': ['error', {
            alphabetize: {
                order: 'asc',
                caseInsensitive: true
            },
            'newlines-between': 'always'
        }],
        // 'import/no-extraneous-dependencies': 'error', // FIXME: this is broken on monorepo setup
        'unused-imports/no-unused-imports': 'error',
        'sort-class-members/sort-class-members': ['error', {
            order: [
                '[static-properties]',
                '[static-methods]',
                'constructor',
                '[methods]'
            ]
        }]
    }
};
