-- Migration 01: Align schema with tap-based logging (Ticket 06)

-- decisions: swap 'reject' → 'decline', add deliberation_switches
ALTER TABLE decisions DROP CONSTRAINT IF EXISTS decisions_choice_check;
ALTER TABLE decisions ADD CONSTRAINT decisions_choice_check
  CHECK (choice IN ('accept', 'granular', 'decline'));
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS deliberation_switches INT DEFAULT 0;

-- log_events: replace hover event_types with tap event_types
ALTER TABLE log_events DROP CONSTRAINT IF EXISTS log_events_event_type_check;
ALTER TABLE log_events ADD CONSTRAINT log_events_event_type_check
  CHECK (event_type IN (
    'banner_shown',
    'option_tapped',
    'option_changed',
    'submit_tapped'
  ));

-- log_events: swap 'reject' → 'decline' in target
ALTER TABLE log_events DROP CONSTRAINT IF EXISTS log_events_target_check;
ALTER TABLE log_events ADD CONSTRAINT log_events_target_check
  CHECK (target IN ('accept', 'granular', 'decline'));
