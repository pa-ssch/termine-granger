# Termine Granger

The application was developed as part of a study program at a German university and is therefore only documented in German.

Aufgabenplanung und -verwaltung

#### Prototyp für den Kurs Softwareengineering I (3. + 4. Semester) an der DHBW Karlsruhe

## Release
[Aktuellste freigegebene Version unter termine-granger.web.app](https://termine-granger.web.app)


## Installation
* Die App ist mit allen Browsern, die PWAs unterstützen aufrufbar (siehe Release)
  * Unterstützt der Browser disese Technologien nicht, ist der Funktionsumfang eingeschränkt
  * In jedem Fall ist das installieren der App empfohlen (Meldung kommt automatisch vom Browser)
* Für die Erinnerungen-Funktion muss die neuste Version von Google Chrome verwendet werden
  * Des Weiteren müssen hierfür die "Experimental Web Platform features" über "chrome://flags" aktiviert werden
  * Ob die Konfiguration erfolgreich war, lässt sich mit der offiziellen [demo](https://notification-triggers.glitch.me/) von [Web.dev](https://web.dev/notification-triggers/) überprüfen
  * Es muss tatsächlich Google Chrome selbst sein. Nicht alle Chromium Browser sind kompatibel.
  
#### Empfehlung: Google Chrome unter Windows und verwendung der installierten Anwendung, nicht der Webseite.

## Anleitung
Die App ist intuitiv gestaltet, sodass (vorallem wenn die Anforderungen bekannt sind) eine Anleitung nicht nötig ist.
Falls jedoch trotzdem Fragen auftreten, kann das Dokument [Anleitung.pdf](Anleitung.pdf) herbeigezogen werden.

## Demodaten
#### Um schnell mehrere Aufgaben zu erstellen:
* Eine neue Aufgabe erstellen (Titel erforderlich) und Speichern
* Die "Aufteilen"-Funktion nutzen
  1. Aufgabe bearbeiten (Listeneintrag nach links schieben und auf bearbeiten-Schaltfläche klicken)
  2. Nach unten scrollen und "Aufteilen" auswählen
  3. Als Untergrenze die gewünschte Anzahl an aufgaben festlegen
  4. Obergrenze >= Untergrenze wählen
* Unteraufgaben sind erstellt
* So ist es leider nicht möglich, Aufgaben auf oberster Ebene zu erstellen
  * Einzelne Unteraufgaben können durch das ändern der Gruppe auf "n.a." auf die oberste Ebene verschoben werden

#### Löschen aller Daten:
* In den DevTools (bei Chrome F12) kann die IndexedDB Datenbank (TG_DB) gelöscht werden
  * Für diesen Schritt muss man sich auf einer Seite der Domain termine-granger.web.app befinden
* Die Datenbank wird nach einer Aktualisierung der Seite neu erstellt


## Sourcecode
Der relevante Sourcecode befindet sich unter [src/app](src/app/)

Zusätzlich ist unter [src/assets/js/notification.js](src/assets/js/notification.js) der Code für das Verwalten von Push-Benachrichtigungen

Bezüglich der Lesbarkeit ist es sinnvoll, den Sourcecode herunterzuladen und mit Visual Studio Code zu öffnen.
Es wird TypeDoc verwendet und oft wird die #region-Funtkion eingesetzt, um den Code zu strukturieren. 

#### Die Strukturierung des Quellcodes sollte einfach zu verstehen sein. Ansonsten hier nochmal eine kurze Zusammenfassung:
* `_components`: Steuerelemente, welche entweder von anderen Steuerelementen oder eine `page` verwendet werden
  * `datetime`: Komponente zur Auswahl von Datum + Uhrzeit. Ermöglicht auch das löschen der Eingabe über einen Button
  * `duration`: Komponente zur Auswahl einer Dauer + Einheit (z.B. 5 & Minuten, 2 & Stunden, ...)
  * `task-list`: Komponente zum Darstellen von Aufgaben. Ermöglicht manuelles aktualisieren durch wischen von oben
  * `task`: Komponente um eine Aufgabe oder Gruppe als Listeneintrag darzustellen. Ermöglicht das Bearbeiten/Öffnen
* `_pages`: Einzelne Ansichten der App
  * `input`: Eingabemaske für die Bearbeitung einer Aufgabe. 
  * `list`: Darstellung von Unteraufgaben (Page ist nicht für die Hauptaufgabenliste!)
* `data`:
  * Datenklassen (`Reminder` & `Task`)
  * Benötigte typen, welche nicht durch typescript verfügbar sind
  * Datenbankanbindung (`data.service.ts`) mit requests
    * Die Requests sind zwecks Übersichtlichkeit in eigenen Dateien, gehören jedoch zur Klasse `DataService`
* `events`: `Observables` für die interne Verarbeitung von Änderungen an Aufgaben / der Oberfläche
* `home`: Die Einstiegsseite (also auch eine `page`) der App.

  

## Jasmine-Test
Ein Exemplarischer Test für die Funktion `addOrChange` ([taskList](src/app/data/taskList.ts)) ist in der Datei [data.service.spec.ts](src/app/data/data.service.spec.ts)
