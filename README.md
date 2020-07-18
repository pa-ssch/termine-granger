# Termine Granger
Aufgabenplanung und -verwaltung

Prototyp für den Kurs Softwareengineering I (3. + 4. Semester) an der DHBW Karlsruhe

## Release
[Aktuellste freigegebene Version unter termine-granger.web.app](https://termine-granger.web.app)


## Installation
* Die App ist mit allen Browsern, die PWAs unterstützen aufrufbar
  * Unterstützt der Browser disese Technologien nicht, ist der Funktionsumfang eingeschränkt
  * In jedem Fall ist das installieren der App empfohlen (Meldung kommt automatisch vom Browser)
* Für die Erinnerungen-Funktion muss die neuste Version von Google Chrome verwendet werden
  * Des Weiteren müssen hierfür die "Experimental Web Platform features" über "chrome://flags" aktiviert werden
  * Ob die Konfiguration erfolgreich war, lässt sich mit der offiziellen [demo](https://notification-triggers.glitch.me/) von [Web.dev](https://web.dev/notification-triggers/) überprüfen


## Demodaten
Um schnell mehrere Aufgaben zu erstellen:
* Eine neue Aufgabe erstellen (Titel erforderlich) und Speichern
* Die "Aufteilen"-Funktion nutzen
  1. Aufgabe bearbeiten (Listeneintrag nach links schieben und auf bearbeiten-Schaltfläche klicken)
  2. Nach unten scrollen und "Aufteilen" auswählen
  3. Als Untergrenze die gewünschte Anzahl an aufgaben festlegen
  4. Obergrenze >= Untergrenze wählen
* Unteraufgaben sind erstellt
* Damit ist es nicht möglich Aufgaben auf oberster Ebene zu erstellen
  * Einzelne Unteraufgaben können durch das ändern der Gruppe auf "n.a." auf die oberste Ebene verschoben werden

Löschen aller Daten:
* In den DevTools (bei Chrome F12) kann die IndexedDB Datrenbank (TG_DB) gelöscht werden
  * Für diesen Schritt muss man sich auf einer Seite der Domain termine-granger.web.app befinden
* Die Datenbank wird nach einer Aktualisierung der Seite neu erstellt


## Sourcecode
Der relevante Sourcecode befindet sich unter [src/app](src/app/)


## Jasmine-Test
Ein Exemplarischer Test für die Funktion `addOrChange` ([taskList](src/app/data/taskList.ts)) ist in der Datei [data.service.spec.ts](src/app/data/data.service.spec.ts)
