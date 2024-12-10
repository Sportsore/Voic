// URL لجلب قائمة الأصوات
const voicesURL = "https://ai-voice.nyc3.cdn.digitaloceanspaces.com/data/data.json";

// عناصر واجهة المستخدم
const voiceSelect = document.getElementById("voiceSelect");
const textInput = document.getElementById("textInput");
const convertBtn = document.getElementById("convertBtn");
const audioPlayer = document.getElementById("audioPlayer");

// تحميل قائمة الأصوات
async function loadVoices() {
    try {
        const response = await fetch(voicesURL);
        const data = await response.json();
        const voices = data.voices;

        // تعبئة القائمة بالأصوات
        voices.forEach(voice => {
            const option = document.createElement("option");
            option.value = voice.voiceId;
            option.textContent = voice.name;
            voiceSelect.appendChild(option);
        });
    } catch (error) {
        console.error("خطأ في تحميل قائمة الأصوات:", error);
    }
}

// تحويل النص إلى صوت
async function convertTextToSpeech() {
    const selectedVoice = voiceSelect.value;
    const text = textInput.value;

    if (!selectedVoice || !text) {
        alert("يرجى اختيار صوت وإدخال نص!");
        return;
    }

    try {
        const payload = {
            voiceId: selectedVoice,
            text: text,
            deviceId: "web_" + Math.random().toString(36).substring(7),
            uid: "web_user",
            startTime: Date.now(),
        };

        const response = await fetch("https://connect.getvoices.ai/api/v1/text2speech/stream", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "WebApp",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const audioBlob = await response.blob();
            const audioURL = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioURL;
        } else {
            console.error("خطأ في تحويل النص إلى صوت:", response.statusText);
        }
    } catch (error) {
        console.error("خطأ:", error);
    }
}

// تحميل قائمة الأصوات عند فتح الصفحة
loadVoices();

// ربط زر التحويل
convertBtn.addEventListener("click", convertTextToSpeech);
