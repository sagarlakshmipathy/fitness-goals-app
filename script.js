// Workout data structure
const workoutData = {
    1: {
        title: "Day 1 - Chest & Triceps",
        exercises: [
            {
                name: "Push Ups",
                description: "Classic bodyweight exercise targeting chest, shoulders, and triceps.",
                weightRange: "Bodyweight",
                tips: "Keep your body in a straight line from head to heels. Lower until chest nearly touches the ground."
            },
            {
                name: "Dumbbell Bench Press",
                description: "Fundamental chest exercise using dumbbells for better range of motion.",
                weightRange: "8-15 lbs per dumbbell",
                tips: "Control the weight down slowly, press up explosively. Keep shoulder blades squeezed together."
            },
            {
                name: "Incline Dumbbell Press",
                description: "Targets upper chest and front deltoids effectively.",
                weightRange: "5-12 lbs per dumbbell",
                tips: "Set bench to 30-45 degree angle. Press up and slightly together at the top."
            },
            {
                name: "Tricep Dips",
                description: "Bodyweight exercise that targets triceps and chest.",
                weightRange: "Bodyweight",
                tips: "Keep elbows close to body. Lower until upper arms are parallel to ground."
            },
            {
                name: "Overhead Tricep Extension",
                description: "Isolation exercise for triceps using dumbbell.",
                weightRange: "5-10 lbs",
                tips: "Keep elbows stationary and close to head. Lower weight behind head slowly."
            }
        ]
    },
    2: {
        title: "Day 2 - Lats & Biceps",
        exercises: [
            {
                name: "Bent Over Dumbbell Rows",
                description: "Compound movement targeting lats, rhomboids, and rear delts.",
                weightRange: "8-15 lbs per dumbbell",
                tips: "Hinge at hips, keep back straight. Pull dumbbells to ribs, squeeze shoulder blades."
            },
            {
                name: "Single Arm Dumbbell Row",
                description: "Unilateral back exercise for better muscle activation.",
                weightRange: "10-18 lbs",
                tips: "Support yourself on bench. Pull dumbbell to hip, keep core tight."
            },
            {
                name: "Lat Pulldowns (Resistance Band)",
                description: "Targets latissimus dorsi using resistance band.",
                weightRange: "Medium resistance band",
                tips: "Pull band down to chest, squeeze lats at bottom. Control the return."
            },
            {
                name: "Bicep Curls",
                description: "Classic isolation exercise for biceps.",
                weightRange: "5-12 lbs per dumbbell",
                tips: "Keep elbows at sides. Curl with control, squeeze at top, lower slowly."
            },
            {
                name: "Hammer Curls",
                description: "Targets biceps and forearms with neutral grip.",
                weightRange: "5-12 lbs per dumbbell",
                tips: "Keep palms facing each other. Curl up without rotating wrists."
            }
        ]
    },
    3: {
        title: "Day 3 - Legs & Shoulders",
        exercises: [
            {
                name: "Bodyweight Squats",
                description: "Fundamental leg exercise targeting quads, glutes, and hamstrings.",
                weightRange: "Bodyweight",
                tips: "Feet shoulder-width apart. Lower until thighs parallel to ground, drive through heels."
            },
            {
                name: "Goblet Squats",
                description: "Squat variation holding weight at chest level.",
                weightRange: "8-20 lbs dumbbell",
                tips: "Hold dumbbell at chest. Keep torso upright throughout the movement."
            },
            {
                name: "Lunges",
                description: "Unilateral leg exercise for strength and balance.",
                weightRange: "Bodyweight or 5-10 lbs per hand",
                tips: "Step forward, lower back knee toward ground. Push off front foot to return."
            },
            {
                name: "Shoulder Press",
                description: "Overhead pressing movement for shoulders.",
                weightRange: "5-12 lbs per dumbbell",
                tips: "Press dumbbells overhead, keep core tight. Lower to shoulder level with control."
            },
            {
                name: "Lateral Raises",
                description: "Isolation exercise for shoulder development.",
                weightRange: "3-8 lbs per dumbbell",
                tips: "Raise arms to sides until parallel to ground. Control the weight down slowly."
            },
            {
                name: "Glute Bridges",
                description: "Targets glutes and hamstrings effectively.",
                weightRange: "Bodyweight or 8-15 lbs on hips",
                tips: "Squeeze glutes at top, hold for a second. Lower slowly with control."
            }
        ]
    }
};

