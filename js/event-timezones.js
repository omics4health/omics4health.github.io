/* Convert the scheduled instant with IANA zones, including date-specific DST. */
(function () {
  document.querySelectorAll('.event-timezones').forEach(function (schedule) {
    var start = new Date(schedule.dataset.eventStart);
    var end = new Date(schedule.dataset.eventEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;
    schedule.querySelectorAll('[data-time-zone]').forEach(function (row) {
      try {
        var zone = row.dataset.timeZone;
        var date = new Intl.DateTimeFormat('en-GB', {
          timeZone: zone, day: 'numeric', month: 'short', year: 'numeric'
        });
        var clock = new Intl.DateTimeFormat('en-GB', {
          timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
        });
        var zoneFormat = new Intl.DateTimeFormat('en-US', {
          timeZone: zone, timeZoneName: 'short'
        });
        function abbreviation(instant) {
          return zoneFormat.formatToParts(instant).find(function (p) {
            return p.type === 'timeZoneName';
          }).value;
        }
        var startDate = date.format(start);
        var endDate = date.format(end);
        var startZone = abbreviation(start);
        var endZone = abbreviation(end);
        // Resolve European abbreviations consistently across browser locales.
        if (zone === 'Europe/Berlin') {
          startZone = startZone.replace('GMT+1', 'CET').replace('GMT+2', 'CEST');
          endZone = endZone.replace('GMT+1', 'CET').replace('GMT+2', 'CEST');
        }
        row.textContent = startDate + ' · ' + clock.format(start) +
          (startZone !== endZone ? ' ' + startZone : '') + '–' +
          (startDate !== endDate ? endDate + ' · ' : '') +
          clock.format(end) + ' (' + endZone + ')';
      } catch (error) {
        // Keep the verified static schedule when Intl or a zone is unavailable.
      }
    });
  });
}());
