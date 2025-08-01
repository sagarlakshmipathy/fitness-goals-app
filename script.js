// Workout data structure
const workoutData = {
    1: {
        title: "day 1 - chest & triceps",
        exercises: [
            {
                name: "push ups",
                description: "classic bodyweight exercise targeting chest, shoulders, and triceps.",
                weightRange: "bodyweight",
                tips: "keep your body in a straight line from head to heels. lower until chest nearly touches the ground."
            },
            {
                name: "dumbbell bench press",
                description: "fundamental chest exercise using dumbbells for better range of motion.",
                weightRange: "8-15 lbs per dumbbell",
                tips: "control the weight down slowly, press up explosively. keep shoulder blades squeezed together."
            },
            {
                name: "incline dumbbell press",
                description: "targets upper chest and front deltoids effectively.",
                weightRange: "5-12 lbs per dumbbell",
                tips: "set bench to 30-45 degree angle. press up and slightly together at the top."
            },
            {
                name: "tricep dips",
                description: "bodyweight exercise that targets triceps and chest.",
                weightRange: "bodyweight",
                tips: "keep elbows close to body. lower until upper arms are parallel to ground."
            },
            {
                name: "overhead tricep extension",
                description: "isolation exercise for triceps using dumbbell.",
                weightRange: "5-10 lbs",
                tips: "keep elbows stationary and close to head. lower weight behind head slowly."
            }
        ]
    },
    2: {
        title: "day 2 - lats & biceps",
        exercises: [
            {
                name: "bent over dumbbell rows",
                description: "compound movement targeting lats, rhomboids, and rear delts.",
                weightRange: "8-15 lbs per dumbbell",
                tips: "hinge at hips, keep back straight. pull dumbbells to ribs, squeeze shoulder blades."
            },
            {
                name: "single arm dumbbell row",
                description: "unilateral back exercise for better muscle activation.",
                weightRange: "10-18 lbs",
                tips: "support yourself on bench. pull dumbbell to hip, keep core tight."
            },
            {
                name: "lat pulldowns (resistance band)",
                description: "targets latissimus dorsi using resistance band.",
                weightRange: "medium resistance band",
                tips: "pull band down to chest, squeeze lats at bottom. control the return."
            },
            {
                name: "bicep curls",
                description: "classic isolation exercise for biceps.",
                weightRange: "5-12 lbs per dumbbell",
                tips: "keep elbows at sides. curl with control, squeeze at top, lower slowly."
            },
            {
                name: "hammer curls",
                description: "targets biceps and forearms with neutral grip.",
                weightRange: "5-12 lbs per dumbbell",
                tips: "keep palms facing each other. curl up without rotating wrists."
            }
        ]
    },
    3: {
        title: "day 3 - legs & shoulders",
        exercises: [
            {
                name: "bodyweight squats",
                description: "fundamental leg exercise targeting quads, glutes, and hamstrings.",
                weightRange: "bodyweight",
                tips: "feet shoulder-width apart. lower until thighs parallel to ground, drive through heels."
            },
            {
                name: "goblet squats",
                description: "squat variation holding weight at chest level.",
                weightRange: "8-20 lbs dumbbell",
                tips: "hold dumbbell at chest. keep torso upright throughout the movement."
            },
            {
                name: "lunges",
                description: "unilateral leg exercise for strength and balance.",
                weightRange: "bodyweight or 5-10 lbs per hand",
                tips: "step forward, lower back knee toward ground. push off front foot to return."
            },
            {
                name: "shoulder press",
                description: "overhead pressing movement for shoulders.",
                weightRange: "5-12 lbs per dumbbell",
                tips: "press dumbbells overhead, keep core tight. lower to shoulder level with control."
            },
            {
                name: "lateral raises",
                description: "isolation exercise for shoulder development.",
                weightRange: "3-8 lbs per dumbbell",
                tips: "raise arms to sides until parallel to ground. control the weight down slowly."
            },
            {
                name: "glute bridges",
                description: "targets glutes and hamstrings effectively.",
                weightRange: "bodyweight or 8-15 lbs on hips",
                tips: "squeeze glutes at top, hold for a second. lower slowly with control."
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
let exerciseSettings = {};

// Initialize progress from localStorage
function initializeProgress() {
    try {
        const savedProgress = localStorage.getItem('fitnessProgress');
        const savedHistory = localStorage.getItem('fitnessHistory');
        const savedSettings = localStorage.getItem('exerciseSettings');
        
        // Initialize or migrate progress data
        if (savedProgress) {
            workoutProgress = JSON.parse(savedProgress);
            // Migrate old data structure if needed
            migrateProgressData();
        } else {
            initializeEmptyProgress();
        }
        
        // Initialize history
        if (savedHistory) {
            workoutHistory = JSON.parse(savedHistory);
        }
        
        // Initialize or create exercise settings
        if (savedSettings) {
            exerciseSettings = JSON.parse(savedSettings);
        } else {
            initializeDefaultSettings();
        }
        
        // Ensure all data structures are valid
        validateDataStructures();
        saveProgress();
        
    } catch (error) {
        console.error('Error initializing progress, resetting to defaults:', error);
        resetToDefaults();
    }
}

function initializeEmptyProgress() {
    workoutProgress = {
        1: {},
        2: {},
        3: {}
    };
    [1, 2, 3].forEach(day => {
        workoutData[day].exercises.forEach((_, index) => {
            workoutProgress[day][index] = { completed: false, sets: [] };
        });
    });
}

function initializeDefaultSettings() {
    exerciseSettings = {};
    [1, 2, 3].forEach(day => {
        exerciseSettings[day] = {};
        workoutData[day].exercises.forEach((_, index) => {
            exerciseSettings[day][index] = {
                sets: 4,
                reps: 8,
                weight: 10.0
            };
        });
    });
}

function migrateProgressData() {
    // Migrate old progress structure (fixed 4 sets) to new dynamic structure
    [1, 2, 3].forEach(day => {
        if (workoutProgress[day]) {
            Object.keys(workoutProgress[day]).forEach(exerciseIndex => {
                const progress = workoutProgress[day][exerciseIndex];
                if (progress && Array.isArray(progress.sets)) {
                    // Check if it's the old fixed-length format
                    if (progress.sets.length === 4 && progress.sets.every(s => typeof s === 'boolean')) {
                        // This is the old format, keep it as is but ensure it's valid
                        return;
                    }
                }
                // If invalid, reset this exercise
                workoutProgress[day][exerciseIndex] = { completed: false, sets: [] };
            });
        }
    });
}

function validateDataStructures() {
    // Ensure all days exist
    [1, 2, 3].forEach(day => {
        if (!workoutProgress[day]) workoutProgress[day] = {};
        if (!exerciseSettings[day]) exerciseSettings[day] = {};
        
        // Ensure all exercises exist
        workoutData[day].exercises.forEach((_, index) => {
            if (!workoutProgress[day][index]) {
                workoutProgress[day][index] = { completed: false, sets: [] };
            }
            if (!exerciseSettings[day][index]) {
                exerciseSettings[day][index] = {
                    sets: 4,
                    reps: 8,
                    weight: 10.0
                };
            }
        });
    });
}

function resetToDefaults() {
    workoutProgress = {};
    workoutHistory = [];
    exerciseSettings = {};
    
    initializeEmptyProgress();
    initializeDefaultSettings();
    validateDataStructures();
    saveProgress();
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('fitnessProgress', JSON.stringify(workoutProgress));
    localStorage.setItem('fitnessHistory', JSON.stringify(workoutHistory));
    localStorage.setItem('exerciseSettings', JSON.stringify(exerciseSettings));
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
                alert('progress imported successfully!');
                location.reload();
            } else {
                alert('invalid backup file format.');
            }
        } catch (error) {
            alert('error reading backup file.');
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
document.getElementById('settings-back-button').addEventListener('click', showDaySelection);
document.getElementById('history-back-button').addEventListener('click', showSettingsPage);
document.getElementById('detailed-workouts-back-button').addEventListener('click', showHistory);

// Adjustment button listeners
document.getElementById('sets-minus').addEventListener('click', () => adjustValue('sets', -1));
document.getElementById('sets-plus').addEventListener('click', () => adjustValue('sets', 1));
document.getElementById('reps-minus').addEventListener('click', () => adjustValue('reps', -1));
document.getElementById('reps-plus').addEventListener('click', () => adjustValue('reps', 1));
document.getElementById('weight-minus').addEventListener('click', () => adjustValue('weight', -2.5));
document.getElementById('weight-plus').addEventListener('click', () => adjustValue('weight', 2.5));

function showSettingsPage() {
    // Hide other views
    daySelection.style.display = 'none';
    workoutDetails.style.display = 'none';
    exerciseDetails.style.display = 'none';
    document.getElementById('history-view').style.display = 'none';
    document.getElementById('settings-page').style.display = 'block';
}

// Show workout history
function showHistory() {
    // Hide other views
    daySelection.style.display = 'none';
    workoutDetails.style.display = 'none';
    exerciseDetails.style.display = 'none';
    document.getElementById('settings-page').style.display = 'none';
    document.getElementById('detailed-workouts-view').style.display = 'none';
    document.getElementById('history-view').style.display = 'block';
    
    // Generate history stats
    generateHistoryStats();
}

// Show detailed workouts list
function showDetailedWorkouts(filter) {
    // Hide other views
    daySelection.style.display = 'none';
    workoutDetails.style.display = 'none';
    exerciseDetails.style.display = 'none';
    document.getElementById('settings-page').style.display = 'none';
    document.getElementById('history-view').style.display = 'none';
    document.getElementById('detailed-workouts-view').style.display = 'block';
    
    // Set title based on filter
    const titleElement = document.getElementById('detailed-workouts-title');
    if (filter === 'all') {
        titleElement.textContent = 'all workouts';
    } else if (filter === 'week') {
        titleElement.textContent = 'this week\'s workouts';
    }
    
    // Generate detailed workout list
    generateDetailedWorkoutsList(filter);
}

function generateHistoryStats() {
    const statsContainer = document.getElementById('history-stats');
    const totalWorkouts = workoutHistory.length;
    const uniqueDays = [...new Set(workoutHistory.map(entry => entry.date))].length;
    const thisWeek = getThisWeekWorkouts();
    
    statsContainer.innerHTML = `
        <div class="stat-card clickable" onclick="showDetailedWorkouts('all')">
            <span class="stat-number">${totalWorkouts}</span>
            <div class="stat-label">total workouts</div>
        </div>
        <div class="stat-card">
            <span class="stat-number">${uniqueDays}</span>
            <div class="stat-label">days active</div>
        </div>
        <div class="stat-card clickable" onclick="showDetailedWorkouts('week')">
            <span class="stat-number">${thisWeek}</span>
            <div class="stat-label">this week</div>
        </div>
    `;
}

function generateDetailedWorkoutsList(filter) {
    const listContainer = document.getElementById('detailed-workouts-list');
    
    if (workoutHistory.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #666;">no workout history yet. complete your first workout!</p>';
        return;
    }
    
    // Filter workouts based on the filter type
    let filteredHistory = [...workoutHistory];
    if (filter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredHistory = workoutHistory.filter(entry => 
            new Date(entry.date) >= oneWeekAgo
        );
    }
    
    if (filteredHistory.length === 0) {
        const message = filter === 'week' ? 
            'no workouts this week yet. time to get started!' : 
            'no workout history yet. complete your first workout!';
        listContainer.innerHTML = `<p style="text-align: center; color: #666;">${message}</p>`;
        return;
    }
    
    // Sort by date (newest first)
    const sortedHistory = filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
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
        return 'today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'yesterday';
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
    if (confirm('are you sure you want to reset all progress? this cannot be undone.')) {
        localStorage.removeItem('fitnessProgress');
        localStorage.removeItem('fitnessHistory');
        localStorage.removeItem('exerciseSettings');
        location.reload();
    }
}

// Fix data issues function
function fixDataIssues() {
    if (confirm('this will fix any data compatibility issues. your progress will be preserved where possible. continue?')) {
        try {
            // Clear and reinitialize all data structures
            resetToDefaults();
            alert('data issues fixed! the app should work normally now.');
            location.reload();
        } catch (error) {
            console.error('Error fixing data issues:', error);
            alert('unable to fix automatically. try "reset progress" if problems persist.');
        }
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
    document.getElementById('settings-page').style.display = 'none';
    document.getElementById('history-view').style.display = 'none';
    document.getElementById('detailed-workouts-view').style.display = 'none';
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
    document.getElementById('settings-page').style.display = 'none';
    document.getElementById('history-view').style.display = 'none';
    document.getElementById('detailed-workouts-view').style.display = 'none';
    
    // Add fade-in animation
    workoutDetails.classList.add('fade-in');
    setTimeout(() => workoutDetails.classList.remove('fade-in'), 300);
}

function showExerciseDetails(exerciseIndex) {
    try {
        if (!currentDay) return;
        
        currentExercise = exerciseIndex;
        const exercise = workoutData[currentDay].exercises[exerciseIndex];
        
        // Ensure settings exist
        if (!exerciseSettings[currentDay] || !exerciseSettings[currentDay][exerciseIndex]) {
            console.warn(`Missing settings for day ${currentDay}, exercise ${exerciseIndex}, initializing defaults`);
            if (!exerciseSettings[currentDay]) exerciseSettings[currentDay] = {};
            exerciseSettings[currentDay][exerciseIndex] = {
                sets: 4,
                reps: 8,
                weight: 10.0
            };
            saveProgress();
        }
        
        const settings = exerciseSettings[currentDay][exerciseIndex];
        
        // Update exercise details
        document.getElementById('exercise-name').textContent = exercise.name;
        
        // Update adjustable values
        document.getElementById('sets').textContent = settings.sets;
        document.getElementById('reps').textContent = settings.reps;
        document.getElementById('weight').textContent = settings.weight.toFixed(1);
        
        // Update button states
        updateAdjustmentButtons();
        
        // Update description
        const descriptionEl = document.getElementById('exercise-description');
        descriptionEl.innerHTML = `
            <h4>how to perform:</h4>
            <p>${exercise.description}</p>
            <p><strong>tips:</strong> ${exercise.tips}</p>
            <p><strong>original weight range:</strong> ${exercise.weightRange}</p>
        `;
        
        // Generate set tracker
        generateSetTracker(exerciseIndex);
        
        // Show exercise details, hide others
        daySelection.style.display = 'none';
        workoutDetails.style.display = 'none';
        exerciseDetails.style.display = 'block';
        document.getElementById('settings-page').style.display = 'none';
        document.getElementById('history-view').style.display = 'none';
        document.getElementById('detailed-workouts-view').style.display = 'none';
        
        // Add fade-in animation
        exerciseDetails.classList.add('fade-in');
        setTimeout(() => exerciseDetails.classList.remove('fade-in'), 300);
        
    } catch (error) {
        console.error('Error showing exercise details:', error);
        alert('error loading exercise. please try refreshing the page.');
    }
}

function generateSetTracker(exerciseIndex) {
    try {
        const setsGrid = document.getElementById('sets-grid');
        
        // Ensure settings exist
        if (!exerciseSettings[currentDay] || !exerciseSettings[currentDay][exerciseIndex]) {
            console.warn(`Missing settings in generateSetTracker, using defaults`);
            if (!exerciseSettings[currentDay]) exerciseSettings[currentDay] = {};
            exerciseSettings[currentDay][exerciseIndex] = {
                sets: 4,
                reps: 8,
                weight: 10.0
            };
        }
        
        const settings = exerciseSettings[currentDay][exerciseIndex];
        const totalSets = settings.sets || 4; // Fallback to 4 if undefined
        
        setsGrid.innerHTML = '';
        
        // Reset tracker appearance for new exercise
        const tracker = document.getElementById('set-tracker');
        tracker.style.background = '#f8f8f8';
        tracker.style.borderColor = '#e0e0e0';
        
        // Ensure progress array matches current sets count
        if (!workoutProgress[currentDay][exerciseIndex]) {
            workoutProgress[currentDay][exerciseIndex] = { completed: false, sets: [] };
        }
        
        const progress = workoutProgress[currentDay][exerciseIndex];
        
        // Adjust sets array length to match current settings
        while (progress.sets.length < totalSets) {
            progress.sets.push(false);
        }
        if (progress.sets.length > totalSets) {
            progress.sets = progress.sets.slice(0, totalSets);
        }
        
        for (let i = 0; i < totalSets; i++) {
            const setItem = document.createElement('div');
            setItem.className = 'set-item';
            setItem.dataset.setIndex = i;
            
            // Check if set is completed
            if (progress.sets[i]) {
                setItem.classList.add('completed');
            }
            
            setItem.innerHTML = `
                <div class="set-number">set ${i + 1}</div>
                <div class="set-checkbox">${setItem.classList.contains('completed') ? '✓' : '○'}</div>
            `;
            
            setItem.addEventListener('click', () => toggleSet(exerciseIndex, i));
            setsGrid.appendChild(setItem);
        }
        
        updateSetProgress(exerciseIndex);
        
        // Show completion feedback if exercise is already completed
        if (progress.completed) {
            showExerciseCompletionFeedback();
        }
        
    } catch (error) {
        console.error('Error generating set tracker:', error);
        // Fallback: create a basic 4-set tracker
        const setsGrid = document.getElementById('sets-grid');
        setsGrid.innerHTML = '<p style="text-align: center; color: #666;">error loading set tracker. please refresh the page.</p>';
    }
}

function toggleSet(exerciseIndex, setIndex) {
    // Initialize if doesn't exist
    if (!workoutProgress[currentDay][exerciseIndex]) {
        workoutProgress[currentDay][exerciseIndex] = {
            completed: false,
            sets: []
        };
    }
    
    const progress = workoutProgress[currentDay][exerciseIndex];
    
    // Toggle set completion
    progress.sets[setIndex] = !progress.sets[setIndex];
    
    // Update UI
    const setItem = document.querySelector(`[data-set-index="${setIndex}"]`);
    const checkbox = setItem.querySelector('.set-checkbox');
    
    if (progress.sets[setIndex]) {
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
    const settings = exerciseSettings[currentDay][exerciseIndex];
    const completedSets = workoutProgress[currentDay][exerciseIndex] 
        ? workoutProgress[currentDay][exerciseIndex].sets.filter(set => set).length 
        : 0;
    
    const progress = document.getElementById('exercise-progress');
    
    // Reset progress display style
    progress.style.background = '#f0f0f0';
    progress.style.color = '#000000';
    
    // Check if exercise is completed
    if (workoutProgress[currentDay][exerciseIndex] && 
        workoutProgress[currentDay][exerciseIndex].completed) {
        progress.innerHTML = `
            <strong>exercise complete! great job!</strong>
            <button class="back-to-exercises-btn" onclick="showWorkoutDetails()" style="margin-top: 10px; padding: 8px 16px; background: #000000; color: #ffffff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                back to exercises
            </button>
        `;
        progress.style.background = '#000000';
        progress.style.color = '#ffffff';
    } else {
        progress.innerHTML = `<span id="completed-sets">${completedSets}</span> of <span id="total-sets">${settings.sets}</span> sets completed`;
    }
}

// Adjustment functions
function adjustValue(type, delta) {
    if (!currentDay || currentExercise === null) return;
    
    const settings = exerciseSettings[currentDay][currentExercise];
    
    if (type === 'sets') {
        const newValue = Math.max(1, Math.min(10, settings.sets + delta));
        settings.sets = newValue;
        document.getElementById('sets').textContent = newValue;
        
        // Regenerate set tracker with new count
        generateSetTracker(currentExercise);
    } else if (type === 'reps') {
        const newValue = Math.max(1, Math.min(50, settings.reps + delta));
        settings.reps = newValue;
        document.getElementById('reps').textContent = newValue;
    } else if (type === 'weight') {
        const newValue = Math.max(0, Math.min(200, settings.weight + delta));
        settings.weight = newValue;
        document.getElementById('weight').textContent = newValue.toFixed(1);
    }
    
    updateAdjustmentButtons();
    saveProgress();
}

function updateAdjustmentButtons() {
    if (!currentDay || currentExercise === null) return;
    
    const settings = exerciseSettings[currentDay][currentExercise];
    
    // Update sets buttons
    document.getElementById('sets-minus').disabled = settings.sets <= 1;
    document.getElementById('sets-plus').disabled = settings.sets >= 10;
    
    // Update reps buttons
    document.getElementById('reps-minus').disabled = settings.reps <= 1;
    document.getElementById('reps-plus').disabled = settings.reps >= 50;
    
    // Update weight buttons
    document.getElementById('weight-minus').disabled = settings.weight <= 0;
    document.getElementById('weight-plus').disabled = settings.weight >= 200;
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
    tracker.style.background = '#f0f0f0';
    tracker.style.borderColor = '#000000';
    
    const progress = document.getElementById('exercise-progress');
    progress.innerHTML = `
        <strong>exercise complete! great job!</strong>
        <button class="back-to-exercises-btn" onclick="showWorkoutDetails()" style="margin-top: 10px; padding: 8px 16px; background: #000000; color: #ffffff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
            back to exercises
        </button>
    `;
    progress.style.background = '#000000';
    progress.style.color = '#ffffff';
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
        `amazing job! you've completed all exercises for ${dayTitle}.`;
    
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
    initializeLogo();
});

// Logo initialization
function initializeLogo() {
    const logo = document.getElementById('logo');
    const catFace = document.getElementById('cat-face');
    
    // Try to load the logo image
    logo.onload = function() {
        if (logo.naturalWidth > 0) {
            logo.classList.add('loaded');
            catFace.style.display = 'none'; // Hide fallback when image loads
        }
    };
    
    // If logo fails to load, show cat face fallback
    logo.onerror = function() {
        logo.style.display = 'none';
        catFace.style.display = 'inline'; // Show fallback
    };
    
    // Set a timeout to show fallback if image doesn't load quickly
    setTimeout(() => {
        if (!logo.complete || logo.naturalWidth === 0) {
            logo.style.display = 'none';
            catFace.style.display = 'inline';
        }
    }, 500);
}