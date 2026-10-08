CREATE TABLE IF NOT EXISTS foundry_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  version INTEGER NOT NULL DEFAULT 1,
  data TEXT NOT NULL CHECK (json_valid(data)),
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS foundry_receipts (
  id TEXT PRIMARY KEY,
  actor INTEGER NOT NULL,
  request_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
