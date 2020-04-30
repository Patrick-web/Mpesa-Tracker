document.addEventListener('deviceready',()=>{
    initialize();
})

function initialize(){
    const filterToggle = document.querySelector('.selectedFilter');
    filterToggle.addEventListener('click',getFilters)

    const unfilter = document.querySelector('#unfilter');
    unfilter.addEventListener('click',unfilterDom)
}

function getFilters(){
    getRecipientFilters()
    getAmountFilters()
}

function filterByRec(e){
   const filter =  e.currentTarget.textContent;
   filterIs(filter);
   const cards = document.querySelectorAll('.card');
   cards.forEach(card=>{
       const rec = card.querySelector('.recipient').textContent;
       if(rec !== filter){
            animateOut(card);
            // card.style.display = 'none';
        }else{
            animateIn(card);
            // card.style.display = 'block';

       }
   })
   reset()
}
function getRecipientFilters(){
    const recipients = Array.from(document.querySelectorAll('.recipient'));
    let recipientFilters = new Set();
    recipients.forEach(recipient=>{
        recipientFilters.add(recipient.textContent);
    })
    clearFilters()
    recipientFilters.forEach(recipient=>{
        document.querySelector('.recipientFilters').insertAdjacentHTML('afterbegin',`
        <p class="filter-item filter-rec">${recipient}</p>
        `)
    })
    const filterRecs = document.querySelectorAll('.filter-rec');
    filterRecs.forEach(filter=>{
        filter.addEventListener('click',filterByRec)
    })
}
function getAmountFilters(){
    const amounts = Array.from(document.querySelectorAll('.amount'));
    if(amounts.length>0){
    let amountsFilters = new Set();
    amounts.forEach(amount=>{
        amountsFilters.add(parseInt(amount.textContent));
    })
    const maxAmount = Math.max(...amountsFilters);
    console.log(maxAmount);
    const baseAmount = Math.round(maxAmount/4);
    console.log(baseAmount);
    const zero = 0;
    const first = `${zero} - ${baseAmount}`;
    const second = `${baseAmount} - ${baseAmount * 2}`;
    const third = `${baseAmount*2} - ${baseAmount * 3}`;
    const forth = `${baseAmount*3} - ${maxAmount}`;

    const filters = [first,second,third,forth];
    const filtersCont = document.querySelector('.filter-am')
    filters.forEach(filter=>{
        filtersCont.insertAdjacentHTML('beforeend',`
        <p class="filter-item amountFilter">${filter}</p>        
        `)
    })
    const renderedFilters = document.querySelectorAll('.amountFilter');
    renderedFilters.forEach(fil=>{
        fil.addEventListener('click',filterByAmount)
    })

    }
}
function filterByAmount(e){
    const range = e.currentTarget.textContent;
    filterIs(range);
    const baseReg = /\d* -/;
    const peakReg = /-\s*\d*/;
    const baseAm = range.match(baseReg);
    const peakAm = range.match(peakReg);
    console.log(baseAm,peakAm);
    const rangeBase = parseInt(baseAm[0].replace(/-/g,''));
    const rangePeak = parseInt(peakAm[0].replace(/-/g,''));
    console.log(rangeBase,rangePeak);
    const cards = document.querySelectorAll('.card');
    cards.forEach(card=>{
        const amount = parseInt(card.querySelector('.amount').textContent);
        if(amount>=rangeBase){
            if(amount<=rangePeak){
                animateIn(card)
                // card.style.display = 'block'
            }else{
                animateOut(card)
                // card.style.display = 'none'
            }
        }else{
            card.style.display = 'none'
        }
    })
    reset();
}

function clearFilters(){
    const amountContainer = document.querySelector('.filter-am');
    const recContainer = document.querySelector('.recipientFilters');
    const amountFilters = document.querySelectorAll('.amountFilter');
    const recFilters = document.querySelectorAll('.filter-rec');
    if(amountFilters){
        amountFilters.forEach(filter=>{
            amountContainer.removeChild(filter);
        })
    }
    if(recFilters){
        recFilters.forEach(filter=>{
            recContainer.removeChild(filter);
        })
    }
    console.log("Cleared...");
}

function showCards(){
    const cards = document.querySelectorAll('.card');
    cards.forEach(card=>{
        card.style.display = 'block';
        animateIn(card);
    })
}
function reset(){
    if(document.querySelector('.showBlur')){
        document.body.classList.remove('showBlur');
    }
    if(document.querySelector('.showSelects')){
        document.querySelector('.showSelects').classList.remove('showSelects');
    }
    if(document.body.classList.contains('showFullBox')){
        document.body.classList.remove('showFullBox')
    }
}
function filterIs(text){
    document.querySelector('.currentFilter').textContent = text
    document.body.classList.add('showCurrentFilter')
}

function unfilterDom(){
    const cards = document.querySelectorAll('.card');
    cards.forEach(card=>{
        animateIn(card)
    })
    document.body.classList.remove('showCurrentFilter')

}


function animateIn(card){
    card.style.display = 'block';
    card.classList.remove('slideInUp');
    card.classList.remove('zoomOut');
    card.classList.add('pulse')
}
function animateOut(card){
    card.classList.remove('slideInUp');
    card.classList.remove('pulse')
    card.classList.add('zoomOut');
    setTimeout(()=>{ card.style.display = 'none' },400);

}