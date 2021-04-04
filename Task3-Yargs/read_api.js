const yargs = require('yargs')
const request = require('request')

const url = 'https://jsonplaceholder.typicode.com/'

const resources = ['posts','comments','albums','photos','todos','users']

getApi = (url, cb)=>{
    request({ url , json:true}, (err, {body})=>{
        if(err) cb(err, false)
        else cb(false, body)
    })
}

yargs.command({
    command: 'read',
    describe: 'get api',
    builder:{
        sub:{demandOptions:true},
    },
    handler:function(avgr){
        if(resources.findIndex(r=>r==avgr.sub)!=-1){
            let newUrl = url + avgr.sub + "?_limit=2"
            getApi(newUrl, (err, data)=>{
                if(err) console.log(err)
                else console.log(data)
            })
        }else{
            console.log("Page not found")
        }
    }
})

yargs.argv
