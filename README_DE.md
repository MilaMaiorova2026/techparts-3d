# TechParts 3D – Digitaler CAD-Bauteilkatalog

**Eigenständiges Portfolio-Projekt zur Vorbereitung auf ein Bewerbungsgespräch für die Ausbildung Fachinformatiker/in für Anwendungsentwicklung.**

TechParts 3D verbindet CAD-Konstruktion mit Webentwicklung. Drei selbst erstellte Modelle werden in einer zweisprachigen Weboberfläche präsentiert. Zu jedem Modell gehören technische Zeichnungen als PDF.

## Projektumfang

### Eigene CAD-Modelle

| Artikelnummer | Bauteil | CAD-System | Webmodell | Zeichnungen |
|---|---|---|---|---|
| TP-CAD-001 | Stufenwelle | KOMPAS-3D v25 | GLB | 2 PDF |
| TP-CAD-002 | Keilriemenscheibe | KOMPAS-3D v25 | GLB | 1 PDF |
| TP-CAD-003 | Wälzlager | Autodesk Fusion | GLB | 1 PDF |

Die Originaldateien aus den CAD-Programmen bleiben getrennt von den Webexporten erhalten. Die technischen Zeichnungen wurden nach den ursprünglichen Arbeitsunterlagen exportiert; es wird nicht behauptet, dass sie automatisch DIN-/ISO-konform sind. Für technische Maße und Toleranzen sind die jeweiligen Originalzeichnungen maßgeblich.

## Funktionen

- Zweisprachige Benutzeroberfläche auf Deutsch und Englisch.
- Katalog mit drei eigenen Bauteilen, Suchfeld und Kategorie-Filtern.
- 3D-Miniaturen in den Produktkarten sowie interaktive Detailansichten mit Drehen und Zoom.
- Originalzeichnungen als PDF.
- Technische Informationen und Kennzeichnung der CAD-Systeme und Dateiformate.
- Beispielhafter Lagerbestand und vereinfachte Lieferzeitberechnung.
- Anfrageformular mit Browser-Validierung.
- Speicherung von Testanfragen im lokalen Browserspeicher und gemeinsamer CSV-Export für Excel.
- Abschnitt „Vom CAD ins Web“ zur Erklärung des Projektablaufs.
- Responsives Layout für Desktop und Smartphone.

## Projektstruktur

Die Ordner- und Dateinamen müssen exakt übereinstimmen:

```text
techparts3d/
├── index.html
├── styles.css
├── app.js
├── README_DE.md
├── models/
│   ├── stepped-shaft.glb
│   ├── v-belt-pulley.glb
│   └── bearing.glb
└── drawings/
    ├── stepped-shaft-drawing-01.pdf.pdf
    ├── stepped-shaft-section.pdf.pdf
    ├── v-belt-pulley-drawing.pdf.pdf
    └── bearing-drawing.pdf.pdf
```

**Hinweis zu den PDF-Namen:** Die derzeit funktionierende Website verwendet die doppelte Endung `.pdf.pdf`. Die Dateien bitte nicht umbenennen, solange die Pfade im `app.js` nicht entsprechend angepasst werden.

## Lokal starten (Windows)

1. Den Ordner `techparts3d` im Windows-Explorer öffnen.
2. In die Adressleiste `powershell` eingeben und Enter drücken.
3. Folgenden Befehl ausführen:

```powershell
python -m http.server 8000
```

4. Im Browser `http://localhost:8000/` öffnen.
5. Das PowerShell-Fenster geöffnet lassen, solange der lokale Server gebraucht wird.

Der lokale Server ist wichtig, damit JavaScript-Module, GLB-Modelle und PDF-Dateien zuverlässig geladen werden. Three.js wird über ein CDN geladen; deshalb ist für den 3D-Viewer eine Internetverbindung erforderlich.

## Veröffentlichung mit GitHub Pages

Für die Veröffentlichung müssen die folgenden Inhalte im veröffentlichten Repository gemeinsam vorhanden sein:

- `index.html`, `styles.css` und `app.js` im veröffentlichen Stammverzeichnis.
- der Ordner `models` mit allen drei GLB-Dateien.
- der Ordner `drawings` mit allen vier PDF-Dateien.
- `README_DE.md` als Projektdokumentation.

Nach dem Hochladen die veröffentlichte Website testen: eine Modellkarte öffnen, das 3D-Modell drehen, alle vier PDF-Zeichnungen öffnen, die Sprache wechseln und den Anfrageexport überprüfen. Groß-/Kleinschreibung und Dateipfade müssen exakt stimmen.

