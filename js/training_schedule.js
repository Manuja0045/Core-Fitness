const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const workouts = ['Chest & Triceps', 'Back & Biceps', 'Leg Day', 'Shoulders', 'Abs & Core', 'Cardio & HIIT'];

document.addEventListener('DOMContentLoaded', () => {
    renderScheduleForm();
    fetchSchedule();
});

function renderScheduleForm() {
    const form = document.getElementById('schedule-form');
    form.innerHTML = '';
    days.forEach(day => {
        const workoutOptions = workouts.map(w => `<option value="${w}">${w}</option>`).join('');
        form.innerHTML += `
      <div class="day-form" data-day="${day}">
        <div class="day-title">${day}</div>

        <label>Start Time</label>
        <div class="time-select">
          ${getTimeDropdown('start')}
        </div>

        <label>End Time</label>
        <div class="time-select">
          ${getTimeDropdown('end')}
        </div>

        <label>Workout Type</label>
        <select class="workout-type">${workoutOptions}</select>
      </div>
    `;
    });
}

function getTimeDropdown(type) {
    const hours = [...Array(12).keys()].map(i => i + 1);
    const minutes = [...Array(60).keys()].map(i => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];

    const hourSelect = `<select class="${type}-hour">${hours.map(h => `<option value="${h}">${h}</option>`).join('')}</select>`;
    const minuteSelect = `<select class="${type}-minute">${minutes.map(m => `<option value="${m}">${m}</option>`).join('')}</select>`;
    const periodSelect = `<select class="${type}-period">${periods.map(p => `<option value="${p}">${p}</option>`).join('')}</select>`;

    return hourSelect + minuteSelect + periodSelect;
}

function submitSchedule() {
    const token = localStorage.getItem('token');
    const schedule = [];

    document.querySelectorAll('.day-form').forEach(form => {
        const day = form.dataset.day;

        const startHour = parseInt(form.querySelector('.start-hour').value);
        const startMinute = form.querySelector('.start-minute').value;
        const startPeriod = form.querySelector('.start-period').value;
        const start24 = convertTo24Hour(startHour, startMinute, startPeriod);

        const endHour = parseInt(form.querySelector('.end-hour').value);
        const endMinute = form.querySelector('.end-minute').value;
        const endPeriod = form.querySelector('.end-period').value;
        const end24 = convertTo24Hour(endHour, endMinute, endPeriod);

        const workout = form.querySelector('.workout-type').value;

        schedule.push({
            day_of_week: day,
            start_time: start24,
            end_time: end24,
            workout_type: workout
        });
    });

    fetch('http://localhost:5000/api/schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ schedule }) // Wrap in object
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                fetchSchedule();
            } else {
                alert(data.error || 'An error occurred while saving.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Failed to save schedule.');
        });
}

// Convert 12-hour time (with AM/PM) to 24-hour format
function convertTo24Hour(hour, minute, period) {
    hour = period === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    return `${hour.toString().padStart(2, '0')}:${minute}`;
}

function fetchSchedule() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/schedule', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                renderScheduleView(data);
            } else {
                console.warn('Unexpected schedule data:', data);
                alert(data.error || 'Failed to fetch schedule.');
            }
        })
        .catch(err => {
            console.error(err);
        });
}

function renderScheduleView(schedule) {
    const container = document.getElementById('schedule-view');
    container.innerHTML = '';
    schedule.forEach(item => {
        container.innerHTML += `
      <div class="schedule-card">
        <h3>${item.day_of_week}</h3>
        <p><strong>Time:</strong> ${item.start_time} - ${item.end_time}</p>
        <p><strong>Workout:</strong> ${item.workout_type}</p>
        <p><strong>Trainer:</strong> ${item.trainer_name}</p>
        <p><em>Last updated: ${new Date(item.last_updated).toLocaleDateString()}</em></p>
      </div>
    `;
    });

}




