const typing_ground = document.querySelector('#textarea');
const btn = document.querySelector('#btn');
const result = document.querySelector('#result');
const displaySentence = document.querySelector('#displaySentence');
const historyTableBody = document.querySelector('#history tbody');
const timerDisplay = document.querySelector('#timer');

let startTime, endTime, totalTimeTaken;
let targetSentence = "";
let testCount = 0; // Counter for the number of tests
let timerInterval;

const sentences = [
    'The waves gently lapped at the shore as the sun set over the horizon.',
    'She opened the door to find a package waiting on her doorstep, neatly wrapped in brown paper.',
    'The wind whistled through the trees as the storm clouds gathered overhead.',
    'He took a deep breath and stepped onto the stage, his heart pounding in his chest.',
    'The library was quiet except for the soft rustling of pages being turned.',
    'She watched as the snowflakes fell softly outside the window, covering the ground in a white blanket.',
    'The city skyline was bathed in a golden glow as the sun dipped below the horizon.',
    'As the rain poured down, the streetlights reflected in the puddles on the sidewalk.',
    'He stood at the edge of the cliff, staring out at the vast expanse of ocean stretching to the horizon.',
    'The air was crisp and cool as they hiked up the mountain trail, leaves crunching underfoot.',
    'The old clock ticked loudly in the quiet room, its pendulum swinging back and forth rhythmically.',
    'She smiled as she watched the children chase each other around the playground, their laughter echoing in the air.',
    'The sound of the train whistle echoed through the valley, signaling its approach.',
    'He sat by the fire, warming his hands, as the wind howled outside the cabin.',
    'The garden was in full bloom, with vibrant flowers swaying gently in the breeze.',
    'The bustling marketplace was filled with the sounds of vendors calling out and the scent of fresh spices.',
    'The forest was alive with the sounds of birds chirping and leaves rustling in the wind.',
    'The stars twinkled in the clear night sky as they lay on the grass, gazing upwards.',
    'She carefully unwrapped the delicate vase, admiring its intricate design.',
    'The waves crashed against the rocky shore, sending spray high into the air.',
    'The smell of fresh bread filled the kitchen, making her stomach growl with hunger.',
    'He scribbled notes furiously as the professor lectured at the front of the classroom.',
    'The cat curled up in the patch of sunlight streaming through the window, purring contentedly.',
    'She stood at the train station, suitcase in hand, waiting for her train to arrive.',
    'The sound of thunder rumbled in the distance as dark clouds rolled in.',
    'He flipped through the old photo album, smiling at the memories captured in each image.',
    'The canoe glided smoothly across the calm lake, leaving ripples in its wake.',
    'She sipped her coffee as she watched the rain fall outside the café window.',
    'The fire crackled and popped in the fireplace, casting a warm glow throughout the room.',
    'He carefully folded the map and slipped it into his backpack before setting off on his hike.',
    'The bustling airport was filled with the sound of announcements and the hum of travelers rushing to their gates.',
    'The sunflowers stood tall in the field, their bright yellow heads turned towards the sky.',
    'The distant sound of church bells filled the air, signaling the start of the Sunday service.',
    'She brushed the dust off the old book before opening it to the first page.',
    'The hot air balloon rose slowly into the sky, offering a bird’s-eye view of the landscape below.',
    'The scent of freshly cut grass filled the air as he mowed the lawn on a sunny afternoon.',
    'The cobblestone streets were lined with charming old houses, their windows adorned with flower boxes.',
    'The peaceful sound of the river flowing by was accompanied by the occasional splash of a fish jumping.',
    'She wrapped her scarf tightly around her neck as the cold wind bit at her face.',
    'The concert hall was filled with the sound of the orchestra tuning their instruments.',
    'The little dog barked excitedly as it chased after the ball, its tail wagging furiously.',
    'He sat at his desk, staring at the blank page in front of him, waiting for inspiration to strike.',
    'The leaves crunched beneath her feet as she walked through the forest, the air crisp with the scent of pine.',
    'The sound of the waves crashing against the shore was calming, a rhythmic lullaby from the sea.',
    'The sun peeked through the curtains, casting a warm glow across the room as the day began.',
    'He watched as the plane soared into the sky, disappearing into the clouds.',
    'The quiet hum of the refrigerator was the only sound in the dark kitchen.',
    'The moon hung low in the sky, casting long shadows across the deserted street.',
    'She gently placed the baby in the crib, watching as it slept peacefully.',
    'The sound of footsteps echoed through the empty hallway, growing louder with each passing second.'
    ];