// DOM elements
const daySelection = document.querySelector('.day-selection');
const workoutDetails = document.getElementById('workout-details');
const exerciseDetails = document.getElementById('exercise-details');
const backButton = document.getElementById('back-button');
const exerciseBackButton = document.getElementById('exercise-back-button');
const workoutCompleteModal = document.getElementById('workout-complete-modal');
const closeModalButton = document.getElementById('close-modal');

// Current state
let currentDay = null;
let currentExercise = null;

// Progress tracking
let workoutProgress = {};
let workoutHistory = [];

// Initialize progress from localStorage
function initializeProgress() {
    const savedProgress = localStorage.getItem('fitnessProgress');
    const savedHistory = localStorage.getItem('fitnessHistory');
    
    if (savedProgress) {
        workoutProgress = JSON.parse(savedProgress);
    } else {
        // Initialize empty progress structure
        workoutProgress = {
            1: {},
            2: {},
            3: {}
        };
        workoutData[1].exercises.forEach((_, index) => {
            workoutProgress[1][index] = { completed: false, sets: [false, false, false, false] };
        });
        workoutData[2].exercises.forEach((_, index) => {
            workoutProgress[2][index] = { completed: false, sets: [false, false, false, false] };
        });
        workoutData[3].exercises.forEach((_, index) => {
            workoutProgress[3][index] = { completed: false, sets: [false, false, false, false] };
        });
        saveProgress();
    }
    
    if (savedHistory) {
        workoutHistory = JSON.parse(savedHistory);
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('fitnessProgress', JSON.stringify(workoutProgress));
    localStorage.setItem('fitnessHistory', JSON.stringify(workoutHistory));
}

// Add workout completion to history
function addToHistory(dayNumber, completedExercises) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const historyEntry = {
        date: today,
        day: dayNumber,
        dayTitle: workoutData[dayNumber].title,
        exercisesCompleted: completedExercises,
        totalExercises: workoutData[dayNumber].exercises.length
    };
    
    // Remove any existing entry for today and this day
    workoutHistory = workoutHistory.filter(entry => 
        !(entry.date === today && entry.day === dayNumber)
    );
    
    // Add new entry
    workoutHistory.push(historyEntry);
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    workoutHistory = workoutHistory.filter(entry => 
        new Date(entry.date) >= thirtyDaysAgo
    );
    
    saveProgress();
}

// Export progress data for backup
function exportProgress() {
    const data = {
        progress: workoutProgress,
        history: workoutHistory,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import progress data from backup
function importProgress(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.progress && data.history) {
                workoutProgress = data.progress;
                workoutHistory = data.history;
                saveProgress();
                alert('Progress imported successfully!');
                location.reload();
            } else {
                alert('Invalid backup file format.');
            }
        } catch (error) {
            alert('Error reading backup file.');
        }
    };
    reader.readAsText(file);
}

// Event listeners
daySelection.addEventListener('click', handleDaySelection);
backButton.addEventListener('click', showDaySelection);
exerciseBackButton.addEventListener('click', showWorkoutDetails);
closeModalButton.addEventListener('click', closeModal);

// Settings menu listeners
document.getElementById('settings-btn').addEventListener('click', toggleSettings);
document.getElementById('history-back-button').addEventListener('click', showDaySelection);

