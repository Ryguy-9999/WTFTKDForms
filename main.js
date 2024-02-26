function canvas_arrow(context, fromx, fromy, tox, toy) {
    context.beginPath();
    var headlen = Math.sqrt(Math.pow(tox - fromx, 2) + Math.pow(toy - fromy, 2)) / 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(fromx + (tox - fromx)*0.985, fromy + (toy - fromy)*0.985);
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

function get_form_bounds(form) {
    const padding = 1;

    let bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    let currentWalk = { x: 0, y: 0 };

    form.pattern.forEach(movement => {
        currentWalk.x += movement.moveX;
        currentWalk.y += movement.moveY;

        bounds.minX = Math.min(bounds.minX, currentWalk.x);
        bounds.minY = Math.min(bounds.minY, currentWalk.y);
        bounds.maxX = Math.max(bounds.maxX, currentWalk.x);
        bounds.maxY = Math.max(bounds.maxY, currentWalk.y);
    });

    bounds.minX -= padding;
    bounds.minY -= padding;
    bounds.maxX += padding;
    bounds.maxY += padding;
    return bounds;
}

function draw_form(form) {
    const bounds = get_form_bounds(form);
    const stepDistance = Math.min(canvas.width / (bounds.maxX - bounds.minX), canvas.height / (bounds.maxY - bounds.minY));
    let currentPoint = { x: canvas.width / (bounds.maxX - bounds.minX) * -bounds.minX, y: canvas.height / (bounds.maxY - bounds.minY) * -bounds.minY };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    form.pattern.forEach((movement, index) => {
        let newPoint = { x: currentPoint.x + movement.moveX * stepDistance, y: currentPoint.y + movement.moveY * stepDistance };
        let colorAlpha = index === currentStep ? 1 : 0.1;

        if(movement.kihup) {
            ctx.fillStyle = `rgba(225,225,0,${colorAlpha})`;
            ctx.beginPath();
            ctx.arc(newPoint.x, newPoint.y, stepDistance / 8, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.strokeStyle = (stanceColorData.hasOwnProperty(movement.stance) ? stanceColorData[movement.stance] : stanceColorData.default).replace('$alpha', ''+colorAlpha);
        canvas_arrow(ctx, currentPoint.x, currentPoint.y, newPoint.x, newPoint.y);

        for(let i = 0; i < (movement.multiMove || 1); i++) {
            canvas_arrow(ctx, currentPoint.x, currentPoint.y, currentPoint.x + movement.moveX * stepDistance * Math.pow(0.93, i), currentPoint.y + movement.moveY * stepDistance * Math.pow(0.93, i));
        }

        currentPoint = newPoint;
    });
}

const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
ctx.lineWidth = 3;

const stanceData = [
    {
        name: 'Low/Front Stance',
        koreanName: 'Ap Kubi',
        colorCode: 'lowStance'
    }, {
        name: 'High/Walking Stance',
        koreanName: 'Ap Seogi',
        colorCode: 'highStance'
    }, {
        name: 'Side/Back Stance',
        koreanName: 'Dwi Kubi',
        colorCode: 'sideStance'
    },
];

const stanceColorData = {
    lowStance: 'rgba(255,0,0,$alpha)',
    highStance: 'rgba(0,255,0,$alpha)',
    sideStance: 'rgba(0,0,255,$alpha)',
    default: 'rgba(0,0,0,$alpha)'
}
const formData = [
    {
        name: 'Ki-Bon Il Jang',
        belt: '#ffffff',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', kihup: true },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance', kihup: true },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
        ]
    }, {
        name: 'Ki-Bon Ee Jang',
        belt: '#ffffff',
        beltStripe: '#eeee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', kihup: true },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance', kihup: true },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'lowStance' },
        ]
    }, {
        name: 'Taegeuk Il Jang',
        belt: '#eeee00',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', multiMove: 2 },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance', multiMove: 4 },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance', kihup: true },
        ]
    }, {
        name: 'Koryo',
        belt: '#000000',
        pattern: [
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: 0, moveY: -1, stance: 'lowStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: -1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 1, moveY: 0, stance: 'highStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
            { moveX: 0, moveY: 1, stance: 'lowStance' },
        ]
    },
];

let showLegend = false;
let currentStep = 0;
let selectedForm = formData[0];
draw_form(selectedForm);

window.onresize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineWidth = 3;
    draw_form(selectedForm);
};

// Construct buttons for each form in nav bar
formData.forEach(form => {
    let navBtn = document.createElement('div');
    let span = document.createElement('span');
    let div = document.createElement('div');

    span.innerHTML = form.name;

    div.className = 'belt-indicator';
    div.style.borderTop = '4px solid ' + form.belt;
    div.style.borderBottom = '4px solid ' + form.belt;
    div.style.backgroundColor = form.beltStripe || form.belt;

    navBtn.className = 'nav-button';
    navBtn.onclick = () => {
        currentStep = 0;
        selectedForm = form;
        draw_form(selectedForm);
    };
    navBtn.appendChild(div);
    navBtn.appendChild(span);
    document.getElementById('forms-nav').appendChild(navBtn);
});

// Construct legend from color data
stanceData.forEach(stance => {
    let colorDiv = document.createElement('div');
    let nameSpan = document.createElement('span');

    colorDiv.className = 'legend-color-indicator';
    colorDiv.style.backgroundColor = stanceColorData[stance.colorCode].replace('$alpha', '1');

    nameSpan.innerHTML = `${stance.name} (${stance.koreanName})`;

    document.getElementById('legendColorColumn').appendChild(colorDiv);
    document.getElementById('legendNameColumn').appendChild(nameSpan);
});


// Movement navigation clicking
document.getElementById('forwardStepBtn').onclick = () => {
    currentStep = (currentStep + 1) % selectedForm.pattern.length;
    draw_form(selectedForm);
}
document.getElementById('backStepBtn').onclick = () => {
    currentStep = (currentStep - 1 + selectedForm.pattern.length) % selectedForm.pattern.length;
    draw_form(selectedForm);
}

// Legend toggle
document.getElementById('legendBtn').onclick = () => {
    showLegend = !showLegend;
    document.getElementById('legendBtn').innerHTML = showLegend ? 'Hide Legend' : 'Show Legend';
    document.getElementById('legendContainer').style.display = showLegend ? 'flex' : 'none';
    draw_form(selectedForm);
};
