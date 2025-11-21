## Safe Float to Integer Migration (Postgres/Sequelize)

A proof-of-concept for migrating legacy FLOAT currency columns to BIGINT (Kobo/Cents) without downtime or data loss

## The Issue
We initially stored transaction amounts as FLOAT. This might cause two problems:

Rounding Errors: Floating point math is imprecise (e.g., 0.1 + 0.2 results in 0.300000004).

Scale: Standard Integers hit a limit at ~2.1 billion.

We needed to switch to BIGINT to store values in Kobo (lowest currency unit) while keeping the app running.

## The Strategy

We avoided a direct ALTER COLUMN because it locks the table and risks truncating data. Instead, we used a 4-step transaction:

Add Column: Create a temporary amount_kobo column (BIGINT).

Backfill: Use ROUND(amount * 100) to convert Naira to Kobo safely.

Note: ROUND is critical here. It fixes float artifacts like 10.99999 becoming 11.

Swap: Drop the old amount column and rename amount_kobo to amount.

Model Adapter: Updated the Sequelize model to automatically divide by 100 on reads and multiply by 100 on writes, preserving the existing API contract.

## Quick Start

1. Setup

npm install
npx sequelize-cli db:create


2. Simulate Legacy State (Float)

Creates the table with FLOAT and seeds it with decimal data.

npx sequelize-cli db:migrate --to 20251121140000-create-transactions-float.js
npx sequelize-cli db:seed:all
node scripts/get_amounts.js  # Output: 100.50


3. Run Migration (Fix)

Converts data to BIGINT and verifies integrity.

npx sequelize-cli db:migrate
node scripts/get_amounts.js  # Output: 10050


## Structure

migrations/:

...float.js: Sets up the "bad" state.

...integer.js: The fix (transactional migration).

models/transaction.js: Includes getters/setters for Kobo <-> Naira conversion.

scripts/get_amounts.js: Utility to verify DB values.
