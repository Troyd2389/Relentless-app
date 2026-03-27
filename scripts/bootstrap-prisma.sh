#!/usr/bin/env bash
set -euo pipefail

# Optional: set this to an internal Prisma engine mirror if binaries.prisma.sh is blocked.
# export PRISMA_ENGINES_MIRROR="https://<your-internal-mirror>"

export DATABASE_URL="${DATABASE_URL:-file:./prisma/dev.db}"
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

npm install
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
