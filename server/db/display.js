const getDisplayInfo = (condition) => {
    let query = `SELECT d.id, d.name, d.online_at, d.network_status, d.address, d.location, d.default_composition_id, d.network_speed, d.private_ip, d.public_ip, d.mac_address_wifi, d.mac_address_ethernet, d.is_active, d.apk_version_name, d.apk_version_code, d.javascript_version, d.sdk_version, d.storage, d.available_ram, d.brand, d.device, d.manufacturer, d.hardware, d.model, d.total_storage, d.total_ram, d.orientation, d.code, d.user_id, s.id as schedule_id, s.name as schedule_name, s.version as schedule_version, sc.composition_id as schedule_composition_id, c.name as composition_name, t.width, t.height, t.orientation as composition_orientation, sc.start_date, sc.end_date, sc.is_repeat, sc.monday, sc.tuesday, sc.wednesday, sc.thursday, sc.friday, sc.saturday, sc.sunday
                    FROM displays as d LEFT OUTER JOIN display_schedules as ds ON d.id = ds.display_id
                        LEFT OUTER JOIN schedules as s ON ds.schedule_id = s.id
                        LEFT OUTER JOIN schedule_compositions as sc ON s.id = sc.schedule_id
                        LEFT OUTER JOIN compositions as c ON c.id = sc.composition_id
                        LEFT OUTER JOIN templates as t ON t.id = c.template_id`
    if (condition.id) query += ` WHERE d.id = '${condition.id}'`
    if (condition.user_id) query += ` WHERE d.user_id = '${condition.user_id}'`

    return query
}

const getDisplay = (condition) => {
    let query = `SELECT id, code, is_active, queue_name FROM displays WHERE `
    if (condition.mac_address_wifi) query += `mac_address_wifi = '${condition.mac_address_wifi}' OR `
    if (condition.mac_address_ethernet) query += `mac_address_ethernet = '${condition.mac_address_ethernet}' OR `
    if (condition.code) query += `code = '${condition.code}' OR `

    query = query.substr(0, query.length - 4)
    return query
}

export default {
    getDisplayInfo,
    getDisplay
}