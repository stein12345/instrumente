// Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Aktive Navigation entfernen
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Neue aktive Navigation setzen
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
});

// Audio-Funktionalität für Hörbeispiele
function playSound(instrument) {
    // Hier würden echte Audio-Dateien abgespielt werden
    // Für Demo-Zwecke verwenden wir Web Audio API mit synthetischen Tönen
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Verschiedene Frequenzen für verschiedene Instrumente
    const frequencies = {
        'klavier': 440, // A4
        'gitarre': 330, // E4
        'floete': 880,  // A5
        'trommel': 150, // Niedrige Frequenz für Trommel
        'violine': 660, // E5
        'saxophon': 220 // A3
    };
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequencies[instrument], audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Envelope für natürlicheren Klang
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
    
    // Visuelles Feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '🎵 Wird abgespielt...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
}

// Quiz-Funktionalität
class MusicQuiz {
    constructor() {
        this.instruments = ['klavier', 'gitarre', 'floete', 'trommel', 'violine', 'saxophon'];
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];
        this.isPlaying = false;
        
        this.initializeQuiz();
        this.bindEvents();
    }
    
    initializeQuiz() {
        // Quiz-Fragen erstellen (zufällige Reihenfolge der Instrumente)
        this.questions = [...this.instruments].sort(() => Math.random() - 0.5);
    }
    
    bindEvents() {
        const startBtn = document.getElementById('startQuiz');
        const nextBtn = document.getElementById('nextQuestion');
        const restartBtn = document.getElementById('restartQuiz');
        const playAudioBtn = document.getElementById('playAudio');
        
        startBtn.addEventListener('click', () => this.startQuiz());
        nextBtn.addEventListener('click', () => this.nextQuestion());
        restartBtn.addEventListener('click', () => this.restartQuiz());
        playAudioBtn.addEventListener('click', () => this.playCurrentAudio());
        
        // Quiz-Optionen
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => this.checkAnswer(e.target));
        });
    }
    
    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.initializeQuiz();
        
        document.getElementById('startQuiz').style.display = 'none';
        document.getElementById('quizQuestion').style.display = 'block';
        document.getElementById('quizResults').style.display = 'none';
        
        this.showQuestion();
    }
    
    showQuestion() {
        const currentInstrument = this.questions[this.currentQuestion];
        const questionText = document.querySelector('#quizQuestion h3');
        questionText.textContent = `Frage ${this.currentQuestion + 1} von ${this.questions.length}: Welches Instrument hörst du?`;
        
        // Quiz-Optionen zurücksetzen
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('correct', 'incorrect');
            option.disabled = false;
        });
        
        document.getElementById('nextQuestion').style.display = 'none';
    }
    
    playCurrentAudio() {
        if (this.isPlaying) return;
        
        const currentInstrument = this.questions[this.currentQuestion];
        const playBtn = document.getElementById('playAudio');
        const originalText = playBtn.textContent;
        
        this.isPlaying = true;
        playBtn.textContent = '🎵 Wird abgespielt...';
        playBtn.disabled = true;
        
        // Audio abspielen
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        const frequencies = {
            'klavier': 440,
            'gitarre': 330,
            'floete': 880,
            'trommel': 150,
            'violine': 660,
            'saxophon': 220
        };
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequencies[currentInstrument], audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
        
        setTimeout(() => {
            playBtn.textContent = originalText;
            playBtn.disabled = false;
            this.isPlaying = false;
        }, 1000);
    }
    
    checkAnswer(selectedOption) {
        const currentInstrument = this.questions[this.currentQuestion];
        const selectedInstrument = selectedOption.getAttribute('data-instrument');
        
        // Alle Optionen deaktivieren
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.disabled = true;
        });
        
        if (selectedInstrument === currentInstrument) {
            selectedOption.classList.add('correct');
            this.score++;
        } else {
            selectedOption.classList.add('incorrect');
            // Richtige Antwort markieren
            document.querySelector(`[data-instrument="${currentInstrument}"]`).classList.add('correct');
        }
        
        // Nächste Frage Button anzeigen
        document.getElementById('nextQuestion').style.display = 'inline-block';
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion >= this.questions.length) {
            this.showResults();
        } else {
            this.showQuestion();
        }
    }
    
    showResults() {
        document.getElementById('quizQuestion').style.display = 'none';
        document.getElementById('quizResults').style.display = 'block';
        
        document.getElementById('score').textContent = this.score;
        document.getElementById('total').textContent = this.questions.length;
        
        // Motivierende Nachricht basierend auf Ergebnis
        const resultsDiv = document.getElementById('quizResults');
        const message = this.getResultMessage();
        if (!resultsDiv.querySelector('.result-message')) {
            const messageElement = document.createElement('p');
            messageElement.className = 'result-message';
            messageElement.textContent = message;
            resultsDiv.insertBefore(messageElement, resultsDiv.querySelector('button'));
        }
    }
    
    getResultMessage() {
        const percentage = (this.score / this.questions.length) * 100;
        
        if (percentage === 100) {
            return '🎉 Perfekt! Du kennst alle Instrumente sehr gut!';
        } else if (percentage >= 80) {
            return '👍 Sehr gut! Du hast ein gutes Gehör für Musikinstrumente!';
        } else if (percentage >= 60) {
            return '👌 Gut gemacht! Mit etwas Übung wirst du noch besser!';
        } else {
            return '📚 Übe weiter! Höre dir die Hörbeispiele nochmal genau an!';
        }
    }
    
    restartQuiz() {
        document.getElementById('startQuiz').style.display = 'inline-block';
        document.getElementById('quizQuestion').style.display = 'none';
        document.getElementById('quizResults').style.display = 'none';
        
        // Quiz-Optionen zurücksetzen
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('correct', 'incorrect');
            option.disabled = false;
        });
    }
}

// Quiz initialisieren
document.addEventListener('DOMContentLoaded', function() {
    new MusicQuiz();
});

// Zusätzliche Interaktivität für Instrument-Karten
document.addEventListener('DOMContentLoaded', function() {
    const instrumentCards = document.querySelectorAll('.instrument-card');
    
    instrumentCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Nur reagieren, wenn nicht auf den Play-Button geklickt wurde
            if (!e.target.classList.contains('play-btn')) {
                const instrument = this.getAttribute('data-instrument');
                playSound(instrument);
            }
        });
    });
});

// Smooth Scrolling für Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 