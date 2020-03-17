import mongoose from 'mongoose';
import config from '../../config/config'
mongoose.connect(`mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`, { useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")
// Setup schema
var logActions = mongoose.Schema({
   actionDetail: String,
   actionName: Number,
   actionStatus: Number,
   assetId: String,
   assetName: String,
   compositionId: String,
   compositionName: String,
   createdDate: Number,
   playerId: String,
   scheduleId: String,
   scheduleName: String
},{ collection: 'pickcel_log'});
// Export Logs model
var Logs = mongoose.model('pickcel_log', logActions);
export default {
    Logs
}