// Function to calculate typing speed and accuracy
const calculateTypingSpeed = (time_taken) => {
    let typedWords = typing_ground.value.trim().split(" ");
    let targetWords = targetSentence.trim().split(" ");
    let correctWords = 0;

    // Calculate characters
    let typedChars = typing_ground.value.split('');
    let totalChars = targetSentence.length;
    let correctChars = 0;
    let wrongChars = 0;

    // Compare each word with the target sentence
    typedWords.forEach((word, index) => {
        if (word.toLowerCase() === targetWords[index]?.toLowerCase()) {
            correctWords++;
        }
    });

    // Calculate correct and wrong characters
    typedChars.forEach((char, index) => {
        if (index < totalChars) {
            if (char === targetSentence[index]) {
                correctChars++;
            } else {
                wrongChars++;
            }
        } else {
            wrongChars++;
        }
    });

    let actualWords = typedWords.length;
    let typing_speed = (correctWords / time_taken) * 60;
    typing_speed = Math.round(typing_speed);

    let accuracy = ((correctWords / targetWords.length) * 100).toFixed(2);
    let wrongWords = actualWords - correctWords;

    // Display the result in the results section
    result.innerHTML = `
        <li>Your typing speed is <strong>${typing_speed} WPM</strong></li>
        <li>Accuracy rate: <strong>${accuracy}%</strong></li>
        <li>Total time taken: <strong>${time_taken} seconds</strong></li>
        <li>Correct words: <strong>${correctWords}</strong> out of <strong>${targetWords.length}</strong></li>
        <li>Wrong words: <strong>${wrongWords}</strong></li>
    `;

    // Add the results to the history table
    addToHistory(typing_speed, time_taken, accuracy, targetWords.length, correctWords, wrongWords, totalChars, correctChars, wrongChars);
};

// Function to highlight typing progress
const highlightText = (typedText) => {
    let highlightedText = "";

    for (let i = 0; i < targetSentence.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === targetSentence[i]) {
                highlightedText += `<span class="correct">${targetSentence[i]}</span>`;
            } else {
                highlightedText += `<span class="incorrect">${targetSentence[i]}</span>`;
            }
        } else {
            highlightedText += targetSentence[i];
        }
    }

    displaySentence.innerHTML = highlightedText;
};

// Function to end typing test
const endTypingTest = () => {
    clearInterval(timerInterval);
    btn.innerText = "Start";

    let date = new Date();
    endTime = date.getTime();
    totalTimeTaken = (endTime - startTime) / 1000;

    calculateTypingSpeed(totalTimeTaken);

    displaySentence.innerHTML = "";
    typing_ground.value = "";
};

// Function to start typing test
const startTyping = () => {
    let randomNumber = Math.floor(Math.random() * sentences.length);
    targetSentence = sentences[randomNumber];
    displaySentence.innerHTML = targetSentence;

    let date = new Date();
    startTime = date.getTime();

    btn.innerText = "Done";
    typing_ground.removeAttribute('disabled');
    typing_ground.focus();
    typing_ground.value = "";
    currentCharIndex = 0;

    // Start the timer
    startTimer();
};

// Function to start the timer
const startTimer = () => {
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds += 0.1; // Increase seconds by 0.1 for accuracy
        timerDisplay.innerText = `Time: ${seconds.toFixed(2)} seconds`; // Display time
    }, 100); // Update every 100ms
};

// Function to add results to history
const addToHistory = (speed, time, accuracy, totalWords, correctWords, wrongWords, totalChars, correctChars, wrongChars) => {
    testCount++;
    // Create a new row for the history table
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${testCount}</td>
        <td>${speed}</td>
        <td>${time.toFixed(2)}</td>
        <td>${accuracy}</td>
        <td>${totalWords}</td>
        <td>${correctWords}</td>
        <td>${wrongWords}</td>
        <td>${totalChars}</td>
        <td>${correctChars}</td>
        <td>${wrongChars}</td>
    `;
    // Append the new row to the history table body
    historyTableBody.appendChild(newRow);

    // Limit the history to the last 10 tests
    if (historyTableBody.rows.length > 10) {
        historyTableBody.deleteRow(0); // Remove the first row if more than 10
    }
};

// Button click handler
btn.addEventListener('click', () => {
    switch (btn.innerText.toLowerCase()) {
        case "start":
            startTyping();
            break;

        case "done":
            typing_ground.setAttribute('disabled', 'true');
            endTypingTest();
            break;
    }
});

// Event listener to handle real-time text input and update highlights
typing_ground.addEventListener('input', () => {
    let typedText = typing_ground.value;
    highlightText(typedText);
});
