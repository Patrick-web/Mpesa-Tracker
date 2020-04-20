document.addEventListener('deviceready',()=>{
    addListeners()
})

function addListeners(){
    const puller = document.querySelector('.slider');
    puller.addEventListener('click',showInfoBox);

    const selectToggles = document.querySelectorAll('.select-toggle')
    selectToggles.forEach(toggle=>{
        toggle.addEventListener('click',expandSelect)
    })

    const blurBox = document.querySelector('.blur');
    blurBox.addEventListener('click',reset)
}

function showInfoBox(){
    document.body.classList.toggle('showInfoBox')
}
function expandSelect(e){
    const target =  e.currentTarget.parentElement
    if(target.classList.contains('filterBox')){
        document.querySelector('.dateBox').classList.remove('showSelects')
    }else{
        document.querySelector('.filterBox').classList.remove('showSelects')
    }
    target.classList.toggle('showSelects');
    document.body.classList.toggle('showBlur');
    if(target.classList.contains('showSelects')){
        document.body.classList.add('showBlur');
    }
}
function reset(){
    document.body.classList.remove('showBlur');
    document.querySelector('.showSelects').classList.remove('showSelects');

}