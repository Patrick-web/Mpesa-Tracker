document.addEventListener('deviceready',()=>{
    addListeners()
})
// addListeners()

function addListeners(){

    const selectToggles = document.querySelectorAll('.select-toggle')
    selectToggles.forEach(toggle=>{
        toggle.addEventListener('click',expandSelect)
    })

    const blurBox = document.querySelector('.blur');
    blurBox.addEventListener('click',reset);

    // const pickerToggle = document.querySelector('#customDate')
    // pickerToggle.addEventListener('click',showPicker)

    const months = document.querySelectorAll('.month')
    months.forEach(month=>{
        month.addEventListener('click',selectMonth);
    })

    const reseter = document.querySelector('#reseter');
    reseter.addEventListener('click',hidePicker);

    const items = document.querySelectorAll('.select-item');
    items.forEach(item=>{
        item.addEventListener('click',setActive)
    })
}
function setActive(e){
    if(!e.currentTarget.classList.contains('.custom')){
        const item = e.currentTarget; 
        if(document.querySelector('.selectedOpt')) document.querySelector('.selectedOpt').classList.remove('selectedOpt')
        item.classList.add('selectedOpt');
        document.querySelector('#selectedDate').textContent = item.textContent;
        document.querySelector('#selectedDate').insertAdjacentHTML('beforeend','<img src="img/tri.svg" class="tri" alt="">')
        setTimeout(()=>{
            reset();
        },200)
    }
}
function selectMonth(e){
    if(document.querySelector('.selectedMonth')) document.querySelector('.selectedMonth').classList.remove('selectedMonth')
    const item = e.currentTarget; 
    item.classList.add('selectedMonth');
    document.querySelector('#selectedDate').textContent = item.textContent;
    document.querySelector('#selectedDate').insertAdjacentHTML('beforeend','<img src="img/tri.svg" class="tri" alt="">')
    setTimeout(()=>{
        reset();
        document.body.classList.remove('showPicker')

    },200) 
}
function showPicker(){
    document.body.classList.add('showPicker')
    document.querySelector('.showSelects').classList.remove('showSelects')
}

function expandSelect(e){
    const target =  e.currentTarget.parentElement;
    target.classList.toggle('showSelects');
    document.body.classList.toggle('showBlur');
    if(target.classList.contains('showSelects')){
        document.body.classList.add('showBlur');
    }
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
function hidePicker(){
    document.querySelector('#selectedDate').textContent = "Today";
    document.body.classList.remove('showPicker');
    document.querySelector('.selectedOpt').classList.remove('selectedOpt')
}

