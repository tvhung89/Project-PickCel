const config = {
  // baseUrl: 'http://192.168.0.105:3000',
  // mediaUrl: 'http://192.168.0.105:1708',
  baseUrl: 'http://localhost:3000',
  mediaUrl: 'http://localhost:1708',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  database: {
    // host: process.env.DB_HOST || process.env.DB_STAGING_HOST || '123.30.185.223',
    // user: process.env.DB_USER || process.env.DB_STAGING_USER || 'remote',
    // password: process.env.DB_PASSWORD || process.env.DB_STAGING_PASSWORD || '123aA@123',
    host: process.env.DB_HOST || process.env.DB_STAGING_HOST || 'localhost',
    user: process.env.DB_USER || process.env.DB_STAGING_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_STAGING_PASSWORD || '',
    database: process.env.DB_NAME || process.env.DB_STAGING_NAME || 'pickcel',
    port: 5432, 
    ssl: false
  },
  databaseAdmin: {
    // host: process.env.DB_HOST || process.env.DB_STAGING_HOST || '123.30.185.223',
    // user: process.env.DB_USER || process.env.DB_STAGING_USER || 'remote',
    // password: process.env.DB_PASSWORD || process.env.DB_STAGING_PASSWORD || '123aA@123',
    host: process.env.DB_HOST || process.env.DB_STAGING_HOST || '123.30.185.222',
    user: process.env.DB_USER || process.env.DB_STAGING_USER || 'remote',
    password: process.env.DB_PASSWORD || process.env.DB_STAGING_PASSWORD || 'Lcd@456',
    database: process.env.DB_NAME || process.env.DB_STAGING_NAME || 'qltb_pickcel',
    port: 3306,
    ssl: false
  },
  kafka: {
    host: process.env.KAFKA_HOST || process.env.KAFKA_STAGING_HOST || '10.1.22.94',
    port: process.env.KAFKA_PORT || process.env.KAFKA_STAGING_PORT || 9092
  },
  mongodb: {
    host: process.env.MONGO_HOST || process.env.MONGO_STAGING_HOST || '123.30.185.222',
    port: process.env.MONGO_PORT || process.env.MONGO_STAGING_PORT || 27017,
    user: process.env.MONGO_USER || process.env.MONGO_STAGING_USER || 'remote2',
    password: process.env.MONGO_PASSWORD || process.env.MONGO_STAGING_PASSWORD || 'sidata2017',
    database: process.env.MONGO_NAME || process.env.MONGO_STAGING_NAME || 'pickcel_log',
    document: process.env.MONGO_DOCUMENT || process.env.MONGO_STAGING_DOCUMENT || 'pickcel_log',
  },
  rabbimq: {
    user: process.env.RABBITMQ_USERNAME || process.env.RABBITMQ_STAGING_USERNAME || 'admin',
    password: process.env.RABBITMQ_PASSWORD || process.env.RABBITMQ_STAGING_PASSWORD || 'vNpt%231234',
    host: process.env.RABBITMQ_HOSTNAME_NODE_1 || process.env.RABBITMQ_STAGING_HOSTNAME_NODE_1 || '123.30.185.223',
    port: process.env.RABBITMQ_POST || process.env.RABBITMQ_STAGING_POST || 5672,
    exchange: 'direct_displays',
    command: {
      active_player: 'active_player',
      set_default: 'set_default'
    }
  },
  mail: {
    host: process.env.MAIL_HOST || process.env.MAIL_STAGING_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || process.env.MAIL_STAGING_PORT || 587,
    user: process.env.MAIL_USER || process.env.MAIL_STAGING_USER || 'signagepickcel@gmail.com',
    password: process.env.MAIL_PASSWORD || process.env.MAIL_STAGING_PASSWORD || 'wjkfilcsjhvdjeck'
  },
  oauth: {
    client_id: '548390410724-1mfds7tldjn9eju6jmujtncj2kh30oti.apps.googleusercontent.com', // http://localhost:3000 cấu hình trên google
    // client_id: '984706706429-m0p9jg6s0tuh4fnp8rd00tu9gmntmkce.apps.googleusercontent.com' // https://hawebz.com
  },
  timezone: 'Asia/Ho_Chi_Minh',
  secret: 'JokeFromProDevPickcel',
  reset_password_secret: 'JokeFromProDevPickcelResetPassword',
  // token_expiry: '30m',
  token_expiry: '10h',
  reset_password_token_expiry: '1h',
  googleUserPassword: 'vrev*&(#!@&$(%)$@sdfdsfs',
  access_token_key: 'nekoTssecca',
  x_site_token_key: 'yeKsseccAx',
  fe_date_format: 'DD MMM, YYYY, hh:mm A',
  naming_date_format: 'DD MMM-YY HH:mm:ss',
  page_size: 5,
  api_address: '/pickcel/v1/api',
  template_temp_name: 'enosihtrofemanetalpmeton',
  default_composition_id: '00000000-0000-0000-0000-000000000000'
}

export default config