let currentPage = 0;
let language = 'english';
let speaking = false;

const pages = [
    {
        english: "José dreamed of a paradise full of books. Every Saturday, he collected books to share with the children of his neighborhood.",
        spanish: "José soñaba con un paraíso lleno de libros. Cada sábado, recogía libros para compartir con los niños de su barrio.",
        vocab: {
            "paradise": {english: "paradise", spanish: "paraíso"},
            "collected": {english: "collected", spanish: "recogía"},
            "children": {english: "children", spanish: "niños"}
        }
    },
    {
        english: "José opened a small library to give everyone free access to knowledge.",
        spanish: "José abrió una pequeña biblioteca para dar acceso gratuito al conocimiento.",
        vocab: {
            "library": {english: "library", spanish: "biblioteca"},
            "knowledge": {english: "knowledge", spanish: "conocimiento"}
        }
    }
];

async function loadPage() {
    try {
        const response = await fetch(`/story/book001?lang=${language}`);
        const data = await response.json();

        if (data.story) {
            console.log("Story loaded:", data.story); // Check if the story is loaded
            storyText = data.story;
            const pageTextDiv = document.getElementById('pageText');
            pageTextDiv.innerHTML = storyText.split(" ").map(word => `<span>${word}</span>`).join(" ");
            document.getElementById('animationArea').innerHTML = "";
            document.getElementById('quizArea').innerHTML = "";
        } else {
            document.getElementById('pageText').innerText = "No story found!";
            console.error("No story found in the response.");
        }
    } catch (error) {
        console.error("Error loading the story:", error);
    }
}


function startReadAlong() {
    const spans = document.querySelectorAll('#pageText span');
    let index = 0;
    speaking = true;

    const speakNextWord = () => {
        if (index < spans.length && speaking) {
            spans.forEach(span => span.classList.remove('highlight'));
            spans[index].classList.add('highlight');

            const utterance = new SpeechSynthesisUtterance(spans[index].innerText);
            utterance.lang = (language === 'english') ? 'en-US' : 'es-ES';
            utterance.onend = () => {
                index++;
                setTimeout(speakNextWord, 100);
            };
            speechSynthesis.speak(utterance);
        }
    };

    speakNextWord();
}

function stopReadAlong() {
    speaking = false;
    speechSynthesis.cancel();
    const spans = document.querySelectorAll('#pageText span');
    spans.forEach(span => span.classList.remove('highlight'));
}

function toggleLanguage() {
    language = (language === 'english') ? 'spanish' : 'english';
    loadPage();
}

function showAnimation() {
    const animationArea = document.getElementById('animationArea');
    animationArea.innerHTML = `
        <lottie-player
            src="https://assets5.lottiefiles.com/packages/lf20_myejiggj.json"
            background="transparent"
            speed="1"
            style="width: 300px; height: 300px;"
            loop
            autoplay>
        </lottie-player>
    `;
}

function showVocabulary() {
    const pageVocab = pages[currentPage].vocab;
    const spans = document.querySelectorAll('#pageText span');

    spans.forEach(span => {
        const word = span.innerText.trim().replace(/[^\wáéíóúüñ]/gi, "").toLowerCase();
        if (pageVocab[word]) {
            span.classList.add('vocab-word');
            span.onclick = () => {
                alert(`"${word}" means:\nEnglish: ${pageVocab[word].english}\nSpanish: ${pageVocab[word].spanish}`);
            };
        }
    });
}

function launchQuiz() {
    const quizArea = document.getElementById('quizArea');
    quizArea.innerHTML = `
        <div style="border: 2px solid #4CAF50; padding: 20px; margin: 20px auto; width: 300px; background: #e8f5e9; border-radius: 10px;">
            <h3>Quiz Time!</h3>
            <p><b>What did José dream about?</b></p>
            <button style="margin: 5px;" onclick="alert('✅ Correct!')">A paradise of books</button><br>
            <button style="margin: 5px;" onclick="alert('❌ Try Again!')">A treasure chest</button><br>
            <button style="margin: 5px;" onclick="alert('❌ Try Again!')">A mountain of gold</button>
        </div>
    `;
}

function nextPage() {
    currentPage++;
    if (currentPage >= pages.length) {
        alert("🎉 You've finished the book!");
        currentPage = 0;
    }
    loadPage();
}

window.onload = loadPage;
