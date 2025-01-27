# AI Chat Tool

Ein Webtool zur Interaktion mit KI-APIs und Speicherung der Konversationen in Supabase.

## Installation

1. Repository klonen:
```bash
git clone [repository-url]
cd ai-chat-tool
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Umgebungsvariablen einrichten:
```bash
cp .env.example .env
```
Dann die `.env`-Datei mit Ihren API-Keys ausfüllen:
- Supabase URL und Anon Key von Ihrem Supabase-Projekt
- OpenAI API Key von Ihrem OpenAI-Account

4. Entwicklungsserver starten:
```bash
npm run dev
```

## Technologien

- React + Vite
- TypeScript
- TailwindCSS
- Supabase
- OpenAI API

## Entwicklung

Das Projekt verwendet:
- ESLint für Linting
- Prettier für Codeformatierung
- TypeScript für Typsicherheit 