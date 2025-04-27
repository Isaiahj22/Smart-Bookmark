let speaking = false;
let language = 'english';
let currentPage = 0;
let storyText = '';  // holds the story content

// Load page dynamically from backend
async function loadPage() {
    const response = await fetch(`/story/book001?lang=${language}`);
    const data = await response.json();

    if (data.story) {
        storyText = data.story;
        const pageTextDiv = document.getElementById('pageText');

        // Split words into spans
        pageTextDiv.innerHTML = storyText.split(" ").map(word => `<span>${word}</span>`).join(" ");
        
        document.getElementById('animationArea').innerHTML = "";
        document.getElementById('quizArea').innerHTML = "";
    } else {
        document.getElementById('pageText').innerText = "No story found!";
    }

    showVocabulary();
}

// Start Read-Along
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

// Stop Read-Along
function stopReadAlong() {
    speaking = false;
    speechSynthesis.cancel();
    const spans = document.querySelectorAll('#pageText span');
    spans.forEach(span => span.classList.remove('highlight'));
}

// Toggle Language
function toggleLanguage() {
    language = (language === 'english') ? 'spanish' : 'english';
    loadPage();
}

// Show Animation
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

// Show Vocabulary
function showVocabulary() {
    const pageVocab = {
        "paradise": { english: "paradise", spanish: "paraíso" },
        "collected": { english: "collected", spanish: "recogía" },
        "children": { english: "children", spanish: "niños" },
        "library": { english: "library", spanish: "biblioteca" },
        "knowledge": { english: "knowledge", spanish: "conocimiento" }
    };

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

// Launch Quiz
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

// Move to Next Page
function nextPage() {
    currentPage++;
    if (currentPage >= 1) {  // only one page for now
        alert("🎉 You've finished the book!");
        currentPage = 0;
    }
    loadPage();
}

// Load the first page when page loads
window.onload = loadPage;
