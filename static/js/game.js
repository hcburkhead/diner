// 🛑 TROOPS: GLOBAL STATE - DO NOT MODIFY
let state = { stack: [], target: "", score: 0, time: 60, isGameOver: false };

document.querySelectorAll('.ing').forEach(el => {
    el.setAttribute('draggable', 'true');
    el.ondragstart = (e) => e.dataTransfer.setData('text', el.innerText);
});

function showNotification(msg, isRestart = false) {
    const box = document.getElementById('gui-notification');
    const btn = document.getElementById('notification-btn');
    document.getElementById('gui-message').innerText = msg;
    btn.innerText = isRestart ? "RESTART SHIFT" : "CONTINUE";
    state.isGameOver = isRestart;
    box.style.display = 'block';
}

function handleNotificationClick() {
    document.getElementById('gui-notification').style.display = 'none';
    if (state.isGameOver) {
        location.reload();
    }
}

function getOrder() {
    fetch('/get_order').then(r => r.json()).then(data => {
        state.target = data.name;
        state.stack = new Array(data.stack.length).fill(null);
        document.getElementById('target-name').innerText = "TICKET: " + data.name;
        document.getElementById('target-preview').innerHTML = data.stack.map(i => 
            `<div class="graphic-layer g-${i.toLowerCase().replace(' ','_')}"></div>`).join('');
        updateUI();
    });
}

function updateUI() {
    const grid = document.getElementById('grid'), viz = document.getElementById('sandwich-viz');
    grid.innerHTML = ''; viz.innerHTML = '';
    if (state.stack.every(i => i === null)) {
        viz.innerHTML = '<div class="build-placeholder">Drag  ingredients to the Assembly Station</div>';
    } else {
        state.stack.forEach(i => {
            if(i) viz.innerHTML += `<div class="graphic-layer g-${i.toLowerCase().replace(' ','_')}">${i}</div>`;
        });
    }
    state.stack.forEach((val, i) => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.innerText = val || 'Empty Slot';
        slot.ondragover = (e) => e.preventDefault();
        slot.ondrop = (e) => { state.stack[i] = e.dataTransfer.getData('text'); updateUI(); };
        grid.appendChild(slot);
    });
}

function submitOrder() {
    const btn = document.getElementById('check-btn');
    fetch('/validate', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({stack: state.stack, target_name: state.target})})
    .then(r => r.json()).then(data => {
        if (data.points > 0) {
            btn.classList.add('flash-green');
            setTimeout(() => btn.classList.remove('flash-green'), 500);
        } else {
            btn.classList.add('flash-red');
            setTimeout(() => btn.classList.remove('flash-red'), 500);
        }
        showNotification(data.message + " | Points Earned: " + data.points);
        state.score += data.points;
        document.getElementById('score').innerText = state.score;
        state.stack = new Array(state.stack.length).fill(null);
        getOrder();
    });
}

const timerInterval = setInterval(() => {
    if (state.time > 0) {
        state.time--;
        document.getElementById('timer-text').innerText = state.time;
        document.getElementById('timer-circle').style.setProperty('--p', (state.time / 60) * 100);
    } else {
        clearInterval(timerInterval);
        showNotification("TIME'S UP! Final Score: " + state.score, true);
    }
}, 1000);

getOrder();
