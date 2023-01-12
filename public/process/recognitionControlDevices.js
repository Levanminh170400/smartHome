const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const $$$ = document.getElementById.bind(document);

var btnTalk = $$$("btn-recognition");
var btnMaster = $$$("btnMaster");
console.log("btnTalk========", btnTalk);
var btnLiving = $$(".checkbox");
console.log("btnLiving==========", btnLiving[0]);
// music
const song = $$$("song");
const playBtn = $(".player-inner");
const nextBtn = $(".play-forward");
const prevBtn = $(".play-back");
const durationTime = $(".duration");
const remainingTime = $(".remaining");
const rangeBar = $(".range");
const musicName = $(".music-name");
const musicThumbnail = $(".music-thumb");
const musicImage = $(".music-thumb img");
const playRepeat = $(".play-repeat");

let timer;
let repeatCount = 0;
let isPlaying = true;
let indexSong = 0;
let isRepeat = false;

const musics = [
  {
    id: 1,
    title: "Holo",
    file: "holo.mp3",
    image:
      "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1931&q=80",
  },
  {
    id: 2,
    title: "Summer",
    file: "summer.mp3",
    image:
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 3,
    title: "Tòng phu",
    file: "tongphu.mp3",
    image: "./image/utmino.jpg",
  },
  {
    id: 4,
    title: "Sóng gió",
    file: "songgio.mp3",
    image: "./image/jack.jpg",
  },
  {
    id: 5,
    title: "Bất quá nhân gian",
    file: "batquanhangian.mp3",
    image: "./image/chuthaiquynh1.png",
  },
  {
    id: 6,
    title: "Xem như em chẳng may",
    file: "xemnhuemchangmay.mp3",
    image: "./image/chuthaiquynh1.png",
  },
];

// function for music
function handleChangeBar() {
  song.currentTime = rangeBar.value;
}
function init(indexSong) {
  song.setAttribute("src", `./music/${musics[indexSong].file}`);
  musicImage.setAttribute("src", musics[indexSong].image);
  musicName.textContent = musics[indexSong].title;
}
function playPause() {
  repeatCount = 0;
  if (isPlaying) {
    musicThumbnail.classList.add("is-playing");
    song.play();
    playBtn.innerHTML = `<ion-icon name="pause-circle"></ion-icon>`;
    isPlaying = false;
    timer = setInterval(displayTimer, 500);
  } else {
    console.log("pause");
    musicThumbnail.classList.remove("is-playing");
    song.pause();
    playBtn.innerHTML = `<ion-icon name="play"></ion-icon>`;
    isPlaying = true;
    clearInterval(timer);
  }
}
function displayTimer() {
  const { duration, currentTime } = song;
  rangeBar.max = duration;
  rangeBar.value = currentTime;
  remainingTime.textContent = formatTimer(currentTime);
  if (!duration) {
    durationTime.textContent = "00:00";
  } else {
    durationTime.textContent = formatTimer(duration);
  }
}
function formatTimer(number) {
  const minutes = Math.floor(number / 60);
  const seconds = Math.floor(number - minutes * 60);
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}
function handleEndedSong() {
  repeatCount++;
  if (isRepeat && repeatCount === 1) {
    // handle repeat song
    isRepeat = false;
    repeatCount = 0;
    playRepeat.removeAttribute("style");
    isPlaying = true;
    playPause();
  } else {
    changeSong(1);
  }
}
function changeSong(dir) {
  if (dir === 1) {
    // next song
    indexSong++;
    if (indexSong >= musics.length) {
      indexSong = 0;
    }
    isPlaying = true;
  } else if (dir === -1) {
    // prev song
    indexSong--;
    if (indexSong < 0) {
      indexSong = musics.length - 1;
    }
    isPlaying = true;
  }
  init(indexSong);
  // song.setAttribute("src", `./music/${musics[indexSong].file}`);
  playPause();
}

// function for recognitions
function open(obj, index) {
  if (obj.checked != true) {
    obj.checked = true;
    handleLed(index);
  }
}

function close(obj, index) {
  if (obj.checked != false) {
    obj.checked = false;
    handleLed(index);
  }
}
// config recognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

var grammar = "#JSGF V1.0;";

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = "vi-VN";
recognition.interimResults = false;

// catching event recognition
recognition.onresult = function (event) {
  var lastResult = event.results.length - 1;
  var content = event.results[lastResult][0].transcript.toLowerCase();
  console.log("content", content);
  process(content);
};

recognition.onspeechend = function () {
  btnMaster.style = "display: inline-block";
  btnTalk.classList.remove("btnMicrophone");
  recognition.stop();
};

recognition.onerror = function (event) {
  console.log("Error event recogntion");
};

btnTalk.addEventListener("click", function () {
  console.log("clicked");
  btnMaster.style = "display: none";
  btnTalk.classList.add("btnMicrophone");
  recognition.start();
});

