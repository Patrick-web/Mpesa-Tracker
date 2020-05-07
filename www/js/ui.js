console.log(window.localStorage.getItem('amejulishwa'));
if(window.localStorage.getItem('amejulishwa') == null){
    setTimeout(()=>{
        console.log('removing');
        document.body.removeChild(document.querySelector('.promise'));
        window.localStorage.setItem('amejulishwa','true');
    },8000)
}else{
    if(!document.body.classList.contains('timelineTime')){
        document.body.removeChild(document.querySelector('.promise'));
    }
}
setMode();
document.addEventListener('deviceready',()=>{
    addListeners();
})
// addListeners()

function addListeners(){
    if(!viewIsTimeline()){
        const puller = document.querySelector('.slider');
        puller.addEventListener('click',showInfoBox);
    }

    const selectToggles = document.querySelectorAll('.select-toggle')
    selectToggles.forEach(toggle=>{
        toggle.addEventListener('click',expandSelect)
    })

    const blurBox = document.querySelector('.blur');
    console.log(blurBox);
    blurBox.addEventListener('click',()=>{
        if(document.body.classList.contains('showAbout')){
            document.body.classList.remove('showAbout')
        }
        reset()
    });

    // const pickerToggle = document.querySelector('#customDate')
    // pickerToggle.addEventListener('click',showPicker)


    const items = document.querySelectorAll('.select-item');
    items.forEach(item=>{
        item.addEventListener('click',setActive)
    })

    const menuShow = document.querySelector('.menu-toggle');
    menuShow.addEventListener('click', showMenu)

    const menuHide = document.querySelector('#menuColapse');
    menuHide.addEventListener('click', hideMenu)

    const toDark = document.querySelector('.sun');
    toDark.addEventListener('click',goDark);

    const toLight = document.querySelector('.moon');
    toLight.addEventListener('click',goLight);

    const about = document.querySelector('.about');
    about.addEventListener('click',toggleAbout)

}
function setActive(e){
    
    if(!e.currentTarget.classList.contains('.custom')){
        const item = e.currentTarget; 
        if(document.querySelector('.selectedOpt')) document.querySelector('.selectedOpt').classList.remove('selectedOpt')
        if(!item.classList.contains('custom')){
            item.classList.add('selectedOpt');
            document.querySelector('#selectedDate').textContent = item.textContent;
            document.querySelector('#selectedDate').insertAdjacentHTML('beforeend','<img src="img/tri.svg" class="tri" alt="">')
            hideDayToggler();
            hideMonthToggler();
            document.body.classList.remove('showCurrentFilter')
        }
        // document.querySelector('#selectedDate').textContent = item.textContent;
        setTimeout(()=>{
            reset();
        },200)
    }
}

function showPicker(){
    document.body.classList.add('showPicker')
    document.querySelector('.showSelects').classList.remove('showSelects')
}
function showInfoBox(){
    document.body.classList.toggle('showInfoBox')
}
function expandSelect(e){
    const target =  e.currentTarget.parentElement
    if(target.classList.contains('filterBox')){
        document.querySelector('.dateBox').classList.remove('showSelects')
    }else{
        if(document.querySelector('.filterBox')){
            document.querySelector('.filterBox').classList.remove('showSelects')
        }
    }
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

function showMenu(){
    document.body.classList.add('showMenu')
}
function hideMenu(){
    document.body.classList.remove('showMenu')
    if(document.body.classList.contains('showAbout')){
        document.body.classList.remove('showAbout')
    }
}
function goDark(){
    document.body.classList.add('darkMode');
    window.localStorage.setItem("DarkMode", "true");
    // console.log(window.localStorage.getItem('DarkMode'));
}
function goLight(){
    document.body.classList.remove('darkMode')
    window.localStorage.setItem("DarkMode", "false");
    // console.log(window.localStorage.getItem('DarkMode'));
}
function setMode(){
    // console.log("Called...");
    // console.log(window.localStorage.getItem('DarkMode'));
    if(window.localStorage.getItem('DarkMode') == 'true'){
        goDark()
    }else{
        goLight()
    }
}
function viewIsTimeline(){
    if(document.body.classList.contains('timelineTime')){
        return true;
    }else{
        return false;
    }
}

function hideDayToggler(){
    if(document.body.classList.contains('showDayMsgs')){
        document.body.classList.remove('showDayMsgs');
    }
}
function hideMonthToggler(){
    if(document.body.classList.contains('showMonthMsgs')){
        document.body.classList.remove('showMonthMsgs');
    }
}

function showDayToggler(){
    document.body.classList.remove('showMonthMsgs');
    document.body.classList.add('showDayMsgs');
}
function toggleAbout(){
    document.body.classList.toggle('showAbout');
    // if(document.body.classList.contains('showAbout')){
    //    document.querySelector('.dedix').classList.add('slideInDown') 
    // }else{
    //     document.querySelector('.dedix').classList.add('slideOutDown') 
    // }
}
