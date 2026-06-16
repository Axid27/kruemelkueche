-- Participants
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition SMALLINT NOT NULL CHECK (condition IN (1, 2, 3)),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed BOOLEAN DEFAULT false,
  screen_width INT,
  user_agent TEXT
);

-- Cookie-Entscheidung + Timing
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  choice TEXT NOT NULL CHECK (choice IN ('accept', 'granular', 'decline')),
  decision_time_ms INT NOT NULL,
  deliberation_switches INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rohe Log-Events (Hover, Klicks)
CREATE TABLE log_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'banner_shown',
    'option_tapped',
    'option_changed',
    'submit_tapped'
  )),
  target TEXT CHECK (target IN ('accept', 'granular', 'decline')),
  timestamp_ms BIGINT NOT NULL,
  duration_ms INT
);

-- Survey-Antworten (einzelne Items)
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  scale TEXT NOT NULL CHECK (scale IN (
    'grassl',
    'bongard',
    'iuipc',
    'demographics'
  )),
  item_key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Berechnete Skalenmittelwerte
CREATE TABLE scale_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,

  -- Graßl (Perceived Control, 5 Items, kein Reverse)
  grassl_mean NUMERIC(4,2),

  -- Manipulation Awareness (5 Items, MA5 reversed)
  bongard_mean NUMERIC(4,2),

  -- IUIPC-8 Subskalen + Gesamtscore
  iuipc_control_mean    NUMERIC(4,2),   -- IC1, IC2
  iuipc_awareness_mean  NUMERIC(4,2),   -- IA1, IA2
  iuipc_collection_mean NUMERIC(4,2),   -- ICO1–ICO4
  iuipc_total_mean      NUMERIC(4,2),   -- Mittelwert alle 8 Items

  -- Demographische Daten
  age               INT,
  gender            TEXT,
  education         TEXT,
  education_other   TEXT,
  employment_status TEXT,
  employment_other  TEXT,
  internet_usage    TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS aktivieren
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE scale_scores ENABLE ROW LEVEL SECURITY;

-- Policies: nur INSERT über anonyme Browser-Session
CREATE POLICY "insert_own" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_own" ON decisions FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_own" ON log_events FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_own" ON survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "insert_own" ON scale_scores FOR INSERT WITH CHECK (true);
