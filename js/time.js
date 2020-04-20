// const dateTime = moment('14/06/2020 9:40PM', "DD/MM/YY h:mmA");
// console.log(dateTime.toString());
// console.log(dateTime.format('MMM Mo YYYY'));
// console.log(moment().);

var msgs = [
    {
        msg:"-4 CJDNCJECC  CJENCJENCJ",
        date:'5/03/2020',
        time:'8:00PM'
    },
    {
        msg:"-3 CJDNCJECC  CJENCJENCJ",
        date:'31/03/2020',
        time:'8:00PM'
    },
    {
        msg:"-2 CJDNCJECC  CJENCJENCJ",
        date:'5/04/2020',
        time:'8:00PM'
    },
    {
        msg:"-1 CJDNCJECC  CJENCJENCJ",
        date:'17/04/2020',
        time:'8:00PM'
    },
    {
        msg:"one CJDNCJECC  CJENCJENCJ",
        date:'19/04/2020',
        time:'8:00PM'
    },
    {
        msg:"two CJDNCJECC  CJENCJENCJ",
        date:'21/04/2020',
        time:'8:00PM'
    },
    {
        msg:"rgree cjdmcjsjcdsjcs cdcsdc",
        date:'18/04/2020',
        time:'9:40PM'
    },
    {
        msg:"four cdcdschygwydl, ceicnc cinc",
        date:'20/06/2019',
        time:'2:26PM'
    },
]

msgs.forEach((msg)=>{
    const time = msg.time;
    const date = msg.date
    const dateTime = moment(`${date} ${time}`, "DD/MM/YY h:mmA");
    msg.dateTime = dateTime;
    msg.date = dateTime.format('Mo MMM YYYY')
    msg.dayOfYear = dateTime.get('dayOfYear')
})


function todayMsgs(msgs){
    let todaySms = [];
    const today = moment();
    msgs.forEach(msg=>{
        if(msg.date === today.format('Mo MMM YYYY')){
            todaySms.push(msg)
        }
    })
    return todaySms
}

function yesterdayMsgs(msgs){
    const today = moment();
    let yesterMsgs = [];
    const yesterday = today.startOf('day').subtract(24,'hours');
    msgs.forEach(msg=>{
        if(msg.dayOfYear === yesterday.get('dayOfYear')){
            yesterMsgs.push(msg)
        }
    })
    return yesterMsgs;
}

function thisWeekMsgs(msgs){
    const today = moment();
    const weeksMsgs = []
    const startOfWeek = today.startOf('week').get('dayOfYear');
    console.log('Start '+ startOfWeek);
    const endOfWeek = today.endOf('week').get('dayOfYear')
    console.log('End '+endOfWeek);
    msgs.forEach(msg=>{
        if(msg.dayOfYear>startOfWeek || msg.dayOfYear == startOfWeek ){
            if(msg.dayOfYear<endOfWeek || msg.dayOfYear == endOfWeek ){
                weeksMsgs.push(msg);
            }
        }
 
    })
    return weeksMsgs;
}

function lastWeekMsgs(msgs){
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
                lastWeeksMsgs.push(msg);
            }
        }
 
    })
    return lastWeeksMsgs;
}
function thisMonthMsgs(msgs){
    const today = moment();
    let thisMonthsMsgs = [];
    const dayOfYearToday = today.get('dayOfYear');
    const startOfMonth = today.startOf('month').get('dayOfYear');
    msgs.forEach(msg=>{
        if(msg.dayOfYear>startOfMonth || msg.dayOfYear == startOfMonth ){
            if(msg.dayOfYear<dayOfYearToday || msg.dayOfYear == dayOfYearToday ){
                thisMonthsMsgs.push(msg);
            }
        }
 
    })
    console.log(thisMonthsMsgs);
}
function lastMonthMsgs(){
    const today = moment();
    let lastMonthsMsgs = []
    const startOfMonth = today.startOf('month');
    const endOfLastMonth = startOfMonth.subtract(24,'hours');
    const endOfLastMonthDay = endOfLastMonth.get('dayOfYear')
    const startOfLastMonth = endOfLastMonth.startOf('month');
    const startOfLastMonthDay = startOfLastMonth.startOf('month').get('dayOfYear');

    msgs.forEach(msg=>{
        if(msg.dayOfYear>startOfLastMonthDay || msg.dayOfYear == startOfLastMonthDay ){
            if(msg.dayOfYear<endOfLastMonthDay || msg.dayOfYear == endOfLastMonthDay ){
                lastMonthsMsgs.push(msg);
            }
        }
 
    })
    return lastMonthsMsgs;
}
// console.log(lastMonthMsgs(msgs));
// console(thisMonthMsgs(msgs))
// console.log(lastWeekMsgs(msgs));
// console.log(thisWeekMsgs(msgs));
// console.log(yesterdayMsgs(msgs));
// console.log(todayMsgs(msgs));