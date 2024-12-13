document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const gameContainer = document.getElementById('game-container');
  const leaderboardContainer = document.getElementById('leaderboard-container');
  const puzzleQuestion = document.getElementById('puzzle-question');
  const playerInput = document.getElementById('player-input');
  const answerInput = document.getElementById('answer-input');
  const progressBar = document.querySelector('.progress');
  const hintButton = document.getElementById('hint-button');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  let playerName = '';
  let currentPuzzle = null;

  const fetchPuzzles = async () => {
      const response = await fetch('/api/puzzles');
      return response.json();
  };

  const fetchHint = async (puzzleId) => {
      const response = await fetch(`/api/hints/${puzzleId}`);
      const data = await response.json();
      return data.hint;
  };

  const loadRandomPuzzle = async () => {
      const puzzles = await fetchPuzzles();
      currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      puzzleQuestion.textContent = currentPuzzle.question;
      answerInput.value = '';
  };

  const submitAnswer = async () => {
      const response = await fetch('/api/submit-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentPuzzle.id, answer: answerInput.value, player: playerName }),
      });
      const result = await response.json();

      if (result.correct) {
          alert('Correct! Moving to the next puzzle.');
          updateProgress();
          await loadRandomPuzzle();
      } else {
          alert('Incorrect. Try again.');
      }
  };

  const updateProgress = () => {
      const currentWidth = parseInt(progressBar.style.width || '0%');
      const newWidth = Math.min(currentWidth + 20, 100);
      progressBar.style.width = `${newWidth}%`;
  };

  const toggleDarkMode = () => {
      document.body.classList.toggle('dark-mode');
  };

  const showHint = async () => {
      if (!currentPuzzle) return;
      const hint = await fetchHint(currentPuzzle.id);
      alert(`Hint: ${hint}`);
  };

  // Event Listeners
  document.getElementById('start-button').addEventListener('click', () => {
      playerName = playerInput.value.trim();
      if (!playerName) {
          alert('Please enter your name!');
          return;
      }
      startScreen.style.display = 'none';
      gameContainer.style.display = 'block';
      loadRandomPuzzle();
  });

  document.getElementById('submit-button').addEventListener('click', submitAnswer);
  darkModeToggle.addEventListener('click', toggleDarkMode);
  hintButton.addEventListener('click', showHint);
});
