function saveStateToChromeStorage(key, value) {
    chrome.storage.local.set({[key] : value}, ()=>{
        if(chrome.runtime.lastError) {
            console.log(`An error occurred : ${chrome.runtime.lastError}`);
        }
        else{
            console.log('Data stored successfully !!!');
        }
    })
}

function toggleOnOff(toggleOuter) {
    let toggleInner = toggleOuter.children[0];
    if (toggleOuter.ariaChecked === 'false') {
        toggleInner.style.transform = 'translateX(30px)';
        toggleOuter.ariaChecked = 'true';
        toggleOuter.style.backgroundColor = '#2196F3';
        saveStateToChromeStorage(toggleOuter.id, true);
    } else {
        toggleInner.style.transform = 'translateX(0px)';
        toggleOuter.ariaChecked = 'false';
        toggleOuter.style.backgroundColor = '#7c7c7c';
        saveStateToChromeStorage(toggleOuter.id, false);
    }
}


document.body.addEventListener('click', (event)=>{
    if (event.target.className == 'toggle-outer'){
        toggleOnOff(event.target);
    }
    else if(event.target.className == 'toggle-inner'){
        toggleOnOff(event.target.parentElement);
    }
    
})

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(null, (res)=>{
        let keys = Object.keys(res);
        if(chrome.runtime.lastError) {
            console.log(`An error occurred : ${chrome.runtime.lastError}`);
        }
        else if(keys.length !== 0){
            for(let key of keys){
                if(res[key]){
                    toggleOnOff(document.getElementById(key));
                }
            }
        }
    })
})