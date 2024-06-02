let score = 0;
let currentGenre = '';
let currentWord = '';
let hints = [];
let attempts = 0;

const genres = {
    business: 'business.json',
    highschool: 'highschool.json',
    middleschool: 'middleschool.json',
    elementary: 'elementary.json',
    random: 'random.json'
};

function startGame(genre) {
    currentGenre = genre;
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('genreTitle').innerText = genre;
    loadWord();
}

function loadWord() {
    fetch(genres[currentGenre])
        .then(response => response.json())
        .then(data => {
            const randomIndex = Math.floor(Math.random() * data.words.length);
            currentWord = data.words[randomIndex].word;
            hints = data.words[randomIndex].hints;
            document.getElementById('hint1').innerText = `ヒント1: ${hints[0]}`;
            document.getElementById('hint2').innerText = `ヒント2: ${hints[1]}`;
            document.getElementById('hint3').innerText = `ヒント3: ${hints[2]}`;
            document.getElementById('guessInput').value = ''; // 入力フィールドをクリア
            document.getElementById('guessInput').focus(); // 入力フィールドにフォーカス
        });
}

function submitGuess() {
    const guess = document.getElementById('guessInput').value;
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
        score++;
        document.getElementById('score').innerText = score;
        document.getElementById('message').innerText = '正解です！';
        setTimeout(() => {
            document.getElementById('message').innerText = '';
            loadWord();
        }, 2000);
    } else {
        attempts++;
        if (attempts >= 2) {
            gameOver('ゲームオーバー！');
        } else {
            document.getElementById('message').innerText = '間違いです。次の問題に進みます。';
            setTimeout(() => {
                document.getElementById('message').innerText = '';
                loadWord();
            }, 2000);
        }
    }
}

function gameOver(message) {
    document.getElementById('message').innerText = message;
    saveScore();
    setTimeout(() => {
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('titleScreen').style.display = 'block';
        document.getElementById('message').innerText = '';
        attempts = 0;
        loadRanking();
    }, 3000);
}

function saveScore() {
    const date = new Date().toLocaleString();
    const newScore = { score: score, date: date };
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('scores', JSON.stringify(scores));
}

function loadRanking() {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.slice(0, 10).forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. スコア: ${entry.score} - 日時: ${entry.date}`;
        rankingList.appendChild(listItem);
    });
}

// 初期化時にランキングを読み込む
window.onload = loadRanking;