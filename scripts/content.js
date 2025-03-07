function appendDurationBtn() {
    if (window.location.href.includes('youtube.com/playlist')) {
        duration.innerHTML = `<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTTKmCdLR6lOtLKRo45lZ6vxstTAVdFfb66g&s'>`;
        document.body.prepend(duration);
    }
}

function removeDurationBtn() {
    try {
        document.body.removeChild(duration);
    } catch (error) {
        console.log(error);
    }
}



function addRequiredEventListeners(res) {
    if (res['CalculatePlaylistDuration']) {
        appendDurationBtn();
    }
}

function getSeconds(time) {
    let arr = time.split(':');
    if (arr.length === 3) {
        return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
    }
    else if (arr.length === 2) {
        return parseInt(arr[0]) * 60 + parseInt(arr[1]);
    }
}


function handleCalculatePlaylistDuration() {
    let container = document.body.querySelectorAll('#contents.style-scope.ytd-playlist-video-list-renderer.style-scope.ytd-playlist-video-list-renderer')[0];

    if(container){
        let totalTime = 0;
        for (let i of container.children) {
            let time = i.querySelector('#text.style-scope.ytd-thumbnail-overlay-time-status-renderer').innerText;
            totalTime += getSeconds(time);
        }
        
        let hours = Math.floor(totalTime / 3600);
        let minutes = Math.floor((totalTime % 3600) / 60);
        let secs = totalTime % 60;
        
        duration.innerHTML = `<h1>${hours}:${minutes}:${secs}</h1>`;
    }
}


function detectStorageChanges() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        const [key, change] = Object.entries(changes)[0];
        if (key === 'AddToQueue') {
            (change.newValue == true) ? addAddToQueueHandler() : removeAddToQueueHandler();
        }
        else if (key === 'HideVideo') {
            (change.newValue == true) ? addHideVideoHandler() : removeHideVideoHandler();
        }
        else if (key === 'CalculatePlaylistDuration') {
            (change.newValue == true) ? appendDurationBtn() : removeDurationBtn();
        }
    });
}


let duration = document.createElement('div');
duration.className = 'duration-btn';
duration.addEventListener('click', () => {
    handleCalculatePlaylistDuration();
})


chrome.storage.local.get(null, (res) => {
    addRequiredEventListeners(res);
    detectStorageChanges();
})