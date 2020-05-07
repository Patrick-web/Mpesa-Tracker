
var app = {
    messagesFetched:false,
    messages:[],
    usageMessages:[],
    todayMessagesArr:[],
    yesterdayMessagesArr:[],
    thisWeekMessagesArr:[],
    lastWeekMessagesArr:[],
    thisMonthMessagesArr:[],
    lastMonthMessagesArr:[],
    customDateMessagesArr:[],
    customMonthMessagesArr:[],
    totalAmount:0,
    uses:0,
    currentBalance:0,
    customDay:null,
    result:null,
    currentViewisTimeline:false,
    removeSpaces:true,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady);
    },
    clearPersistedMsgs(){
        window.localStorage.removeItem()
    },
    initAds:function(){
        var admobid = {
            banner: 'ca-app-pub-4364336677896612/8669650444', // or DFP format "/6253334/dfp_example_ad"
            interstitial: 'ca-app-pub-4364336677896612/3142470520'
        };
    //banner ca-app-pub-4364336677896612/8669650444
    //interstitial ca-app-pub-4364336677896612/3142470520
        if(document.body.classList.contains('timelineTime') == false){

            AdMob.createBanner({
                adId: admobid.banner,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                autoShow: true
            },()=>{console.log("Banner showing")},(err)=>console.log('Error in showing banner ' +err));
        }else{
            setTimeout(()=>{
                AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:true} );
            },60000)
        }
    },
    onDeviceReady: function() {

        app.initAds()
        app.msgs()
        app.addListeners();
        if(window.localStorage.getItem('firstCustomDate') == null){
            window.localStorage.setItem("firstCustomDate", "true");
        }

    },
    addListeners: function(){
        const today = document.querySelector('#today');
        today.addEventListener('click',app.showTodayMessages);

        const yesterday = document.querySelector('#yesterday');
        yesterday.addEventListener('click',app.showYesterdayMessages);

        const thisWeek = document.querySelector('#thisWeek');
        thisWeek.addEventListener('click',app.showThisWeekMessages);

        const lastWeek = document.querySelector('#lastWeek');
        lastWeek.addEventListener('click', app.showLastWeekMessages);

        const thisMonthMsgs = document.querySelector('#thisMonth');
        thisMonthMsgs.addEventListener('click',app.showThisMonthMessages);

        const lastMonthMsgs = document.querySelector('#lastMonth');
        lastMonthMsgs.addEventListener('click',app.showLastMonthMessages);

        const customDate = document.querySelector('#customDate');
        customDate.addEventListener('click',app.getCustomDay);
        
        const allMsgs = document.querySelector('#all');
        allMsgs.addEventListener('click',app.showAllMessages);

        const showMonthMsgs = document.querySelector('.showMonth');
        showMonthMsgs.addEventListener('click',()=>{
            app.getCustomMonth();
            app.hideMonthToggler();
            app.showDayToggler();
        })
        const showDayMsgs = document.querySelector('.showDays');
        showDayMsgs.addEventListener('click',()=>{
            document.querySelector('#selectedDate').textContent = app.specDay;
            app.showSpecificDayMessages(app.customDay);
            app.showMonthToggler();
            app.hideDayToggler();
        })
    },
    msgs: function(){
        smsreader.filterSenders(['MPESA'])
            .then((msgs)=>{
                // window.alert('access granted')
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
                        timestamp:msg.date,
                        dateTime:dt.dateTime,
                        dayOfYear:dt.dayOfYear,
                        balance:0
                    }
                    const payReg = /paid\s*to\s*(\w*)\s*(\w*)(.*) on/;
                    const pay$Reg = /Ksh(.*)\.\d{2}\s*paid/;
                    const sentReg =  /sent\s*to\s*(\w*)\s*(\w*)(.*) on/;
                    const sent$Reg = /Ksh(.*)\.\d{2}\s*sent/;
                    const recReg =  /(from)\s*(\w*)\s*(\w*)/;
                    const rec$Reg =  /(received\s*Ksh)(.*)\sfrom/;
                    const buyReg = /bought\s*Ksh.*airtime/;
                    const transfsReg =  /transferred\s*(to)\s*M-shwari/i;
                    const transfsRegFrom =  /transferred\s*(from)\s*M-shwari/i;
                    const transf$Reg =  /Ksh(.*)\.\d{2}\s*transferred/i;
                    const withdrwReg = /-\s(.*)New/;
                    const withdrw$Reg = /Ksh(.*)\.\d{2}\s*from/i;
                    const isGiveReg = /Give/;
                    const giveRec = /to.* New/;
                    const giveAmount = /(Give\s*Ksh)(.*)\scash/
                    if(payReg.test(msg.body)){
                        message.type = 'Paid';
                        message.amount = app.shortener(msg.body.match(pay$Reg));
                        if(message.amount){
                            app.removeSpaces = false;
                            message.balance = app.getBalance(msg.body);
                            message.src = app.shortener(msg.body.match(payReg));
                            app.removeSpaces = true;
                            app.usageMessages.push(message)
                        }

                    }else if(sentReg.test(msg.body)){
                        message.type = 'Sent'
                        message.amount = app.shortener(msg.body.match(sent$Reg));
                        if(message.amount){
                            app.removeSpaces = false;
                            message.balance = app.getBalance(msg.body);
                            message.src = app.shortener(msg.body.match(sentReg))
                            app.removeSpaces = true;
                            app.usageMessages.push(message)
                        }
                    }else if(isGiveReg.test(msg.body)){
                        message.type = 'Give'
                        message.amount = app.shortener(msg.body.match(giveAmount));
                        if(message.amount){
                            app.removeSpaces = false;
                            message.balance = app.getBalance(msg.body);
                            message.src = app.shortener(msg.body.match(giveRec))
                            app.removeSpaces = true;
                        }
                    }
                    else if(rec$Reg.test(msg.body)){
                        message.amount = app.shortener(msg.body.match(rec$Reg));
                        if(message.amount){
                            app.removeSpaces = false;
                            message.balance = app.getBalance(msg.body);
                            message.src = app.shortener(msg.body.match(recReg));
                            message.type = 'Received'
                            app.removeSpaces = true;
                        }
                    }
                    else if(buyReg.test(msg.body)){
                        message.amount = app.shortener(msg.body.match(buyReg));
                        if(message.amount){
                            message.balance = app.getBalance(msg.body);

                        message.src = 'airtime'
                        message.type = 'Bought'
                        app.usageMessages.push(message);
                        }
                    }else if(transfsReg.test(msg.body)){
                        message.amount = app.shortener(msg.body.match(transf$Reg))
                        message.type = 'Transferred to'
                        message.src = 'Mshwari'
                        app.usageMessages.push(message)
                    }else if(transfsRegFrom.test(msg.body)){
                        message.amount = app.shortener(msg.body.match(transf$Reg))
                        message.type = 'Transferred from'
                        message.src = 'Mshwari'
                    }else if(withdrwReg.test(msg.body)){
                        message.amount = app.shortener(msg.body.match(withdrw$Reg))
                        message.type = 'Withdraw',
                        message.balance = app.getBalance(msg.body);
                        app.removeSpaces = false;
                        message.src = app.shortener(msg.body.match(withdrwReg))
                        app.removeSpaces = true;
                        app.usageMessages.push(message)

                    }

                    if(message.type && message.src){
                        app.messages.push(message);
                    }
                }
            })
                app.messagesFetched = true;
                if(document.querySelector('.app').classList.contains('timelineView')){
                    app.currentViewisTimeline = true
                    app.renderTimeline();
                }else{
                    app.currentViewisTimeline = false
                    app.showTodayMessages();
                }

            }),
            (err)=>{
                // window.alert('access denied')
                
            }
     
    },
    buildDate(date){
        return `${moment(date).date()}/${moment(date).month() + 1}/${moment(date).year()}`
    },
    specificDayMsgs:function(msgs,timestamp){
        let specificDaySms = [];
        let specificDay = app.buildDate(timestamp);
        msgs.forEach(msg=>{
            let msgDate = app.buildDate(msg.timestamp);
            if(msgDate == specificDay){
                specificDaySms.push(msg)
            }
        })
        return specificDaySms
    },
    todayMsgs:function(msgs){
        
        let todaySms = [];
        const today = moment();
        msgs.forEach(msg=>{
            if(msg.dayOfYear === today.get('dayOfYear')){
                if(msg.dateTime.year() == today.year()){
                todaySms.push(msg)
                }
            }
        })
        return todaySms
    },
    yesterdayMsgs:function(msgs){
        const today = moment();
        let yesterMsgs = [];
        const yesterday = today.startOf('day').subtract(24,'hours');
        msgs.forEach(msg=>{
            if(msg.dayOfYear === yesterday.get('dayOfYear')){
                if(msg.dateTime.year() == today.year()){
                    yesterMsgs.push(msg)
                }
            }
        })
        return yesterMsgs;
    },
    thisWeekMsgs:function(msgs){
        const today = moment();
        const weeksMsgs = []
        const startOfWeek = today.startOf('week').get('dayOfYear');
        const endOfWeek = today.endOf('week').get('dayOfYear')
        msgs.forEach(msg=>{
            if(msg.dayOfYear>startOfWeek || msg.dayOfYear == startOfWeek ){
                if(msg.dayOfYear<endOfWeek || msg.dayOfYear == endOfWeek ){
                    if(msg.dateTime.year() == today.year()){
                        weeksMsgs.push(msg);
                    }
                }
            }
     
        })
        return weeksMsgs;
    },
    lastWeekMsgs:function(msgs){
        const today = moment();
        const lastWeeksMsgs = []
        const startOfWeek = today.startOf('week');
        const lastDayOfPrevWeek = startOfWeek.subtract(24,'hours');
        const endOfPrevWeek = lastDayOfPrevWeek.get('dayOfYear');
        let startOfPrevWeek = lastDayOfPrevWeek.startOf('week')
        startOfPrevWeek = startOfWeek.get('dayOfYear');
        msgs.forEach(msg=>{
            if(msg.dayOfYear>startOfPrevWeek || msg.dayOfYear == startOfPrevWeek ){
                if(msg.dayOfYear<endOfPrevWeek || msg.dayOfYear == endOfPrevWeek ){
                    if(msg.dateTime.year() == today.year()){
                    lastWeeksMsgs.push(msg);
                    }
                }
            }
     
        })
        return lastWeeksMsgs;
    },
    thisMonthMsgs:function(msgs){
        const today = moment();
        app.renderMonth(today)
        let thisMonthsMsgs = [];
        const dayOfYearToday = today.get('dayOfYear');
        const startOfMonth = today.startOf('month').get('dayOfYear');
        msgs.forEach(msg=>{
            if(msg.dayOfYear>startOfMonth || msg.dayOfYear == startOfMonth ){
                if(msg.dayOfYear<dayOfYearToday || msg.dayOfYear == dayOfYearToday ){
                    if(msg.dateTime.year() == today.year()){
                    thisMonthsMsgs.push(msg);
                    }
                }
            }
     
        })
        return thisMonthsMsgs;
    },
    specificMonthMsgs:function(msgs,specificDay){
        const daySpecific = moment(specificDay);
        let specificMonthsMsgs = [];
        const dayOfYearSpecific = daySpecific.get('dayOfYear');
        const startOfMonth = daySpecific.startOf('month').get('dayOfYear');
        const endOfMonth = daySpecific.endOf('month').get('dayOfYear');
        msgs.forEach(msg=>{
            if(msg.dayOfYear>startOfMonth || msg.dayOfYear == startOfMonth ){
                if(msg.dayOfYear<endOfMonth || msg.dayOfYear == endOfMonth ){
                    if(msg.dateTime.year() == daySpecific.year()){
                        specificMonthsMsgs.push(msg);
                    }
                }
            }
     
        })
        return specificMonthsMsgs;
    },
    lastMonthMsgs:function(msgs){
        const today = moment();
        let lastMonthsMsgs = []
        const startOfMonth = today.startOf('month');
        const endOfLastMonth = startOfMonth.subtract(24,'hours');
        app.renderMonth(endOfLastMonth);
        const endOfLastMonthDay = endOfLastMonth.get('dayOfYear')
        const startOfLastMonth = endOfLastMonth.startOf('month');
        const startOfLastMonthDay = startOfLastMonth.startOf('month').get('dayOfYear');
    
        msgs.forEach(msg=>{
            if(msg.dayOfYear>startOfLastMonthDay || msg.dayOfYear == startOfLastMonthDay ){
                if(msg.dayOfYear<endOfLastMonthDay || msg.dayOfYear == endOfLastMonthDay ){
                    if(msg.dateTime.year() == today.year()){
                    lastMonthsMsgs.push(msg);
                    }
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
        const dateTime = moment(`${date} ${time}`, "DD/MM/YY h:mmA");
        const timestamp = new Date(date).getTime();
        const dt = {
            timestamp,
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
    shortener:function(string){
        if(string){
            let replacers = [/Ksh/g,/\.00/g,/paid/g,/\./,/Give/,/cash/,/transferred/g,/balance/g,/is /g,/transaction/gi,/cost/g,/, \d/g,/bought/g,/to /g,/of/g,/ on/g,/airtime/g,/from/g,/for/g,/07.*/,/,/,/received/g,/sent/g,/-/,/New/,/M-shwari/gi,/ /g]
            let replacers2 = [/Ksh/g,/\.00/g,/paid/g,/\./,/Give/,/cash/,/transferred/g,/balance/g,/is /g,/transaction/gi,/cost/g,/, \d/g,/bought/g,/to /g,/of/g,/ on/g,/airtime/g,/from/g,/for/g,/07.*/,/,/,/received/g,/sent/g,/-/,/New/,/M-shwari/gi]
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
            return result
        }else{
            return false
        }
    },
    removeNumber:function(string){
        string = string.replace(/07.*/,'')
        return string
    },
    render:function(msgs){
        const cardsContainer = document.querySelector('.cards');
        app.refreshDom();

        msgs.forEach(message=>{
            cardsContainer.insertAdjacentHTML('afterbegin',
            `
            <div class="card animated slideInUp faster">
            <p class="line"></p>
            <div class="flex card-upper">
                <p class="amount">${message.amount} Ksh</p>
                <p class="type">${message.type}</p>
            </div>
            <div class="flex">
                <p class="recipient">${message.src}</p>
                <p class="date">${message.date}</p>
            </div>
            <p id="fullMsg" style="display:none">${message.text}</p>
            </div>
            `
            )

            if(!document.body.classList.contains('timelineTime')){
                document.querySelector('.line').style.display = 'none';
            }
        })
        if(msgs.length<1){
            document.querySelector('.no-msgs').style.display = 'flex'
            document.querySelector('#loadText').textContent = 'No Messages'
            document.querySelector('#loadDots').style.display = 'none'
            document.body.classList.add('colapse');
        }else if(document.querySelector('.card') == null){
            document.querySelector('#loadText').textContent = 'Looking for Messages'
            document.querySelector('#loadDots').style.display = 'block'
            document.querySelector('.no-msgs').style.display = 'flex'
            document.body.classList.add('colapse');
        }else{
            const messages = document.querySelectorAll('.card');
            messages.forEach(msg=>{
                msg.addEventListener('click', app.showFullMessage);
            })
            document.querySelector('.no-msgs').style.display = 'none'
            if(!document.body.classList.contains('timelineTime')){
                document.querySelector('#showStats').style.display = 'block'
            }
        }
        app.removeLastLine()

        const cards = document.querySelectorAll('.card')
        cards.forEach(card=>{
            if(card.querySelector('.recipient').textContent == 'Mshwari'){
                card.querySelector('.type').style.color = '#002aff'
            }
        })
    },
    showTodayMessages:function(){
        if(app.currentViewisTimeline){
            document.body.classList.remove('showReportToggle');
            app.todayMessagesArr = app.todayMsgs(app.messages);
        }else{
            app.todayMessagesArr = app.todayMsgs(app.usageMessages);

        }
            app.render(app.todayMessagesArr)
            app.getInfo(app.todayMessagesArr)
    },
    showYesterdayMessages:function(){
        if(app.currentViewisTimeline){
            document.body.classList.remove('showReportToggle');
            app.yesterdayMessagesArr = app.yesterdayMsgs(app.messages);
        }else{
            app.yesterdayMessagesArr = app.yesterdayMsgs(app.usageMessages);

        }
            app.render(app.yesterdayMessagesArr)
            app.getInfo(app.yesterdayMessagesArr);

    },
    showThisWeekMessages:function(){
        if(app.currentViewisTimeline){
            document.body.classList.remove('showReportToggle');
            app.thisWeekMessagesArr = app.thisWeekMsgs(app.messages);
        }else{
            app.thisWeekMessagesArr = app.thisWeekMsgs(app.usageMessages);

        }
            app.render(app.thisWeekMessagesArr)
            app.getInfo(app.thisWeekMessagesArr)

    },
    showLastWeekMessages:function(){
        if(app.currentViewisTimeline){
            document.body.classList.remove('showReportToggle');
            app.lastWeekMessagesArr = app.lastWeekMsgs(app.messages);
        }else{
            app.lastWeekMessagesArr = app.lastWeekMsgs(app.usageMessages);

        }
            app.render(app.lastWeekMessagesArr)
            app.getInfo(app.lastWeekMessagesArr)

    },
    showThisMonthMessages:function(){
        
        if(app.currentViewisTimeline){
            document.body.classList.add('showReportToggle');
            app.thisMonthMessagesArr = app.thisMonthMsgs(app.messages);
        }else{
            app.thisMonthMessagesArr = app.thisMonthMsgs(app.usageMessages);
            
        }
        app.render(app.thisMonthMessagesArr)
        app.getInfo(app.thisMonthMessagesArr)
        
    },
    showLastMonthMessages:function(){
        if(app.currentViewisTimeline){
            document.body.classList.add('showReportToggle');
            app.lastMonthMessagesArr = app.lastMonthMsgs(app.messages);
        }else{
            app.lastMonthMessagesArr = app.lastMonthMsgs(app.usageMessages);

        }
        app.render(app.lastMonthMessagesArr)
        app.getInfo(app.lastMonthMessagesArr);
            

    },
    showSpecificDayMessages:function(timestamp){
        if(app.currentViewisTimeline){
            app.customDateMessagesArr = app.specificDayMsgs(app.messages,timestamp);
        }else{
            app.customDateMessagesArr = app.specificDayMsgs(app.usageMessages,timestamp);
        }
        app.render(app.customDateMessagesArr);
        app.getInfo(app.customDateMessagesArr);
        app.showMonthToggler()
    },
    showSpecificMonthMessages:function(day){
        if(app.currentViewisTimeline){
            app.customMonthMessagesArr = app.specificMonthMsgs(app.messages,day);
        }else{
            app.customMonthMessagesArr = app.specificMonthMsgs(app.usageMessages,day);
        }
        app.render(app.customMonthMessagesArr);
        app.getInfo(app.customMonthMessagesArr);
    },
    showAllMessages:function(){
        if(app.currentViewisTimeline){
            app.render(app.messages);
        }else{
            app.render(app.usageMessages);
            app.getInfo(app.usageMessages);
        }
    },
    getCustomDay:function(){
        const options = {
            type: 'date',         
            date: new Date(),     
            maxDate: new Date()   
        };
         
        window.DateTimePicker.pick(options, function (timestamp) {

            app.showSpecificDayMessages(timestamp)
            app.customDay = timestamp;
            const customDate = moment(timestamp)
            const dateBuild = customDate.date() + '/' + (customDate.month() + 1) + '/' + customDate.year();
            if(customDate){
                document.querySelector('#selectedDate').textContent = dateBuild;
                document.querySelector('#customDate').classList.add('selectedOpt')
                app.specDay = dateBuild;

            }else{
                previousDate.classList.add('selectedOpt')
            }
    
        });   
    },
    getCustomMonth:function(){
        app.showSpecificMonthMessages(app.customDay);
        app.renderMonth()
    },
    refreshDom:function(){
        const msgs = document.querySelectorAll('.card');
        const cardsContainer = document.querySelector('.cards')
        msgs.forEach(msg=>{
            cardsContainer.removeChild(msg);
        })
    },
    showFullMessage:function(e){
        const card = e.currentTarget;
        const fullMsg = card.querySelector('#fullMsg').textContent;
        document.querySelector('.fullmessage').textContent = fullMsg;
        document.body.classList.add('showFullBox');
    },
    getInfo:function(msgs){
        if(!app.currentViewisTimeline){
            let total = 0;
            msgs.forEach(msg=>{
                total += parseInt(msg.amount);
            })
            app.totalAmount = total;
            (document.querySelector('#totalSpent').textContent) = app.totalAmount + ' Ksh';
            document.querySelector('#totalUsages').textContent = msgs.length;
            document.querySelector('#currentBal').textContent =  app.getCurrentBalance() + ' Ksh';
        }
    },
    getBalance: function(string){
        const balReg = /balance\sis\sKsh.*\.\d{2}/
        let balance = app.shortener(string.match(balReg))
        return balance;
        //Fix Balance returning zero when message is not an ordinary one
    },
    getCurrentBalance:function(){
        return app.messages[0].balance;
    },
    renderTimeline:function(){
            app.showTodayMessages(app.messages)
        
    },
    removeLastLine:function(){
        if(document.body.classList.contains('timelineTime')){
            const timeCards = Array.from(document.querySelector('.timeline').querySelectorAll('.card'));
            const length = timeCards.length;
            if(length>0){
                const line = timeCards[length-1].querySelector('.line');
                line.style.display = 'none';
            }
        }
    },
    showMonthToggler:function(){
        document.body.classList.add('showMonthMsgs');
        document.body.classList.remove('showDayMsgs');

        if(window.localStorage.getItem('firstCustomDate') == 'true'){
            window.localStorage.setItem("firstCustomDate", "false");
            document.body.classList.add('showMonthExplainer');
            setTimeout(()=>{
                document.body.classList.remove('showMonthExplainer');
                document.querySelector('.monthExplainer').textContent = '';
            },3500)
        }else if(window.localStorage.getItem('firstCustomDate') == 'false'){
            document.querySelector('.monthExplainer').textContent = '';
        }
    },
    hideMonthToggler:function(){
        document.body.classList.remove('showMonthMsgs');

    },
    showDayToggler:function(){
        document.body.classList.remove('showMonthMsgs');
        document.body.classList.add('showReportToggle');
        document.body.classList.add('showDayMsgs');
    },
    hideDayToggler:function(){
        document.body.classList.remove('showDayMsgs');
        document.body.classList.remove('showReportToggle');

    },
    renderMonth:function(mObj){
        let mDate;
        if(mObj){
            mDate = mObj.toString();
            const date = mDate.replace(/\w\w\w/,'').replace(/\d\d/,'').replace(/\d\d:.*/,'');
            if(app.currentViewisTimeline){
                document.querySelector('#reportDateTitle').textContent = date
            }
        }else{
            mDate = moment(document.querySelector('#selectedDate').textContent,'DD/MM/YYYY').toString();
            const date = mDate.replace(/\w\w\w/,'').replace(/\d\d/,'').replace(/\d\d:.*/,'');
            document.querySelector('#selectedDate').textContent = date
        }
    },
    specDay:null

};

app.initialize();