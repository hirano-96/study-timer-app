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

    if(timeDisplay.textContent == "0:00"){
        play.setAttribute('disabled', true)
        play.setAttribute('style', 'cursor:default;')
    }

    // 再生ボタン押下時に、mp3ファイルを参照して実行
    play.addEventListener("click", () => {
        if(timeDisplay.textContent == "0:00"){
        }else{
            checkPlaying(song);
        }
    });

    // パターン選択
    paternSelect.forEach(option => {
        option.addEventListener('click', function () {
            fakePatern = this.getAttribute('data');
            if(fakePatern == 'study' ){
                // 勉強時間選択可能、休憩時間選択非活性
                studyTimeSelect.forEach(option => {
                    option.removeAttribute('disabled')
                    option.removeAttribute('style')
                })
                restTimeSelect.forEach(option => {
                    option.setAttribute('disabled', true)
                    option.setAttribute('style', 'background-color:rgba(213, 210, 210, 0.64); cursor:default;')
                })

                // 勉強時間選択時の処理
                studyTimeSelect.forEach(option => {
                    option.addEventListener('click', function () {
                        fakeDuration = this.getAttribute('data-time');
                        minutes = Math.floor(fakeDuration / 60).toString().padStart( 2, '0')
                        seconds = Math.floor(fakeDuration % 60).toString().padStart( 2, '0')
                        timeDisplay.textContent = minutes + ':' + seconds
                        play.removeAttribute('disabled')
                        play.removeAttribute('style')
                    })
                })
            }
            if(fakePatern == 'rest' ){
                // 勉強時間選択非活性、休憩時間選択可能
                studyTimeSelect.forEach(option => {
                    option.setAttribute('disabled', true)
                    option.setAttribute('style', 'background-color:rgba(213, 210, 210, 0.64); cursor:default;')
                })
                restTimeSelect.forEach(option => {
                    option.removeAttribute('disabled')
                    option.removeAttribute('style')
                })

                // 休憩時間選択時の処理
                restTimeSelect.forEach(option => {
                    option.addEventListener('click', function () {
                        fakeDuration = this.getAttribute('data-time');
                        minutes = Math.floor(fakeDuration / 60).toString().padStart( 2, '0')
                        seconds = Math.floor(fakeDuration % 60).toString().padStart( 2, '0')
                        timeDisplay.textContent = minutes + ':' + seconds
                        play.removeAttribute('disabled')
                        play.removeAttribute('style')
                    })
                })

            }

            if(fakePatern == 'both'){
                // 勉強時間選択可能、休憩時間選択可能
                studyTimeSelect.forEach(option => {
                    option.removeAttribute('disabled')
                    option.removeAttribute('style')
                })
                restTimeSelect.forEach(option => {
                    option.removeAttribute('disabled')
                    option.removeAttribute('style')
                })

                // 勉強時間選択時の処理
                studyTimeSelect.forEach(option => {
                    option.addEventListener('click', function () {
                        studyTime = Math.floor(this.getAttribute('data-time'));
                        fakeDuration = studyTime;
                        minutes = Math.floor(fakeDuration / 60).toString().padStart( 2, '0')
                        seconds = Math.floor(fakeDuration % 60).toString().padStart( 2, '0')
                        timeDisplay.textContent = minutes + ':' + seconds
                        play.removeAttribute('disabled')
                        play.removeAttribute('style')
                    })
                })

                // 休憩時間を勉強時間に足す
                restTimeSelect.forEach(option => {
                    option.addEventListener('click', function () {
                        restTime = Math.floor(this.getAttribute('data-time'));
                        fakeDuration = studyTime + restTime;
                        minutes = Math.floor(fakeDuration / 60).toString().padStart( 2, '0')
                        seconds = Math.floor(fakeDuration % 60).toString().padStart( 2, '0')
                        timeDisplay.textContent = minutes + ':' + seconds
                        play.removeAttribute('disabled')
                        play.removeAttribute('style')
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
        let minutes = Math.floor(fakeDuration / 60).toString().padStart( 2, '0');
        let seconds = Math.floor(fakeDuration % 60).toString().padStart( 2, '0');

        // Animate the circle
        let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
        outline.style.strokeDashoffset = progress;

        timeDisplay.textContent = minutes + ':' + seconds;

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
        if(currentTime >= fakeDuration){
            song.pause();
            song.currentTime = 0;
            alarm.play();
            if(alarm.currentTime == 3){
                alarm.pause();
                alarm.curentTime = 0;
            }
            play.src = './svg/play.svg';
        }

    }
};

app();