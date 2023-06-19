exports.datetimeToMysql = ()=>{

    return new Promise ((resolve, reject)=>{
        const date = new Date().toISOString().slice(0, 10);
        const time = new Date().toISOString().slice(11,19);
        resolve(String(date + " " + time));
    })
};