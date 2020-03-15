$(document).ready(() => {
    if ($.fn.datepicker && $('.date-picker')) $('.date-picker').datepicker({
        autoclose: true,
        startDate: new Date(),
        maxViewMode: 0,
        container: '#add-schedule-modal'
    })
    .datepicker("setDate", new Date())
    .on('changeDate', e => {
        console.log(e)
    });
})