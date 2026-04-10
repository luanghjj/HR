-- QR + GPS Check-in: neue Spalten für time_records
ALTER TABLE time_records ADD COLUMN IF NOT EXISTS method TEXT DEFAULT 'gps';
ALTER TABLE time_records ADD COLUMN IF NOT EXISTS qr_location TEXT;
ALTER TABLE time_records ADD COLUMN IF NOT EXISTS gps_verified BOOLEAN;
ALTER TABLE time_records ADD COLUMN IF NOT EXISTS gps_suspicious BOOLEAN DEFAULT false;

-- Kommentar: method Werte: 'gps', 'qr', 'qr+gps', 'manual'
