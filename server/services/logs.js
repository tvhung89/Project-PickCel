import utils from '../utils'
import mongo from '../db/mongo'

const getLogs =  (condition)=>{
    try{
      console.log(condition)
     return new Promise((resolve, reject) => {     
      if(utils.check_properties_validity(condition)){
       mongo.Logs.find(condition).sort({createdDate: -1}).exec((err, result)=>{
        if(err){
          reject({
            success: false,
            logs: [],
            error: 'Error connect database'
          })
        }
        resolve({
                success: true,
                logs: result
              })
      })
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


