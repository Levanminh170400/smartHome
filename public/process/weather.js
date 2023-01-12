const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const microphone = $(".microphone");

const containerLayout = $(".container-block ");
const containerWeather = $(".weather-container");
const smarthomeView = $(".smartHome-view");

const APP_ID = "cf26e7b2c25b5acd18ed5c3e836fb235";
const DEFAULT_VALUE = "--";
const searchInput = $("#search-input");
const cityName = $(".city-name");
const weatherState = $(".weather-state");
const weatherIcon = $(".weather-icon");
const temperature = $(".temperature");

const sunrise = $(".sunrise");
const sunset = $(".sunset");
const humidity = $(".humidity");
const windSpeed = $(".wind-speed");

// Set data ban dau
const getDataWheather = (value) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${APP_ID}&units=metric&lang=vi`
  ).then(async (res) => {
    const data = await res.json();
    // console.log("[Search Input]", data);
    cityName.innerHTML = data.name || DEFAULT_VALUE;
    weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
    weatherIcon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );
    temperature.innerHTML = `${Math.round(data.main.temp)}` || DEFAULT_VALUE;

    sunrise.innerHTML =
      `${moment.unix(data.sys.sunrise).format("H:mm")}h` || DEFAULT_VALUE;
    sunset.innerHTML =
      `${moment.unix(data.sys.sunset).format("H:mm")}h` || DEFAULT_VALUE;
    humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
    windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
    searchInput.value = "Hà Nội";
  });
};
getDataWheather("hanoi");

searchInput.addEventListener("change", (e) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`
  ).then(async (res) => {
    const data = await res.json();
    // console.log("[Search Input]", data);
    data &&
      speak(`The weather is ${Math.round(data.main.temp)} in ${data.name}`);
    cityName.innerHTML = data.name || DEFAULT_VALUE;
    weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
    weatherIcon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    );
    temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;

    sunrise.innerHTML =
      moment.unix(data.sys.sunrise).format("H:mm") || DEFAULT_VALUE;
    sunset.innerHTML =
      moment.unix(data.sys.sunset).format("H:mm") || DEFAULT_VALUE;
    humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
    windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
  });
});

// Tro ly ao
// Khởi tạo đối tượng recognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// config transfor to speech
const synth = window.speechSynthesis;
// config properties and methor for recognition
recognition.lang = "vi-VI";
recognition.continuous = false;

const speak = (text) => {
  if (synth.speaking) {
    console.error("Busy. Speaking...");
    return;
  }
  // Khởi tạo đối tượng SpeechSynthesisUtterance tổ hợp giọng nói
  const utter = new SpeechSynthesisUtterance(text);
  // nắng nghe sự kiện
  utter.onend = () => {
    console.log("SpeechSynthesisUtterance.onend");
  };
  utter.onerror = (err) => {
    console.error("SpeechSynthesisUtterance.onerror", err);
  };

  synth.speak(utter);
};

const handleVoice = (text) => {
  console.log("text", text);
  // "thời tiết tại Đà Nẵng" => ["thời tiết tại", "Đà Nẵng"]
  const handledText = text.toLowerCase();

  if (handledText.includes("thời tiết tại")) {
    const location = handledText.split("tại")[1].trim();
    // console.log("location", location);
    searchInput.value = location;
    const changeEvent = new Event("change");
    searchInput.dispatchEvent(changeEvent);
    return;
  }

  if (handledText.includes("mấy giờ")) {
    const textToSpeech = `${moment().hours()} hours ${moment().minutes()} minutes`;
    speak(textToSpeech);
    return;
  }

  if (handledText.includes("khu vực 1")) {
    const color = handledText.split("khu vực 1")[1].trim();
    containerLayout.style.background = color;
    return;
  }

  if (handledText.includes("khu vực 3")) {
    const color = handledText.split("khu vực 3")[1].trim();
    console.log("color-weather", color);
    containerWeather.style.background = color;
    return;
  }

  if (handledText.includes("khu vực 2")) {
    const color = handledText.split("khu vực 2")[1].trim();
    smarthomeView.style.background = color;
    return;
  }

  if (handledText.includes("mặc định")) {
    containerLayout.style.background = "";
    smarthomeView.style.background = "";
    containerWeather.style.background = "";
    return;
  }
  speak("Try again");
};

// nắng nghe sự kiện click microphone
microphone.addEventListener("click", (e) => {
  console.log("test microphone");
  e.preventDefault();
  recognition.start();
  microphone.classList.add("recording");
});
// lắng nghe event sau khi kết thúc
recognition.onspeechend = () => {
  recognition.stop();
  microphone.classList.remove("recording");
};
// lắng nghe event nếu nỗi
recognition.onerror = (err) => {
  console.error(err);
  microphone.classList.remove("recording");
};
// nắng nghe event sau khi nói xong
recognition.onresult = (e) => {
  console.log("onresult", e);
  const text = e.results[0][0].transcript;
  console.log("result-voice", e);
  handleVoice(text);
};
