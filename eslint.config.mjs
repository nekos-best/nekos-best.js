// @ts-check

import stylistic from "@stylistic/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import tseslint from "typescript-eslint";

export default tseslint.config(
    perfectionist.configs["recommended-natural"],
    tseslint.configs.eslintRecommended,
    tseslint.configs.stylistic,
    tseslint.configs.strict,
    {
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            "@stylistic/comma-dangle": ["warn", "always-multiline"],
            "@stylistic/dot-location": ["error", "property"],
            "@stylistic/indent": ["error", 4],
            "@stylistic/operator-linebreak": ["error", "before"],
            "@stylistic/quote-props": ["error", "consistent", { keywords: true }],
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": ["error", "always"],
            "@stylistic/space-unary-ops": "error",
            "@stylistic/wrap-iife": ["error", "inside"],

            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-unused-vars": "error",

            "no-else-return": ["error", { allowElseIf: true }],
        },
    },
);
