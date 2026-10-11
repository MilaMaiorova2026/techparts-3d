# TechParts 3D – Digitaler Bauteilkatalog

**Portfolio-Projekt zur Vorbereitung auf ein Bewerbungsgespräch für die Ausbildung Fachinformatiker/in für Anwendungsentwicklung.**

TechParts 3D ist ein responsiver, zweisprachiger Demo-Webkatalog für technische Bauteile. Das Projekt verbindet Ingenieurwissen und CAD-Grundlagen mit Frontend-Entwicklung.

> **Wichtig:** Dies ist ein unabhängiges Lern- und Portfolio-Projekt. Es besteht keine Verbindung zu INNEO Solutions GmbH. Produktdaten, Preise, Lagerbestände und Lieferzeiten sind erfunden. Die technische Zeichnung ist schematisch und nicht für die Fertigung bestimmt.

## Funktionen

- Deutsche und englische Benutzeroberfläche (DE/EN).
- Suche nach Artikelnummer, Name und Material.
- Filter für Flansche und Halterungen.
- Produktdetails mit Material, Abmessungen, Gewicht und Anwendung.
- Interaktiver 3D-Viewer mit Drehen per Maus/Touch und Zoom per Mausrad.
- Schematische SVG-Maßzeichnung.
- Beispielhafte Lieferzeitberechnung nach Menge und Demo-Lagerbestand.
- Formularvalidierung für eine Anfrage.
- Export der Anfrage als CSV-Datei, die sich mit Excel öffnen lässt.
- Responsive Layout für Desktop und Smartphone.
- Keine Installation und kein Build-Prozess erforderlich.

## Schnellstart

### Option A – lokal testen

1. ZIP-Datei entpacken.
2. Den Ordner `techparts3d` öffnen.
3. `index.html` im aktuellen Browser öffnen.

Für den zuverlässigen Betrieb von JavaScript-Modulen und des 3D-Viewers empfiehlt sich ein lokaler Webserver. Falls Python installiert ist:

```bash
python -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen. Der Befehl muss im Projektordner ausgeführt werden. Alternativ kann eine lokale Entwicklungsumgebung wie Visual Studio Code mit der Erweiterung Live Server verwendet werden.

**Internet erforderlich:** Three.js und Google Fonts werden über externe CDNs geladen. Ohne Internetverbindung funktioniert der 3D-Viewer eventuell nicht; die Seite zeigt dann eine einfache CSS-Vorschau. Für eine vollständig offlinefähige Variante können die Bibliothek und Schriftdateien lokal eingebunden werden.

## Kostenlose Veröffentlichung mit GitHub Pages

1. Kostenloses Konto auf GitHub erstellen bzw. anmelden.
2. Ein neues **öffentliches** Repository anlegen, zum Beispiel `techparts-3d`.
3. `index.html`, `styles.css`, `app.js` und `README_DE.md` hochladen.
4. Im Repository **Settings → Pages** öffnen.
5. Unter **Build and deployment** die Bereitstellung aus dem Branch `main` und dem Ordner `/ (root)` auswählen und speichern.
6. Die von GitHub angezeigte URL öffnen und die veröffentlichte Seite testen.

Die Oberfläche von GitHub kann sich ändern. Die Veröffentlichung ist kostenlos für öffentliche Repositories im Rahmen der geltenden GitHub-Pages-Nutzungsbedingungen. Ein eigener Domainname ist nicht erforderlich.

## Projektstruktur

```text
techparts3d/
├── index.html     # Semantische Struktur und Inhalte
├── styles.css     # Layout, Farben, Typografie, Responsive Design
├── app.js         # Produktdaten und Anwendungslogik
└── README_DE.md   # Dokumentation
```

## Technische Architektur

- **HTML5:** semantische Abschnitte, Navigation, Formulare und Dialog für die Zeichnung.
- **CSS3:** Layout mit Grid/Flexbox, responsive Breakpoints, Fokuszustände und reduzierte Animationen bei `prefers-reduced-motion`.
- **JavaScript (ES Modules):** Produktdaten, Suche, Filter, Übersetzungen, Validierung, CSV-Export und Lieferzeit-Demologik.
- **Three.js:** prozedural erzeugtes vereinfachtes Flanschmodell und Montagehalter im Browser.
- **SVG:** schematische technische Zeichnung.
- **CSV:** Export einer Anfrage im UTF-8-Format mit BOM und Semikolon als Trennzeichen für eine gute Kompatibilität mit deutschem Excel.

## Geschäftslogik der Demo

Die Lieferzeit ist eine **vereinfachte Beispielberechnung**. Sie ist keine Produktionsplanung und berücksichtigt keine echten Lieferanten, Arbeitsgänge, Feiertage oder Kapazitäten. Der Lagerbestand ist ebenfalls nur ein Demonstrationswert.

CSV-Dateien werden lokal im Browser erstellt und heruntergeladen. Es gibt **kein Backend**, keine zentrale Datenbank und keine automatische Übertragung an ein Unternehmen. Beim Export werden keine Daten an diesen Projektserver gesendet. Für eine echte kommerzielle Nutzung wären unter anderem Backend, Zugriffsschutz, Datenschutzinformationen, sichere Speicherung, Löschkonzept und Prüfung der rechtlichen Anforderungen nötig.

## Tests vor der Präsentation

- [ ] DE/EN-Schalter ändert Texte und Produktangaben.
- [ ] Suche findet beispielsweise `TP-FL-100`, `Edelstahl` bzw. `stainless`.
- [ ] Filter zeigen die passenden Kategorien.
- [ ] Auswahl einer Karte aktualisiert die Detailansicht.
- [ ] 3D-Modell lässt sich drehen; Mausrad verändert den Zoom.
- [ ] Zeichnungsdialog öffnet und schließt.
- [ ] Mengenregler aktualisiert die Beispiel-Lieferzeit.
- [ ] Formular verhindert leere Pflichtfelder und ungültige E-Mail-Adressen.
- [ ] CSV-Datei wird heruntergeladen und lässt sich in Excel öffnen.
- [ ] Layout auf einem Smartphone prüfen.
- [ ] In der Präsentation klar sagen, dass es sich um Demo-Daten handelt.

## Mögliche nächste Schritte

1. Eigene CAD-Geometrie in FreeCAD/Fusion erstellen und für den Browser nach GLB exportieren.
2. Produktdaten aus einer JSON-Datei laden, statt sie direkt in `app.js` zu definieren.
3. Unit-Tests für Such-, Validierungs- und Lieferzeitfunktionen ergänzen.
4. Backend und Datenbank für echte Anfragen entwerfen.
5. Barrierefreiheit und automatisierte Tests erweitern.

## Präsentationsvorschlag auf Deutsch

> „Ich habe TechParts 3D entwickelt, um meine Kenntnisse aus dem Maschinenbau mit meinem Interesse an der Softwareentwicklung zu verbinden. Die Anwendung zeigt technische Bauteile mit strukturierten Spezifikationen, einer interaktiven 3D-Ansicht und einer schematischen Zeichnung. Außerdem habe ich eine zweisprachige Oberfläche, Such- und Filterfunktionen, eine einfache Lieferzeitlogik und einen CSV-Export implementiert. Mir war wichtig, nicht nur das Design, sondern auch die Datenstruktur, Eingabevalidierung und die Grenzen einer statischen Webanwendung zu berücksichtigen. Als nächste Schritte würde ich die Produktdaten in eine Datenbank auslagern und ein sicheres Backend ergänzen.“

