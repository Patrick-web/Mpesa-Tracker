const statsShow = document.querySelector('#showStats');
statsShow.addEventListener('click',()=>{
  document.body.classList.add('showStats');
  document.querySelector('.statsPage').classList.remove('slideOutDown');
  document.querySelector('.statsPage').classList.add('slideInUp');
  document.querySelector('canvas').width = window.innerWidth;
  document.querySelector('canvas').height = window.innerHeight/2;
  initStats();
})

const statsHide = document.querySelector('#hideStats');
statsHide.addEventListener('click',()=>{
  document.querySelector('.statsPage').classList.remove('slideInUp');
  document.querySelector('.statsPage').classList.add('slideOutDown');
  setTimeout(()=>{
    document.body.classList.remove('showStats');
  },500)


})

function initStats(){
  const cards = document.querySelectorAll('.card');
  var extracted = [];
  cards.forEach(card => {
    const amount = parseInt((card.querySelector('.amount').textContent).replace(/,/g,''));
    const recipient = card.querySelector('.recipient').textContent;
    let extractedData = {
      recipient,
      amount
    }
    extracted.push(extractedData)  
  });
  //Algorithm for grouping and summing up amounts for each group

  /*
  Idea: Begin a Loop in the ungrouped array;
        For each iteration in the ungrouped array determine if the group is existent in the grouped array;
        If it doesn't exist, then create it (by inserting an object with Recipient and Amount properties(intialized to zero)   ) and add the first amount;
        If it does exist, get its index and add onto its amount only
  */

  // let grouped = []; //contains the unique groups and their amount summations
  function getGroupedData(toBeGrouped){
    let grouped = []
    toBeGrouped.forEach((extractedObj)=>{
      let groupedRecipients = grouped.map(group=>group.recipient)
      let indexInGrouped = groupedRecipients.indexOf(extractedObj.recipient);
      if(indexInGrouped<0){
        grouped.push(extractedObj);
      }else{
        grouped[indexInGrouped].amount = grouped[indexInGrouped].amount + extractedObj.amount;
      }
    })
    return quickSort(grouped)
  }
  function quickSort(arrayOfObjs){
    
    if(arrayOfObjs.length <= 1){ //<= to cover when the it gets an empty array
        return arrayOfObjs
    }
    let left = [];
    let right = [];
    let pivotValue = arrayOfObjs[arrayOfObjs.length - 1]
    let pivot = arrayOfObjs[arrayOfObjs.length - 1].amount;
    for (const item of arrayOfObjs.slice(0,arrayOfObjs.length - 1)) {
        item.amount<pivot ? left.push(item) : right.push(item);
    }
    return [...quickSort(right),pivotValue,...quickSort(left)]

}

  const groupedArray = getGroupedData(extracted);

  newCanvas();
  const chartArea = document.querySelector('#chartArea').getContext('2d')
  const statsChart = new Chart(chartArea,{
    type:'pie',
    data:{
        labels:groupedArray.map(group=>group.recipient),
        datasets:[{
          label:'August 2020',
            data:groupedArray.map(group=>group.amount),
            backgroundColor:[
              'rgba(255,99,132,0.6)',
              'rgba(54,162,235,0.6)',
              'rgba(255,206,86,0.6)',
              'rgba(75,192,192,0.6)',
              'rgba(153,102,255,0.6)',
              'rgba(255,159,64,0.6)',
              'rgba(255,99,132,0.6)',
              '#B3E5FC',
              '#81D4FA',
              '#4FC3F7',
              '#29B6F6',
              '#039BE5',
              '#0288D1',
              '#0277BD',
              '#80D8FF',
              '#40C4FF',
              '#00B0FF',
              '#0091EA',
              '#00BCD4',
              '#E0F7FA',
              '#B2EBF2',
              '#80DEEA',
              '#4DD0E1',
              '#26C6DA',
              '#00ACC1',
              '#0097A7',
              '#00838F',
              '#006064',
              '#84FFFF',
              '#18FFFF',
              '#00E5FF',
              '#00B8D4',
              '#009688',
              '#E0F2F1',
              '#B2DFDB',
              '#80CBC4',
              '#4DB6AC',
              '#26A69A',
              '#00897B',
              '#00796B',
              '#00695C',
              '#004D40',
              '#A7FFEB',
              '#64FFDA',
              '#1DE9B6',
              '#00BFA5'
          ],
        }]
    },
  
    options:{
      legend:{
        display:false
      }
    },
  })

  renderStatCards(groupedArray)
}

function renderStatCards(cards){
  clearCards();

  const statsCont = document.querySelector('.statCardsContainer');
  cards.forEach(card=>{
    statsCont.insertAdjacentHTML('afterbegin',`
    <div class="statCard">
      <div class="statRec">${card.recipient}</div>
      <div class="statAmount"> <p class="sAm">${card.amount}</p></div>
    </div>
    `)
  })
}

function clearCards(){
  const statsCont = document.querySelector('.statCardsContainer');
  const cards = document.querySelectorAll('.statCard');
  cards.forEach(card=>{
    statsCont.removeChild(card)
  })
}
function newCanvas(){
  document.querySelector('canvas').remove();
  document.querySelector('.statCardsContainer').insertAdjacentHTML('beforebegin','<canvas id="chartArea"></canvas>')
  document.querySelector('canvas').width = window.innerWidth;
  document.querySelector('canvas').height = window.innerHeight/2;

}