## Anfrageformular und Datenschutzgrenzen der Demo

Die Anfragen werden mit `localStorage` im Browser gespeichert. Sie werden **nicht** an einen Server geschickt und sind nicht in einer zentralen Datenbank vorhanden. Jede Person und jeder Browser haben ihr eigenes lokales Speichergebiet. Außerdem sind `http://localhost:8000` und die GitHub-Pages-Adresse unterschiedliche Ursprünge und teilen ihre gespeicherten Anfragen nicht.

Die Schaltfläche zum gemeinsamen Export erstellt eine UTF-8-CSV-Datei mit Semikolon als Trennzeichen. Die CSV kann in Excel geöffnet werden. CSV speichert keine Excel-Formatierungen wie Schrift, Spaltenbreiten oder Farben. Diese können nach dem Öffnen in Excel eingestellt und bei Bedarf als `.xlsx` gespeichert werden.

Bitte keine echten vertraulichen Kontakt- oder Kundendaten in die öffentliche Demo eingeben. Beim Löschen der Browserdaten können lokal gespeicherte Anfragen verloren gehen. Vor dem Löschen daher zuerst den CSV-Export sichern.

## Verwendete Technologien

- **HTML5:** Seitenstruktur, Navigation, Formular und Dialog.
- **CSS3:** Layout, responsive Darstellung und visuelle Gestaltung.
- **JavaScript (ES Modules):** Produktdaten, Suche, Filter, Übersetzungen, Validierung, lokaler Speicher und CSV-Export.
- **Three.js r169:** 3D-Szene, Beleuchtung, Kamera und Interaktion.
- **GLTFLoader:** Laden der GLB-Modelle für Karten und Detailansichten.
- **GLB/glTF:** Webgeeignete 3D-Exportformate.
- **PDF:** Originalzeichnungen.
- **localStorage:** lokales Speichern der Demo-Anfragen im aktuellen Browser.
- **CSV:** gemeinsamer Export der Anfragen.

## Grenzen und mögliche Weiterentwicklung

Lagerbestände und Lieferzeiten sind erfundene Demonstrationswerte und stellen keine reale Verfügbarkeit dar. Es gibt kein Backend und keine zentrale Verwaltung von Anfragen. Für den produktiven Betrieb wären unter anderem eine serverseitige API, Datenbank, Authentifizierung, geeignete Zugriffskontrollen, ein Datenschutz- und Löschkonzept sowie zusätzliche Tests erforderlich.

Sinnvolle nächste technische Schritte wären automatisierte Tests, eine strukturierte externe Produktdaten-Datei, Barrierefreiheitstests und – falls ein echter Bestellprozess entstehen soll – ein sicheres Backend.

## Testcheckliste

- [ ] Die Seite lädt lokal und auf GitHub Pages.
- [ ] Deutsch/Englisch wechseln funktioniert.
- [ ] Suche und Kategorienfilter zeigen passende Produkte.
- [ ] Alle drei Karten zeigen die korrekten GLB-Miniaturen.
- [ ] Alle drei Detailansichten laden die richtige 3D-Datei.
- [ ] Der große Viewer lässt sich drehen und zoomen.
- [ ] Zwei Zeichnungen der Stufenwelle sowie die Zeichnungen von Schwing-/Wälzlager und Keilriemenscheibe öffnen sich.
- [ ] Lager- und Lieferzeitangaben sind als Demo erkennbar.
- [ ] Zwei Testanfragen nacheinander speichern; der Zähler erhöht sich und nicht bei jedem Speichern ein CSV-Download ausgelöst.
- [ ] Der gemeinsame CSV-Export enthält beide Testanfragen.
- [ ] Die CSV-Datei lässt sich in Excel mit getrennten Spalten öffnen.
- [ ] Die Oberfläche ist auf einem Smartphone benutzbar.

## Kurzbeschreibung für ein Bewerbungsgespräch

TechParts 3D ist ein selbstständiges Portfolio-Projekt, in dem ich drei CAD-Modelle aus KOMPAS-3D und Autodesk Fusion für eine zweisprachige Webanwendung aufbereitet habe. Die Website bietet GLB-basierte 3D-Ansichten, technische PDF-Zeichnungen, Suche und Filter, Demo-Produktdaten und ein Anfrageformular mit lokalem CSV-Export. Damit zeige ich, wie ich mein Maschinenbauwissen mit den Grundlagen der Frontend-Entwicklung verbinde und technische Informationen nutzerorientiert darstelle.
