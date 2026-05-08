let count = 0;
let clickPower = 1;
let autoClickRate = 0;
let lastClickTime = 0;
let lastX = 0;
let lastY = 0;

let doublePrice = 10;
let autoPrice = 50;

const numberElement = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const buyDoubleBtn = document.getElementById('upgrade-click');
const buyAutoBtn = document.getElementById('buy-autoclicker');
const statPower = document.getElementById('stat-power');
const statAuto = document.getElementById('stat-auto');

function saveGame() {
    const gameData = {
        count: count,
        clickPower: clickPower,
        autoClickRate: autoClickRate,
        doublePrice: doublePrice,
        autoPrice: autoPrice
    };
    localStorage.setItem('tyClickerSave', JSON.stringify(gameData));
}

function loadGame() {
    const savedData = localStorage.getItem('tyClickerSave');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        count = data.count || 0;
        clickPower = data.clickPower || 1;
        autoClickRate = data.autoClickRate || 0;
        doublePrice = data.doublePrice || 10;
        autoPrice = data.autoPrice || 50;
        
        buyDoubleBtn.textContent = `Улучшить клик (Цена: ${doublePrice})`;
        buyAutoBtn.textContent = `Авто-клик (Цена: ${autoPrice})`;
    }
}

function updateDisplay() {
    numberElement.textContent = `кликов: ${count}`;
    
    statPower.textContent = clickPower;
    statAuto.textContent = autoClickRate;

    buyDoubleBtn.disabled = count < doublePrice;
    buyAutoBtn.disabled = count < autoPrice;
}

clickBtn.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
    }
});

function showClickAnimation(x, y, amount) {
    const animationText = document.createElement('div');
    animationText.className = 'click-animation';
    animationText.textContent = `+${amount}`;
    
    animationText.style.left = `${x}px`;
    animationText.style.top = `${y}px`;
    
    document.body.appendChild(animationText);

    setTimeout(() => {
        animationText.remove();
    }, 800);
}

function handleInteraction(event) {
    const currentTime = Date.now();
    
    // Определяем координаты в зависимости от типа события (мышь или тач)
    let clientX, clientY;
    if (event.touches) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    if (!event.isTrusted) return;
    if (currentTime - lastClickTime < 60) return;
    if (clientX === lastX && clientY === lastY && currentTime - lastClickTime < 150) return;

    if (event.cancelable) {
        event.preventDefault();
    }

    lastClickTime = currentTime;
    lastX = clientX;
    lastY = clientY;

    count += clickPower;
    
    showClickAnimation(clientX, clientY, clickPower);
    
    updateDisplay();
    saveGame();
}

clickBtn.addEventListener('touchstart', handleInteraction, { passive: false });
clickBtn.addEventListener('click', handleInteraction);

buyDoubleBtn.addEventListener('click', () => {
    if (count >= doublePrice) {
        count -= doublePrice;
        clickPower += 1;
        doublePrice *= 2;
        buyDoubleBtn.textContent = `Улучшить клик (Цена: ${doublePrice})`;
        updateDisplay();
        saveGame();
    }
});

buyAutoBtn.addEventListener('click', () => {
    if (count >= autoPrice) {
        count -= autoPrice;
        autoClickRate += 1;
        autoPrice *= 2;
        buyAutoBtn.textContent = `Авто-клик (Цена: ${autoPrice})`;
        updateDisplay();
        saveGame();
    }
});

setInterval(() => {
    let changed = false;

    if (autoClickRate > 0) {
        count += autoClickRate;
        changed = true;
    }

    if (changed) {
        updateDisplay();
    }
}, 1000);

setInterval(() => {
    saveGame();
}, 10000);

loadGame();
updateDisplay();