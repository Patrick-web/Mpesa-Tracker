const showReport = document.querySelector('#showReport');
showReport.addEventListener('click',initReport);
const hideReportBt = document.querySelector('#hideReport');
hideReportBt.addEventListener('click',hideReport)
const saveReport = document.querySelector('#saveReport');
saveReport.addEventListener('click',hideReport);

function hideReport(){
    document.querySelector('.report').classList.remove('slideInUp');
    document.querySelector('.report').classList.add('slideOutDown');
    setTimeout(()=>{
        document.body.classList.remove('showReport');
    },500)
}

function initReport(){
    if(document.querySelector('.card')){
        document.body.classList.add('showReport')
    }
    document.querySelector('.report').classList.add('slideInUp');
    document.querySelector('.report').classList.remove('slideOutDown');
    let cashIn =[];
    let cashOut = [];
    let mshwari = [];
    const cards = document.querySelectorAll('.card');
    cards.forEach(card=>{
       const area = splitter(extract(card).type);
       const data = extract(card);
       if(area == 'cashIn'){
            cashIn.push(data)
        }else if(area == 'cashOut'){
            cashOut.push(data)
       }else{
           mshwari.push(data)
       }
       
    })
    renderMonth();
    renderReport(cashIn,cashOut);
}

function extract(card){
    const date = card.querySelector('.date').textContent;
    const src = card.querySelector('.recipient').textContent
    const amount = parseInt(card.querySelector('.amount').textContent);
    const type = card.querySelector('.type').textContent;
    const data =  {
        date,
        src,
        amount,
        type
    }
    return data;
}

function splitter(type){
    switch(type) {
        case 'Received':
          return 'cashIn'
          break;
        case 'Give':
          return 'cashIn'
          break;
        case 'Sent':
          return 'cashOut'
          break;
        case 'Bought':
          return 'cashOut'
          break;
        case 'Paid':
          return 'cashOut'
          break;
        case 'Transferred from':
          return 'cashIn'
          break;
        // case 'Transferred to':
        //   return 'cashOut'
        //   break;
        case 'airtime':
          return 'cashOut'
          break;
        case 'Withdraw':
          return 'cashOut'
          break;
        default:
          return console.error("Error in splliting: " + type);
          
      }
}

function renderReport(cashIn,cashOut){
    const inContainer = document.querySelector('.cashIN');
    const outContainer = document.querySelector('.cashOUT')
    clearRows();
    cashIn.forEach(item=>{
        console.log("inserting");
        inContainer.insertAdjacentHTML('beforeEnd',`
        <tr class="row"
        style="border:1px solid puuple"
        >
        <td
        style="
        background:white;
        color:black;
        border:1px solid purple;
        text-transform:uppercase;
        padding:5px
        font-size:1.25em;
        text-align:center;
        "
        >${item.date}</td>
        <td
        style="
        background:white;
        color:black;
        border:1px solid purple;
        text-transform:uppercase;
        padding:5px
        font-size:1.25em;
        "
        >${item.src}</td>
        <td
        style="
        background:white;
        color:black;
        border:1px solid purple;
        text-transform:uppercase;
        padding:5px
        font-size:1.1em;
        text-align:center;
        "
        >Ksh ${item.amount}</td>
        </tr>
        `)
    })
    cashOut.forEach(item=>{
        console.log("inserting");
        outContainer.insertAdjacentHTML('beforeEnd',`
        <tr class="row"
        style="border:1px solid puuple"
        >
            <td
            style="
            background:white;
            color:black;
            border:1px solid purple;
            text-transform:uppercase;
            padding:5px
            font-size:1.25em;
            text-align:center;
            "
            >${item.date}</td>
            <td
            style="
            background:white;
            color:black;
            border:1px solid purple;
            text-transform:uppercase;
            padding:5px
            font-size:1.25em;
            "
            >${item.src}</td>
            <td
            style="
            background:white;
            color:black;
            border:1px solid purple;
            text-transform:uppercase;
            padding:5px
            font-size:1.25em;
            text-align:center;
            "
            >Ksh ${item.amount}</td>
        </tr>
        `)
    })
    const totalIn = getTotal(cashIn.map(item=>item.amount));
    const totalOut = getTotal(cashOut.map(item=>item.amount));
    document.querySelector('#totalIn').textContent = totalIn;
    document.querySelector('#totalOut').textContent = totalOut;

}

function renderMonth(){
    const extractDate = document.querySelector('#selectedDate').textContent;
    if(extractDate != 'Last Month' && extractDate != 'This Month'){
        const mDate = moment(extractDate,'DD/MM/YYYY').toString();
        const date = mDate.replace(/\w\w\w/,'').replace(/\d\d/,'').replace(/\d\d:.*/,'');
        document.querySelector('#reportDateTitle').textContent ='MPESA REPORT FOR' + document.querySelector('#selectedDate').textContent
    }
}

function clearRows(){
    console.log("Clearing");
    const rows = document.querySelectorAll('.row');
    rows.forEach(row=>row.remove())
}
function getTotal(array){
    let total = 0;
    array.forEach(item=>{
        total+=item;
    })
    return total;
}

