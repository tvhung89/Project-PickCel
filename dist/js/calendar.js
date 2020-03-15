document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar')
  if (calendarEl) {
    var calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: ['interaction', 'dayGrid', 'timeGrid'],
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      defaultDate: new Date(),
      navLinks: true,
      selectable: true,
      selectMirror: true,
      slotDuration: '00:15:00',
      select: function (arg) {
        var start = moment(arg.start)
        var end = moment(arg.end)
  
        if (start.diff(moment(), 'h') >= 0) {
          $("#add-schedule-link").trigger('click');
                
          // if (end.diff(start, 'h') > 24) {
          //   alert("Have to select within a single day!");
          // } else {
          //   var title = prompt('Event Title:')
          //   if (title) {
          //     calendar.addEvent({
          //       title: title,
          //       start: arg.start,
          //       end: arg.end,
          //       allDay: arg.allDay
          //     })
          //   }
          // }
        } else {
          alert('Have to select schedule time later than ' + moment().format('HH:mm'))
        }
        calendar.unselect()
        console.log(calendar.getEvents())
      },
      editable: true,
      eventLimit: true,
      selectOverlap: false,
      eventOverlap: false,
      events: [
        {
          title  : 'Schedule 1',
          start  : '2019-08-25T12:30:00',
          end  : '2019-08-25T15:30:00',
          allDay : false
        }
      ],
      defaultView: 'timeGridDay',
      allDaySlot: false,
      eventDrop: function(info) {
        alert(info.event.title + " was dropped on " + info.event.start.toISOString());
    
        if (!confirm("Are you sure about this change?")) {
          info.revert();
        }
      },
      eventResize: function(info) {
        alert(info.event.title + " end is now " + info.event.end.toISOString());
    
        if (!confirm("is this okay?")) {
          info.revert();
        }
      }
    })
  
    calendar.render()
  }
})
