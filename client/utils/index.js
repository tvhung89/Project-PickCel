import moment from 'moment'
import config from '../../config/config'
import * as types from '../actions/actionTypes'

const get_cookie = name => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length == 2) return decodeURIComponent(parts.pop().split(";").shift());
}

const create_cookie = (name, value, days) => {
    if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

const remove_cookie = name => {
    create_cookie(name,"",-1);
}

const get_user_id = () => {
    let userLoggedIn = localStorage.getItem(types.USER_LOGGED_IN)
    const isCookieExist = get_cookie(config.access_token_key) && get_cookie(config.x_site_token_key)

    if (!isCookieExist && window.location.pathname.indexOf('dashboard') > -1) window.location = '/'

    if (userLoggedIn) {
        userLoggedIn = JSON.parse(userLoggedIn)
        
        return userLoggedIn.id
    }
    return null
}

const format_date = (date = null, isNaming = false) => {
    const formatDate = date ? date : moment()
    return moment(formatDate).format(isNaming ? config.naming_date_format : config.fe_date_format)
}

const compare_date = (first, second) => {
    return moment(first).diff(moment(second), 'seconds')
}

const is_available = (data) => {
    return data ? data : 'Not Available'
}

const get_asset_type = (type) => {
    switch(type) {
        case 0:
            return 'Image'
        case 1:
            return 'Video'
        case 2:
            return 'App'
        default:
            return null
    }
}

const format_memory_unit = (bytes, decimals) => {
    if(bytes == 0) return '0 Bytes';
    var k = 1024,
       dm = decimals <= 0 ? 0 : decimals || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const format_duration = (seconds, isColon = true) => {
    var sec_num = parseInt(seconds, 10); 
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (isColon) {
        if (hours   < 10) {
            hours = '0' + hours
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        if (seconds < 10) {
            seconds = '0' + seconds
        }
    }

    return `${hours ? `${hours}${isColon ? ':' : ' hr'}${(minutes || seconds) && !isColon ? ', ' : ''}` : (isColon ? `${hours}:` : '')}${minutes ? `${minutes}${isColon ? ':' : ' min'}${seconds && !isColon ? ', ' : ''}` : (isColon ? `${minutes}:` : '')}${seconds ? `${seconds}${isColon ? '' : ' sec'}` : ''}`
}

const get_media_extension = path => {
    let extension = path.split('/')
    extension = extension[extension.length - 1]
  
    return extension.split('.')[1]
  }

const sort_by_key = (arr, key) => {
    return arr.sort((a, b) => a[key] - b[key])
}

const format_date_custom = (date, format) => {
    return moment(date).format(format)
}

const get_date_time = (date, newHour) => {
    const datetime = moment(date)
    const dateOnly = datetime.format('YYYY-MM-DD')
    const timeOnly = `${newHour}:00`

    return new Date(`${dateOnly}T${timeOnly}`)
}

const get_date_diff = (first, second) => {
    return moment(first).set({hour:0,minute:0,second:0,millisecond:0}).diff(moment(second).set({hour:0,minute:0,second:0,millisecond:0}), 'd')
}

const add_date = (date, dayToAdd) => {
    return moment(date).add(dayToAdd, 'd')
}

const get_random_color = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const get_day_of_week = (date) => {
    return moment(date).day()
}

const format_db_date = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

const date_is_in_range = (date, start, end) => {
    return moment().range(start, end).contains(date)
}

const get_min_max_date = (schedule) => {
    const comps = schedule.compositions

    if (comps.length == 1) {
        return {
            min: format_date(comps[0].start_date),
            max: format_date(comps[0].end_date)
        }
    } else {
        const mins = comps.map(c => moment(c.start_date))
        const maxs = comps.map(c => moment(c.end_date))

        return {
            min: format_date(moment.min(mins)),
            max: format_date(moment.max(maxs))
        }
    }
}

const is_schedule_playing = (schedule) => {
    if (schedule && schedule.compositions) {
        const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const compositions = schedule.compositions
        const format = 'hh:mm:ss'
        const time = moment(new Date(), format)
        const todayWeekDay = weekdays[time.day()]
        const isPlayingComposition = compositions.filter(c => {
            const beforeTime = moment(c.start_date, format)
            const afterTime = moment(c.end_date, format)
            const days = afterTime.diff(beforeTime, 'd')
            let isBetween = false

            for(let i = 0; i <= days; i++) {
                let tempB = moment(c.start_date).add(i, 'd')
                let tempAUsed = moment(c.end_date).add(i, 'd')
                let tempA = moment(tempB).hours(tempAUsed.hours()).minutes(tempAUsed.minutes()).seconds(tempAUsed.seconds())
                isBetween = time.isBetween(tempB, tempA)
                if (isBetween) break;
            }
    
            return c.is_repeat ? (isBetween && c[todayWeekDay]) : isBetween
        })
    
        return isPlayingComposition
    }
    return false
}

const distince_items = (arr, field) => {
    return arr.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t[field] === thing[field]
        ))
    ).map(c => {
        return {
            label: c[field],
            selected: false
        }
    })
}

export default {
    get_cookie,
    remove_cookie,
    get_user_id,
    format_date,
    is_available,
    get_asset_type,
    format_memory_unit,
    format_duration,
    get_media_extension,
    compare_date,
    sort_by_key,
    format_date_custom,
    get_date_time,
    get_date_diff,
    add_date,
    get_random_color,
    get_day_of_week,
    format_db_date,
    date_is_in_range,
    get_min_max_date,
    is_schedule_playing,
    distince_items
}