INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@royaluzhavan.com', '$2b$12$N37lO.Ofayx0ZLQ.uYOZ5u.fOOBG2QKZvwFB0.LYeA7D.B8kS0q26', 'admin')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;
