const app = () => {
    const song = document.querySelector('.song');
    const alarm = document.querySelector('.alarm')
    const play = document.querySelector('.play');
    const outline = document.querySelector('.moving-outline circle');

    // Sounds
    const sounds = document.querySelectorAll('.sound-picker button')

    // Time Display
    const timeDisplay = document.querySelector('.time-display');
    const studyTimeSelect = document.querySelectorAll('.study-time-select button')
    const restTimeSelect = document.querySelectorAll('.rest-time-select button')
    const paternSelect = document.querySelectorAll('.patern-select button')


    // Get the Length of the outline
    const outlineLength = outline.getTotalLength();

    //Duration
    let fakeDuration = 0;
    let studyTime = 0;
    let restTime = 0;
    let fakePatern = 'study'



    outline.style.strokeDasharray = outlineLength;
    outline.style.strokeDashoffset = outlineLength;

    // 曲選択のボタン押下時に、HTML記載の参照mp3を変更
    sounds.forEach(sound => {
        sound.addEventListener('click', function(){
            song.src = this.getAttribute('data-sound');
            checkPlaying(song);
        });
    })

    // 再生ボタン押下時に、mp3ファイルを参照して実行
    play.addEventListener("click", () => {
        checkPlaying(song);
    });

    // パターン選択
    paternSelect.forEach(option => {
        option.addEventListener('click', function () {
            fakePatern = this.getAttribute('data');
            if(fakePatern == 'study' ){
                studyTimeSelect.forEach(option => {
                    option.removeAttribute('disabled')
                })
                restTimeSelect.forEach(option => {
                    option.setAttribute('disabled', true)
                })
                studyTimeSelect.forEach(option => {
                    option.addEventListener('click', function () {
                        fakeDuration = this.getAttribute('data-time');
                        timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(fakeDuration % 60)}`
                    })
                })
            }
            if(fakePatern == 'rest' ){
                studyTimeSelect.forEach(option => {
                    option.setAttribute('disabled', true)
                })
                restTimeSelect.forEach(option => {
                    option.removeAttribute('disabled')
                })
                restTimeSelect.forEach(option => {
                    option.addEventListener('click', function () {
                        fakeDuration = this.getAttribute('data-time');
                        timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(fakeDuration % 60)}`
                    })
                })
            }
            if(fakePatern == 'both'){
                studyTimeSelect.forEach(option => {
                    option.removeAttribute('disabled')
                })
                restTimeSelect.forEach(option => {
                    option.removeAttribute('disabled')
                })
                studyTimeSelect.forEach(option => {
                    option.addEventListener('click', function () {
                        studyTime = Math.floor(this.getAttribute('data-time'));
                        fakeDuration = studyTime;
                        timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(fakeDuration % 60)}`
                    })
                })
                restTimeSelect.forEach(option => {
                    option.addEventListener('click', function () {
                        restTime = Math.floor(this.getAttribute('data-time'));
                        fakeDuration = studyTime + restTime;
                        timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(fakeDuration % 60)}`
                    })
                })
            }
        })
    })

    // Create a function specific to stop and play the sounds
    const checkPlaying = song => {
        if (song.paused) {
            song.play();
            play.src = './svg/pause.svg';
        }else{
            song.pause();
            play.src = './svg/play.svg'
        }
    };

    // We can animated the circle
    song.ontimeupdate = () => {
        let currentTime = song.currentTime;
        let elapsed = fakeDuration - currentTime;
        let seconds = Math.floor(elapsed % 60);
        let minutes = Math.floor(elapsed / 60);

        // Animate the circle
        let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
        outline.style.strokeDashoffset = progress;
        
        timeDisplay.textContent = `${minutes}:${seconds}`;

        if(fakePatern == 'both'){
            if(currentTime >= studyTime){
                song.muted = true;
                alarm.play();
                if(currentTime >= studyTime + 3){
                    alarm.pause();
                    alarm.currentTime = 0;
                }
            }

        }
        if(currentTime >= fakeDuration - 3){
            song.muted = true;
            alarm.play();
            if(currentTime >= fakeDuration){
                song.muted = false
                song.pause();
                song.currentTime = 0;
                alarm.pause();
                alarm.currentTime = 0;
                play.src = './svg/play.svg';
            }
        }

    }
};

app();