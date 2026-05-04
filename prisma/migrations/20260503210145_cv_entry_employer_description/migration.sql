-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CvEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "employer" TEXT NOT NULL DEFAULT '',
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CvEntry" ("createdAt", "id", "period", "sortOrder", "title", "type", "updatedAt") SELECT "createdAt", "id", "period", "sortOrder", "title", "type", "updatedAt" FROM "CvEntry";
DROP TABLE "CvEntry";
ALTER TABLE "new_CvEntry" RENAME TO "CvEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
