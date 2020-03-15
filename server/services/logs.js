import config from '../../config/config'
import utils from '../utils'
import dbw from '../db/operations'
var MongoClient = require('mongodb').MongoClient;
var url = `mongodb://${config.mongodb.host}:${config.mongodb.port}`;
const getLogs =  (condition)=>{
    try{
     return new Promise((resolve, reject) => {     
      if(utils.check_properties_validity(condition)){
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(`${config.mongodb.database}`);
        dbo.collection(`${config.mongodb.document}`).find(condition).toArray(function(err, result) {
          if (err) throw err;
          db.close();
          resolve({
            success: true,
            logs: result
          })
        });
      });
    }else{
      reject({
        success: false,
        logs: [],
        error: 'Params not found'
      })
    }
   })
 
    }catch(e){
        new Promise((resolve, reject) => {
            reject({
                success: false,
                logs: [],
                error: 'Log not found'
              })
           })
    }
}
export default  {
   getLogs
}


