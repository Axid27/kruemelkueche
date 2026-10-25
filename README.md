# Krümelküche – Cookie-Consent-Studie

Studienprototyp zur Masterarbeit von Pit Kaldewey (TH Köln, Master Medieninformatik).
Die fiktive Backrezepte-Website „Krümelküche“ dient als Stimulus für ein mobiles Online-Experiment zur Frage, wie animierte Konsequenzvisualisierung an Cookie-Bannern Entscheidungsverhalten, Interaktionsdauer und wahrgenommene Kontrolle beeinflusst.

**Live:** https://kruemelkueche.vercel.app

---

## Studiendesign

- Between-Subjects-Experiment mit drei Bedingungen, mobile-only
- Serverseitige Block-Randomisierung (die kleinste Gruppe erhält die nächste Person)
- Participant-UUID und Bedingung werden per `sessionStorage` durch den Ablauf getragen

| Bedingung | Name | Animation | Frames (Accept / Granular / Decline) |
|---|---|---|---|
| 1 | Neutrale Animation | `Cookie-NoFacial.json` | 0–57 / 0–57 / 0–57 |
| 2 | Informatives Feedforward | `Cookie-NoFacial.json` | 0–57 / 58–119 / 120–220 |
| 3 | Affektives Feedforward (mit Mimik) | `Cookie-Facial.json` | 0–57 / 58–119 / 120–220 |

Die Frame-Zuordnung liegt in `src/lib/components/CookieBanner.svelte`.

### Ablauf

1. `/study/intro` – Briefing (als Web-Nutzungsstudie getarnt) und Einwilligung, Zuweisung der Bedingung
2. `/` – Landing Page der Krümelküche, Cookie-Banner erscheint nach 1500 ms
3. `/study/survey` – Graßl (wahrgenommene Kontrolle) → Bongard-Blanchy (Manipulation Awareness) → IUIPC-8 → Demografie, inkl. Attention Check
4. `/study/outro` – Debriefing und Option zur Löschung der eigenen Daten

### Erhobene Daten

- **Entscheidung:** `accept` / `granular` / `decline`
- **Decision Time:** ms vom Erscheinen des Banners bis zum Submit
- **Deliberation Switches:** Anzahl der Optionswechsel vor dem Submit
- **Event-Log:** `banner_shown`, `option_tapped`, `option_changed`, `submit_tapped`
- **Fragebogen:** Einzelitems und berechnete Skalenwerte (Scoring siehe `src/lib/questionnaire.ts` und `Survey.md`)

---

## Tech-Stack

- **Frontend:** SvelteKit 2, Svelte 5, TypeScript
- **Animation:** lottie-web
- **Backend:** Supabase (PostgreSQL, Region EU Frankfurt)
- **Hosting:** Vercel (Node.js 20)

---

## Projektstruktur

```
src/
├── lib/
│   ├── components/
│   │   ├── CookieBanner.svelte   # Banner + Lottie-Animation je Bedingung
│   │   └── LikertScale.svelte    # 7-stufige Likert-Skala
│   ├── stores/
│   │   ├── session.ts            # Participant-ID + Bedingung (sessionStorage)
│   │   └── logging.ts            # Event-Logging
│   ├── questionnaire.ts          # Items und Scoring der Skalen
│   ├── supabase.ts               # Supabase-Client
│   └── types/database.types.ts   # DB-Typen
└── routes/
    ├── +page.svelte              # Krümelküche Landing Page
    ├── study/intro|survey|outro  # Studienseiten
    ├── admin/                    # CSV-Export (Platzhalter)
    └── api/
        ├── assign-condition/     # POST: Teilnehmende anlegen + Bedingung zuweisen
        ├── save-decision/        # POST: Cookie-Entscheidung speichern
        ├── log-event/            # POST: Interaktions-Events speichern
        ├── submit-survey/        # POST: Fragebogen + Skalenwerte speichern
        ├── delete-participant/   # DELETE: Teilnehmende inkl. aller Daten löschen
        └── export-csv/           # GET: noch nicht implementiert (501)
static/
└── Cookie-Facial.json, Cookie-NoFacial.json   # Lottie-Animationen
supabase/
├── schema.sql                    # Basisschema
└── migration_01_logging.sql      # Migration auf tap-basiertes Logging
```

---

## Lokale Einrichtung

### Voraussetzungen

- Node.js 20 (siehe `.nvmrc`)
- Ein Supabase-Projekt

### Installation

```bash
nvm use
npm install
cp .env.example .env
```

`.env` befüllen:

```
PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Der Service-Role-Key wird nur serverseitig in den API-Routen verwendet und darf nie im Client landen.

### Datenbank

Im Supabase SQL-Editor nacheinander ausführen:

1. `supabase/schema.sql`
2. `supabase/migration_01_logging.sql`

Tabellen: `participants`, `decisions`, `log_events`, `survey_responses`, `scale_scores`. Das Löschen eines Eintrags in `participants` entfernt per `ON DELETE CASCADE` alle verknüpften Daten.

### Entwicklung

```bash
npm run dev       # Dev-Server
npm run build     # Produktions-Build
npm run preview   # Build lokal testen
npm run check     # Typprüfung
npm run lint      # Prettier + ESLint
npm run format    # Code formatieren
```

Da die Studie mobile-only ist, am besten in den Browser-DevTools mit Geräteemulation oder über das lokale Netzwerk auf einem Smartphone testen (`npm run dev -- --host`).

---

## Deployment

Das Projekt ist mit Vercel verbunden, jeder Push auf `main` löst ein Deployment aus. In Vercel müssen dieselben drei Umgebungsvariablen wie in `.env` hinterlegt sein. Die Node-Version ist über `package.json` (`engines`) und `vercel.json` auf 20.x festgelegt.

---

## Datenexport

Der Endpunkt `/api/export-csv` ist noch nicht implementiert. Der Export erfolgt aktuell direkt im Supabase SQL-Editor:

```sql
SELECT
  p.id AS participant_id,
  p.condition,
  p.created_at,
  d.choice,
  d.decision_time_ms,
  d.deliberation_switches,
  s.grassl_mean,
  s.bongard_mean,
  s.iuipc_control_mean,
  s.iuipc_awareness_mean,
  s.iuipc_collection_mean,
  s.iuipc_total_mean,
  s.attention_check_passed,
  s.age,
  s.gender,
  s.education,
  s.employment_status,
  s.internet_usage
FROM participants p
LEFT JOIN decisions d ON d.participant_id = p.id
LEFT JOIN scale_scores s ON s.participant_id = p.id
WHERE p.completed = true
  AND s.attention_check_passed = true
ORDER BY p.created_at ASC;
```

Die Auswertung erfolgt in JASP (primär) und Python (explorativ).

---

## Messinstrumente

| Skala | Items | Hinweise |
|---|---|---|
| Graßl et al. (2021) – wahrgenommene Kontrolle | GR1–GR5 | 7-stufig, Mittelwert |
| Bongard-Blanchy et al. (2021) – Manipulation Awareness | MA1–MA5 | 7-stufig, MA5 invertiert (8 − Wert), Mittelwert |
| IUIPC-8 (Malhotra et al., 2004) | IC1–2, IA1–2, ICO1–4 | 7-stufig, Subskalen + Gesamtmittelwert |
| Attention Check | ATT1 | bestanden bei Wert 7 |

---

## Kontakt

Pit Kaldewey – pit_tristan.kaldewey@smail.th-koeln.de
TH Köln, Lehrstuhl Mobile und verteilte interaktive Systeme
