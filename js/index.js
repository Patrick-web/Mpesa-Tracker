/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    messages:[],
    result:null,
    removeSpaces:true,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady);
    },
    onDeviceReady: function() {
        app.msgs()
    },
    msgs: function(){
        smsreader.filterSenders(['MPESA'])
            .then((msgs)=>{
                msgs.forEach(msg=>{
                    const dt = app.dateTime(msg)
                  if(dt){

                    const message = {
                        amount:'N/A',
                        src:null,
                        text:msg.body,
                        type:null,
                        date:dt.date,
                        time:dt.time,
                        dateTime:dt.dateTime,
                        dayOfYear:dt.dayOfYear
                    }
                    const payReg = /paid\s*to\s*(\w*)\s*(\w*)(.*) on/;
                    const pay$Reg = /Ksh(.*)\.\d{2}\s*paid/;
                    const sentReg =  /sent\s*to\s*(\w*)\s*(\w*)(.*) on/;
                    const sent$Reg = /Ksh(.*)\.\d{2}\s*sent/;
                    const recReg =  /(from)\s*(\w*)\s*(\w*)/;
                    const rec$Reg =  /(received\s*Ksh)(.*)\sfrom/;
                    const buyReg = /bought\s*Ksh.*airtime/;
                    const transfsReg =  /transferred\s*(to|from)\s*M-shwari/i
                    const transf$Reg =  /Ksh(.*)\.\d{2}\s*transferred/i
                    const withdrwReg = /-\s(.*)New/;
                    const withdrw$Reg = /Ksh(.*)\.\d{2}\s*from/i;
                    if(payReg.test(msg.body)){
                        message.type = 'Paid';
                        // console.log(msg.body);
                        message.amount = app.shortener(msg.body.match(pay$Reg))
                        app.removeSpaces = false;
                        message.src = app.shortener(msg.body.match(payReg));
                        app.removeSpaces = true;
                        
                    }else if(sentReg.test(msg.body)){
                        message.type = 'Sent'
                        // console.log(msg.body);
                        message.amount = app.shortener(msg.body.match(sent$Reg));
                        app.removeSpaces = false;
                        message.src = app.shortener(msg.body.match(sentReg))
                        app.removeSpaces = true;
                        
                    }
                    else if(rec$Reg.test(msg.body)){
                        // console.log(msg.body);
                        message.amount = app.shortener(msg.body.match(rec$Reg));
                        app.removeSpaces = false;
                        message.src = app.shortener(msg.body.match(recReg));
                        message.type = 'Received'
                        app.removeSpaces = true;
                    }
                    else if(buyReg.test(msg.body)){
                        // console.log(msg.body);
                        message.amount = app.shortener(msg.body.match(buyReg));
                        message.src = 'airtime'
                        message.type = 'Bought'
                    }else if(transfsReg.test(msg.body)){
                        // console.log(msg.body);
                        message.amount = app.shortener(msg.body.match(transf$Reg))
                        message.type = 'Transferred'
                        message.src = 'Mshwari'
                    }else if(withdrwReg.test(msg.body)){
                        message.amount = app.shortener(msg.body.match(withdrw$Reg))
                        message.type = 'Withdraw',
                        app.removeSpaces = false;
                        message.src = app.shortener(msg.body.match(withdrwReg))
                        app.removeSpaces = true;
                    }

                    if(message.type && message.src){
                        app.messages.push(message)
                    }
                  }
                })


                // console.log("Now today's Messages");
                // console.log(app.todayMsgs());
                console.log("Now yesterday's Messages");
                console.log(app.yesterdayMsgs());
                // console.log("Now This week's Messages");
                // console.log(app.thisWeekMsgs());
                // console.log("Now Last week's Messages");
                // console.log(app.lastWeekMsgs());
                // console.log("Now This month's Messages");
                // console.log(app.thisMonthMsgs());
                console.log("Now Last month's Messages");
                console.log(app.lastMonthMsgs());
                // app.lastMonthMsgs()
                // console.log(app.messages[2]);
                
            }),
            (err)=>{
                console.log("Error in getting messages");
            }
            
            
    },
    todayMsgs:function(){
        let todaySms = [];
        const today = moment();
        app.messages.forEach(msg=>{
            if(msg.dayOfYear === today.get('dayOfYear')){
                todaySms.push(msg)
            }
        })
        return todaySms
    },
    yesterdayMsgs:function(){
        const today = moment();
        let yesterMsgs = [];
        const yesterday = today.startOf('day').subtract(24,'hours');
        app.messages.forEach(msg=>{
            if(msg.dayOfYear === yesterday.get('dayOfYear')){
                yesterMsgs.push(msg)
            }
        })
        return yesterMsgs;
    },
    thisWeekMsgs:function(){
        const today = moment();
        const weeksMsgs = []
        const startOfWeek = today.startOf('week').get('dayOfYear');
        const endOfWeek = today.endOf('week').get('dayOfYear')
        app.messages.forEach(msg=>{
            if(msg.dayOfYear>startOfWeek || msg.dayOfYear == startOfWeek ){
                if(msg.dayOfYear<endOfWeek || msg.dayOfYear == endOfWeek ){
                    weeksMsgs.push(msg);
                }
            }
     
        })
        return weeksMsgs;
    },
    lastWeekMsgs:function(){
        const today = moment();
        const lastWeeksMsgs = []
        const startOfWeek = today.startOf('week');
        const lastDayOfPrevWeek = startOfWeek.subtract(24,'hours');
        const endOfPrevWeek = lastDayOfPrevWeek.get('dayOfYear');
        let startOfPrevWeek = lastDayOfPrevWeek.startOf('week')
        startOfPrevWeek = startOfWeek.get('dayOfYear');
        app.messages.forEach(msg=>{
            if(msg.dayOfYear>startOfPrevWeek || msg.dayOfYear == startOfPrevWeek ){
                if(msg.dayOfYear<endOfPrevWeek || msg.dayOfYear == endOfPrevWeek ){
                    lastWeeksMsgs.push(msg);
                }
            }
     
        })
        return lastWeeksMsgs;
    },
    thisMonthMsgs:function(){
        const today = moment();
        let thisMonthsMsgs = [];
        const dayOfYearToday = today.get('dayOfYear');
        const startOfMonth = today.startOf('month').get('dayOfYear');
        app.messages.forEach(msg=>{
            if(msg.dayOfYear>startOfMonth || msg.dayOfYear == startOfMonth ){
                if(msg.dayOfYear<dayOfYearToday || msg.dayOfYear == dayOfYearToday ){
                    thisMonthsMsgs.push(msg);
                }
            }
     
        })
        return thisMonthsMsgs;
    },
    lastMonthMsgs:function(){
        const today = moment();
        let lastMonthsMsgs = []
        const startOfMonth = today.startOf('month');
        const endOfLastMonth = startOfMonth.subtract(24,'hours');
        const endOfLastMonthDay = endOfLastMonth.get('dayOfYear')
        const startOfLastMonth = endOfLastMonth.startOf('month');
        const startOfLastMonthDay = startOfLastMonth.startOf('month').get('dayOfYear');
    
        app.messages.forEach(msg=>{
            if(msg.dayOfYear>startOfLastMonthDay || msg.dayOfYear == startOfLastMonthDay ){
                if(msg.dayOfYear<endOfLastMonthDay || msg.dayOfYear == endOfLastMonthDay ){
                    lastMonthsMsgs.push(msg);
                }
            }
     
        })
        return lastMonthsMsgs;
    },
    dateTime:function(msg){
        const dateReg =  /\d\d?\/\d\d?\/\d{2}/;
        let date = msg.body.match(dateReg);
        const timeReg =  /\d\d?:\d{2} (PM|AM)/;
        let time = msg.body.match(timeReg);
        if(time){
        time = time[0].replace(/ +/g,"");
        // console.log(msg);
        const dateTime = moment(`${date} ${time}`, "DD/MM/YY h:mmA");

        const dt = {
            date:date,
            time:time,
            dateTime:dateTime,
            dayOfYear:dateTime.get('dayOfYear')
        }
            return dt;
        }else{
            return false;
        }
    },
    shortener(string){
        let replacers = [/ /g,/Ksh/g,/\.00/g,/paid/g,/transferred/g,/bought/g,/to /g,/of/g,/ on/g,/airtime/g,/from/g,/for/g,/07.*/,/received/g,/sent/g,/-/,/New/,/M-shwari/gi]
        let replacers2 = [/Ksh/g,/\.00/g,/paid/g,/transferred/g,/bought/g,/to /g,/of/g,/ on/g,/airtime/g,/from/g,/for/g,/07.*/,/received/g,/sent/g,/-/,/New/,/M-shwari/gi]
        let result = string[0];
        if(app.removeSpaces){
            replacers.forEach((replacer)=>{
                result = result.replace(replacer,'')
            })
        }else{
            replacers2.forEach((replacer)=>{
                result = result.replace(replacer,'')
            })
        }        
        // console.log(result);
        return result
    },
    removeNumber(string){
        string = string.replace(/07.*/,'')
        return string
    }


};

app.initialize();