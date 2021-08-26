const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Victory",
            singer: "Two Steps From Hell",
            path: "./music/victory.mp3",
            image: "./img/victory.jpg"
        },
        {
            name: "Tôi thấy hoa vàng trên cỏ xanh",
            singer: "Ái Phương",
            path: "./music/toithayhoavangtrencoxanh.mp3",
            image:
                "./img/toithayhoavangtrencoxanh.jpeg"
        },
        {
            name: "Salt",
            singer: "Ava Max",
            path:
                "./music/salt.mp3",
            image: "./img/salt.jpeg"
        },
        {
            name: "Tháng mấy em nhớ anh",
            singer: "Cover: Minh Anh",
            path:
                "./music/thangmayemnhoanh.mp3",
            image: "./img/hat.jpg"
        },
        {
            name: "Victory f1",
            singer: "Two Steps From Hell",
            path: "./music/victory.mp3",
            image: "./img/victory.jpg"
        },
        {
            name: "Tôi thấy hoa vàng trên cỏ xanh f1",
            singer: "Ái Phương",
            path: "./music/toithayhoavangtrencoxanh.mp3",
            image:
                "./img/toithayhoavangtrencoxanh.jpeg"
        },
        {
            name: "Salt f1",
            singer: "Ava Max",
            path:
                "./music/salt.mp3",
            image: "./img/salt.jpeg"
        },
        {
            name: "Tháng mấy em nhớ anh f1",
            singer: "Cover: Minh Anh",
            path:
                "./music/thangmayemnhoanh.mp3",
            image: "./img/hat.jpg"
        },
    ],
    render: function () {
        const htmls = this.songs.map(function (song, index) {
            return `
                <div class="song ${index === app.currentIndex ? "active" : ""}" data-index = "${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        })
        $('.playlist').innerHTML = htmls.join("");
    },
    defineProperties:function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const cdWidth = cd.offsetWidth;

        //xử lý cd quay dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'}
        ], {
            duration: 5000, //10seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //xử lý phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || window.document.documentElement.scrollTop;
            const newCdWith = cdWidth - scrollTop;

            cd.style.width = newCdWith > 0 ? newCdWith + 'px' : 0;
            cd.style.opacity = newCdWith / cdWidth;
        }

        //xử lý click play & pause
        playBtn.onclick = function () {
            if(app.isPlaying) {
                audio.pause();
            }else {
                audio.play();
            }
        }

        //khi bài hát được play
        audio.onplay = () => {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //khi bài hát bị pause
        audio.onpause = () => {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //xử lý khi tiến độ bài hát thay đổi
        audio.ontimeupdate = () => {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //xử lý khi tua bài hát
        progress.onchange = (e) => {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        //khi next bài hát
        nextBtn.onclick = () => {
            if(app.isRandom) {
                app.playRandomSong();
            }else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        //khi previous bài hát
        prevBtn.onclick = () => {
            if(app.isRandom) {
                app.playRandomSong();
            }else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        //xử lý bật tắt ramdom song
        randomBtn.onclick = () => {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        }

        //xử lý lặp lại một bài hát
        repeatBtn.onclick = () => {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        //xử lý next khi hết bài
        audio.onended = () => {
            if(app.isRepeat) {
                audio.play();
            }else {
                nextBtn.onclick();
            }
        }

        //lắng nghe hành vi click vào playlist
        playlist.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                app.currentIndex = Number(songNode.dataset.index);
                app.render();
                app.loadCurrentSong();
                audio.play();
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })

        }, 300)
    },
    loadCurrentSong: function() {
        
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random()*this.songs.length)
        } while (newIndex === this.currentIndex)
        this.loadCurrentSong();
    },
    start: function () {
        //định nghĩa các thuộc tính cho object
        this.defineProperties();
        //lắng nghe, xử lý các sự kiện DOM events
        this.handleEvents();
        //tải thông tin bài hát đầu tiên vào ui khi chạy app
        this.loadCurrentSong();
        //render playlist
        this.render();
    }
}

app.start();