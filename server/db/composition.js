const getCompositionInfo = (condition = null) => {
    let query = `SELECT c.id, c.name, c.created_at, c.version, c.duration, c.modified_at, c.template_id, c.user_id,
                    t.name as template_name, t.orientation, t.width as template_width, t.height as template_height, t.user_id as template_user_id,
                    za.asset_id, za.zone_id, za.z_index, a.name as asset_name, a.content, a.type, z.name as zone_name, z.top, z.left, z.width as zone_width, z.height as zone_height, z.z_index as zone_z_index,
                    za.duration as za_duration, a.size, a.dimension, a.duration as a_duration
                FROM compositions as c JOIN templates as t ON c.template_id = t.id
                JOIN zone_assets as za ON za.composition_id = c.id
                JOIN assets as a ON a.id = za.asset_id JOIN zones as z ON z.id = za.zone_id`;

    if (condition.id) query += ` WHERE c.id = '${condition.id}'`;
    if (condition.user_id) query += ` WHERE c.user_id = '${condition.user_id}'`;

    return query
};

/*
const getCompositionInfo = (condition = null) => {
    let query = `SELECT c.id, c.name, c.created_at, c.version, c.duration, c.modified_at, c.template_id, c.user_id,
                    t.name as template_name, t.orientation, t.width as template_width, t.height as template_height, t.user_id as template_user_id,
                    z.id as zone_id, z.name as zone_name, z.top, z.left, z.width as zone_width, z.height as zone_height, z.z_index
                FROM compositions as c JOIN templates as t ON c.template_id = t.id
                JOIN zones as z ON z.template_id = t.id`

    if (condition.id) query += ` WHERE c.id = '${condition.id}';`
    if (condition.user_id) query += ` WHERE c.user_id = '${condition.user_id}';`

    return query
}
*/

export default {
    getCompositionInfo
}