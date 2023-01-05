const express = require('express')
const bodyParser = require('body-parser')
const { default: axios } = require('axios');
require('dotenv').config()

const accountSid = process.env.account_sid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);






const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/optionData',async(req,res)=>{
    const ceData = 43900
    const peData = 42000
    const expiry = '12-Jan-2023'
    const response = await axios({
        method : 'get',
        url : 'https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY'
    })
    const reqData = response.data.records.data
    ceFilterData = reqData.filter((eachData)=>{
        return eachData.strikePrice == ceData && eachData.expiryDate == expiry
    })
    peFilterData = reqData.filter((eachData)=>{
        return eachData.strikePrice == peData && eachData.expiryDate == expiry
    })

    const ceObj = ceFilterData[0]
    const peObj = peFilterData[0]
    
    const cePrice = ceObj.CE.lastPrice
    const pePrice = peObj.PE.lastPrice

   if(cePrice>pePrice){
    if((cePrice/pePrice)>= 1.85) {
        const mess = {
            message : 'do adjustment',
            value : cePrice/pePrice,
            cePrice : cePrice,
            pePrice : pePrice
        }
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: `${JSON.stringify(mess)}`,
                to: 'whatsapp:+919542646282'
            })
            .then(message => console.log(message.sid));
        res.json(mess)
    }else{
        const mess = {
            message : 'not needed to do adjustment',
            value : cePrice/pePrice,
            cePrice : cePrice,
            pePrice : pePrice
        }
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: `${JSON.stringify(mess)}`,
                to: 'whatsapp:+919542646282'
            })
            .then(message => console.log(message.sid));

        res.json(mess)
    }
   }

   if(pePrice>cePrice){
    if((pePrice/cePrice)>= 1.85) {
        const mess = {
            message : 'do adjustment',
            value : pePrice/cePrice,
            cePrice : cePrice,
            pePrice : pePrice
        }
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: `${JSON.stringify(mess)}`,
                to: 'whatsapp:+919542646282'
            })
            .then(message => console.log(message.sid));
        res.json(mess)
    }else{
        const mess = {
            message : 'not needed to do adjustment',
            value : pePrice/cePrice,
            cePrice : cePrice,
            pePrice : pePrice
        }
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: `${JSON.stringify(mess)}`,
                to: 'whatsapp:+919542646282'
            })
            .then(message => console.log(message.sid));
        res.json(mess)
    }
   }
    
})

app.listen(3000,()=>{
    console.log('server started')
})