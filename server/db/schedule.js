const getScheduleInfo = (condition = null) => {
    let query = `SELECT s.id, s.name, s.version, s.created_at, sc.composition_id, c.name as composition_name, c.duration, c.template_id, sc.start_date, sc.end_date, sc.prior_level, sc.order_level, sc.is_repeat, sc.monday, sc.tuesday, sc.wednesday, sc.thursday, sc.friday, sc.saturday, sc.sunday, s.user_id, di.id as display_id, di.name as display_name, di.network_status
                FROM schedules as s JOIN schedule_compositions as sc ON s.id = sc.schedule_id
                JOIN compositions as c ON c.id = sc.composition_id
                LEFT OUTER JOIN display_schedules as ds ON s.id = ds.schedule_id
                LEFT OUTER JOIN displays as di ON ds.display_id = di.id`

    if (condition.id) query += ` WHERE s.id = '${condition.id}'`
    if (condition.user_id) query += ` WHERE s.user_id = '${condition.user_id}'`

    return query
}

export default {
    getScheduleInfo
}