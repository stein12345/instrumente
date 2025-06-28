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

// Verbesserte Audio-Funktionalität mit charakteristischen Klängen
function playSound(instrument) {
    const audioId = `audio-${instrument}`;
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0;
        audio.play();
        // Visuelles Feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '🎵 Wird abgespielt...';
        button.disabled = true;
        audio.onended = () => {
            button.textContent = originalText;
            button.disabled = false;
        };
    }
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
        
        // Verbesserte Audio-Wiedergabe mit charakteristischen Klängen
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const instrumentSounds = {
            'klavier': {
                frequencies: [261.63, 329.63, 392.00],
                type: 'triangle',
                duration: 2
            },
            'gitarre': {
                frequencies: [82.41, 110.00, 146.83, 196.00, 246.94, 329.63],
                type: 'sawtooth',
                duration: 1.5
            },
            'floete': {
                frequencies: [523.25, 659.25, 783.99],
                type: 'sine',
                duration: 2.5
            },
            'trommel': {
                frequencies: [60, 80, 100],
                type: 'square',
                duration: 0.8
            },
            'violine': {
                frequencies: [440.00, 493.88, 523.25],
                type: 'sine',
                duration: 2
            },
            'saxophon': {
                frequencies: [220.00, 246.94, 277.18],
                type: 'sawtooth',
                duration: 2.5
            }
        };
        
        const sound = instrumentSounds[currentInstrument];
        
        sound.frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Instrument-spezifische Filterung
            if (currentInstrument === 'klavier') {
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2000, audioContext.currentTime);
            } else if (currentInstrument === 'gitarre') {
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(800, audioContext.currentTime);
            } else if (currentInstrument === 'floete') {
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(400, audioContext.currentTime);
            } else if (currentInstrument === 'trommel') {
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(200, audioContext.currentTime);
            } else if (currentInstrument === 'violine') {
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(300, audioContext.currentTime);
            } else if (currentInstrument === 'saxophon') {
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1500, audioContext.currentTime);
            }
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = sound.type;
            
            const startTime = audioContext.currentTime + (index * 0.1);
            const endTime = startTime + sound.duration;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
            
            oscillator.start(startTime);
            oscillator.stop(endTime);
        });
        
        setTimeout(() => {
            playBtn.textContent = originalText;
            playBtn.disabled = false;
            this.isPlaying = false;
        }, sound.duration * 1000);
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