function toggleSettings() {
    const dropdown = document.getElementById('settings-dropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Close settings when clicking outside
document.addEventListener('click', function(event) {
    const settingsMenu = document.querySelector('.settings-menu');
    if (!settingsMenu.contains(event.target)) {
        document.getElementById('settings-dropdown').style.display = 'none';
    }
});

// Show workout history
function showHistory() {
    document.getElementById('settings-dropdown').style.display = 'none';
    
    // Hide other views
    daySelection.style.display = 'none';
    workoutDetails.style.display = 'none';
    exerciseDetails.style.display = 'none';
    document.getElementById('history-view').style.display = 'block';
    
    // Generate history stats
    generateHistoryStats();
    
    // Generate history list
    generateHistoryList();
}

function generateHistoryStats() {
    const statsContainer = document.getElementById('history-stats');
    const totalWorkouts = workoutHistory.length;
    const uniqueDays = [...new Set(workoutHistory.map(entry => entry.date))].length;
    const thisWeek = getThisWeekWorkouts();
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <span class="stat-number">${totalWorkouts}</span>
            <div class="stat-label">Total Workouts</div>
        </div>
        <div class="stat-card">
            <span class="stat-number">${uniqueDays}</span>
            <div class="stat-label">Days Active</div>
        </div>
        <div class="stat-card">
            <span class="stat-number">${thisWeek}</span>
            <div class="stat-label">This Week</div>
        </div>
    `;
}

function generateHistoryList() {
    const listContainer = document.getElementById('history-list');
    
    if (workoutHistory.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #666;">No workout history yet. Complete your first workout!</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedHistory = [...workoutHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    listContainer.innerHTML = sortedHistory.map(entry => `
        <div class="history-item">
            <div class="history-date">${formatDate(entry.date)}</div>
            <div class="history-details">
                ${entry.dayTitle} - ${entry.exercisesCompleted}/${entry.totalExercises} exercises completed
            </div>
        </div>
    `).join('');
}

function getThisWeekWorkouts() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return workoutHistory.filter(entry => 
        new Date(entry.date) >= oneWeekAgo
    ).length;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Reset progress function
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        localStorage.removeItem('fitnessProgress');
        localStorage.removeItem('fitnessHistory');
        location.reload();
    }
}

function handleDaySelection(event) {
    const dayCard = event.target.closest('.day-card');
    if (!dayCard) return;
    
    const day = parseInt(dayCard.dataset.day);
    currentDay = day;
    showWorkoutDetails();
}

function showDaySelection() {
    daySelection.style.display = 'flex';
    workoutDetails.style.display = 'none';
    exerciseDetails.style.display = 'none';
    currentDay = null;
    currentExercise = null;
    updateDayCompletionStatus();
}

function showWorkoutDetails() {
    if (!currentDay) return;
    
    const workout = workoutData[currentDay];
    
    // Update workout title
    document.getElementById('workout-title').textContent = workout.title;
    
    // Clear and populate exercises list
    const exercisesList = document.getElementById('exercises-list');
    exercisesList.innerHTML = '';
    
    workout.exercises.forEach((exercise, index) => {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.dataset.exerciseIndex = index;
        
        // Check if exercise is completed
        if (workoutProgress[currentDay][index] && workoutProgress[currentDay][index].completed) {
            exerciseItem.classList.add('completed');
        }
        
        exerciseItem.innerHTML = `
            <h4>${exercise.name}</h4>
            <p>${exercise.description}</p>
        `;
        
        exerciseItem.addEventListener('click', () => showExerciseDetails(index));
        exercisesList.appendChild(exerciseItem);
    });
    
    // Show workout details, hide others
    daySelection.style.display = 'none';
    workoutDetails.style.display = 'block';
    exerciseDetails.style.display = 'none';
    
    // Add fade-in animation
    workoutDetails.classList.add('fade-in');
    setTimeout(() => workoutDetails.classList.remove('fade-in'), 300);
}

function showExerciseDetails(exerciseIndex) {
    if (!currentDay) return;
    
    currentExercise = exerciseIndex;
    const exercise = workoutData[currentDay].exercises[exerciseIndex];
    
    // Update exercise details
    document.getElementById('exercise-name').textContent = exercise.name;
    document.getElementById('weight-range').textContent = exercise.weightRange;
    
    // Update description
    const descriptionEl = document.getElementById('exercise-description');
    descriptionEl.innerHTML = `
        <h4>How to perform:</h4>
        <p>${exercise.description}</p>
        <p><strong>Tips:</strong> ${exercise.tips}</p>
    `;
    
    // Generate set tracker
    generateSetTracker(exerciseIndex);
    
    // Show exercise details, hide others
    daySelection.style.display = 'none';
    workoutDetails.style.display = 'none';
    exerciseDetails.style.display = 'block';
    
    // Add fade-in animation
    exerciseDetails.classList.add('fade-in');
    setTimeout(() => exerciseDetails.classList.remove('fade-in'), 300);
}

function generateSetTracker(exerciseIndex) {
    const setsGrid = document.getElementById('sets-grid');
    const totalSets = 4;
    
    setsGrid.innerHTML = '';
    
    // Reset tracker appearance for new exercise
    const tracker = document.getElementById('set-tracker');
    tracker.style.background = '#f0f8ff';
    tracker.style.borderColor = '#e6f3ff';
    
    for (let i = 0; i < totalSets; i++) {
        const setItem = document.createElement('div');
        setItem.className = 'set-item';
        setItem.dataset.setIndex = i;
        
        // Check if set is completed
        if (workoutProgress[currentDay][exerciseIndex] && 
            workoutProgress[currentDay][exerciseIndex].sets[i]) {
            setItem.classList.add('completed');
        }
        
        setItem.innerHTML = `
            <div class="set-number">Set ${i + 1}</div>
            <div class="set-checkbox">${setItem.classList.contains('completed') ? '✓' : '○'}</div>
        `;
        
        setItem.addEventListener('click', () => toggleSet(exerciseIndex, i));
        setsGrid.appendChild(setItem);
    }
    
    updateSetProgress(exerciseIndex);
    
    // Show completion feedback if exercise is already completed
    if (workoutProgress[currentDay][exerciseIndex] && 
        workoutProgress[currentDay][exerciseIndex].completed) {
        showExerciseCompletionFeedback();
    }
}

function toggleSet(exerciseIndex, setIndex) {
    // Initialize if doesn't exist
    if (!workoutProgress[currentDay][exerciseIndex]) {
        workoutProgress[currentDay][exerciseIndex] = {
            completed: false,
            sets: [false, false, false, false]
        };
    }
    
    // Toggle set completion
    workoutProgress[currentDay][exerciseIndex].sets[setIndex] = 
        !workoutProgress[currentDay][exerciseIndex].sets[setIndex];
    
    // Update UI
    const setItem = document.querySelector(`[data-set-index="${setIndex}"]`);
    const checkbox = setItem.querySelector('.set-checkbox');
    
    if (workoutProgress[currentDay][exerciseIndex].sets[setIndex]) {
        setItem.classList.add('completed');
        checkbox.textContent = '✓';
    } else {
        setItem.classList.remove('completed');
        checkbox.textContent = '○';
    }
    
    // Check if exercise is complete
    checkExerciseCompletion(exerciseIndex);
    updateSetProgress(exerciseIndex);
    saveProgress();
}

function updateSetProgress(exerciseIndex) {
    const completedSets = workoutProgress[currentDay][exerciseIndex] 
        ? workoutProgress[currentDay][exerciseIndex].sets.filter(set => set).length 
        : 0;
    
    const progress = document.getElementById('exercise-progress');
    
    // Reset progress display style
    progress.style.background = '#f8f9ff';
    progress.style.color = '#667eea';
    
    // Check if exercise is completed
    if (workoutProgress[currentDay][exerciseIndex] && 
        workoutProgress[currentDay][exerciseIndex].completed) {
        progress.innerHTML = '<strong>🎉 Exercise Complete! Great job!</strong>';
        progress.style.background = '#4caf50';
        progress.style.color = 'white';
    } else {
        progress.innerHTML = `<span id="completed-sets">${completedSets}</span> of <span id="total-sets">4</span> sets completed`;
    }
}

function checkExerciseCompletion(exerciseIndex) {
    const exerciseProgress = workoutProgress[currentDay][exerciseIndex];
    const allSetsCompleted = exerciseProgress.sets.every(set => set);
    
    if (allSetsCompleted && !exerciseProgress.completed) {
        // Mark exercise as completed
        exerciseProgress.completed = true;
        
        // Show completion feedback
        showExerciseCompletionFeedback();
        
        // Check if entire workout is complete
        setTimeout(() => checkWorkoutCompletion(), 1000);
    } else if (!allSetsCompleted && exerciseProgress.completed) {
        // Mark exercise as incomplete if sets were unchecked
        exerciseProgress.completed = false;
    }
}

function showExerciseCompletionFeedback() {
    const tracker = document.getElementById('set-tracker');
    tracker.style.background = '#e8f5e8';
    tracker.style.borderColor = '#4caf50';
    
    const progress = document.getElementById('exercise-progress');
    progress.innerHTML = '<strong>🎉 Exercise Complete! Great job!</strong>';
    progress.style.background = '#4caf50';
    progress.style.color = 'white';
}

function checkWorkoutCompletion() {
    const dayExercises = workoutData[currentDay].exercises;
    const allExercisesCompleted = dayExercises.every((_, index) => 
        workoutProgress[currentDay][index] && workoutProgress[currentDay][index].completed
    );
    
    if (allExercisesCompleted) {
        showWorkoutCompleteModal();
    }
}

function showWorkoutCompleteModal() {
    const dayTitle = workoutData[currentDay].title;
    const totalExercises = workoutData[currentDay].exercises.length;
    
    // Add to history
    addToHistory(currentDay, totalExercises);
    
    document.getElementById('completion-message').textContent = 
        `Amazing job! You've completed all exercises for ${dayTitle}.`;
    
    workoutCompleteModal.style.display = 'flex';
}

function closeModal() {
    workoutCompleteModal.style.display = 'none';
    showDaySelection();
}

function updateDayCompletionStatus() {
    document.querySelectorAll('.day-card').forEach(card => {
        const day = parseInt(card.dataset.day);
        const dayExercises = workoutData[day].exercises;
        const allExercisesCompleted = dayExercises.every((_, index) => 
            workoutProgress[day][index] && workoutProgress[day][index].completed
        );
        
        if (allExercisesCompleted) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeProgress();
    showDaySelection();
});