const process = (content) => {
  btnLiving.forEach((value, index) => {
    let number = index + 1;
    if (
      content == "mở thiết bị " + number ||
      content == "bật thiết bị " + number
    ) {
      open(value, number);
    } else if (content == "tắt thiết bị " + number) {
      close(value, number);
    }
  });
  //
  if (content == "bật đèn phòng khách" || content == "mở đèn phòng khách") {
    open(btnLiving[0], 1);
  } else if (content == "tắt đèn phòng khách") {
    close(btnLiving[0], 1);
  }

  if (content == "bật tivi phòng khách" || content == "mở tivi phòng khách") {
    open(btnLiving[1], 2);
  } else if (content == "tắt tivi phòng khách") {
    close(btnLiving[1], 2);
  }

  if (content == "bật quạt phòng khách" || content == "mở quạt phòng khách") {
    open(btnLiving[2], 3);
  } else if (content == "tắt quạt phòng khách") {
    close(btnLiving[2], 3);
  }

  if (
    content == "bật điều hòa phòng ngủ" ||
    content == "mở điều hòa phòng ngủ"
  ) {
    open(btnLiving[3], 4);
  } else if (content == "tắt điều hòa phòng ngủ") {
    close(btnLiving[3], 4);
  }

  if (content == "bật đèn phòng ngủ" || content == "mở đèn phòng ngủ") {
    open(btnLiving[4], 5);
  } else if (content == "tắt đèn phòng ngủ") {
    close(btnLiving[4], 5);
  }

  if (content == "bật cửa phòng ngủ" || content == "mở cửa phòng ngủ") {
    open(btnLiving[5], 6);
  } else if (content == "đóng cửa phòng ngủ") {
    close(btnLiving[5], 6);
  }

  if (content == "bật cửa" || content == "mở cửa") {
    open(btnLiving[6], 7);
  } else if (content == "đóng cửa") {
    close(btnLiving[6], 7);
  }

  if (content == "bật đèn ngoài nhà" || content == "mở đèn ngoài nhà") {
    console.log("ok");
    open(btnLiving[7], 8);
    console.log("ok");
  } else if (content == "tắt đèn ngoài nhà") {
    close(btnLiving[7], 8);
  }
  //

  if (content == "mở tất cả thiết bị" || content == "bật tất cả thiết bị") {
    btnLiving.forEach((value, index) => {
      open(value, index + 1);
    });
  } else if (
    content == "tắt tất cả thiết bị" ||
    content == "tất tất cả thiết bị"
  ) {
    btnLiving.forEach((value, index) => {
      close(value, index + 1);
    });
  }

  if (
    content == "bật tất cả thiết bị phòng khách" ||
    content == "mở tất cả thiết bị phòng khách"
  ) {
    btnLiving.forEach((value, index) => {
      if (index < 3) {
        open(value, index + 1);
      }
    });
  } else if (
    content == "tắt tất cả thiết bị phòng khách" ||
    content == "tất tất cả thiết bị phòng khách"
  ) {
    btnLiving.forEach((value, index) => {
      if (index < 3) {
        close(value, index + 1);
      }
    });
  }

  if (
    content == "bật tất cả thiết bị phòng ngủ" ||
    content == "mở tất cả thiết bị phòng ngủ"
  ) {
    btnLiving.forEach((value, index) => {
      if (index > 2 && index < 6) {
        open(value, index + 1);
      }
    });
  } else if (
    content == "tắt tất cả thiết bị phòng ngủ" ||
    content == "tất tất cả thiết bị phòng ngủ"
  ) {
    btnLiving.forEach((value, index) => {
      if (index > 2 && index < 6) {
        close(value, index + 1);
      }
    });
  }

  if (
    content == "bật tất cả thiết bị ngoài nhà" ||
    content == "mở tất cả thiết bị ngoài nhà"
  ) {
    btnLiving.forEach((value, index) => {
      if (index > 5) {
        open(value, index + 1);
      }
    });
  } else if (
    content == "tắt tất cả thiết bị ngoài nhà" ||
    content == "tất tất cả thiết bị ngoài nhà"
  ) {
    btnLiving.forEach((value, index) => {
      if (index > 5) {
        close(value, index + 1);
      }
    });
  }

  if (content == "mở nhạc" || content == "bật nhạc" || content == "music") {
    isPlaying = true;
    playPause();
  }

  if (content == "tắt nhạc" || content == "stop" || content == "dừng") {
    isPlaying = false;
    playPause();
  }

  if (content == "đổi nhạc" || content == "chuyển bài" || content == "next") {
    changeSong(1);
  }

  if (content == "quay lại" || content == "back") {
    changeSong(-1);
    s;
  }
};
// music
// Catching event for music
playRepeat.addEventListener("click", function () {
  if (isRepeat) {
    isRepeat = false;
    playRepeat.removeAttribute("style");
  } else {
    isRepeat = true;
    playRepeat.style.color = "#ffb86c";
  }
});

nextBtn.addEventListener("click", function () {
  changeSong(1);
});

prevBtn.addEventListener("click", function () {
  changeSong(-1);
});

song.addEventListener("ended", handleEndedSong);

playBtn.addEventListener("click", playPause);

rangeBar.addEventListener("change", handleChangeBar);

displayTimer();
init(indexSong);
