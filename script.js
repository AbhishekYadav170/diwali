const stage  = document.getElementById('stage');
const title  = document.getElementById('title');
const canvas = document.getElementById('fx');
const ctx    = canvas.getContext('2d');

/* ---- Build the title letter by letter ---- */
const TEXT  = 'Happy Diwali';
const START = 5.4;   // seconds (after the flame lights up)
const STEP  = 0.14;  // delay between letters

function buildTitle() {
  title.innerHTML = '';
  let i = 0;
  TEXT.split(' ').forEach(w => {
    const word = document.createElement('span');
    word.className = 'word';
    [...w].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'letter';
      s.textContent = ch;
      s.style.animationDelay = (START + i * STEP) + 's';
      word.appendChild(s);
      i++;
    });
    title.appendChild(word);
  });
}

/* ---- Canvas: twinkling stars + sparks ---- */
function resize() {
  canvas.width  = innerWidth;
  canvas.height = innerHeight;
}
addEventListener('resize', resize);
resize();

const stars = Array.from({ length: 90 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.6 + 0.3,
  p: Math.random() * Math.PI * 2,
  s: Math.random() * 0.03 + 0.01
}));

let sparks = [];
let startTime = performance.now();
let nextBurst = 0;

function burst(x, y) {
  const hues = [35, 45, 20, 330, 280];
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = Math.random() * 4 + 1.5;
    sparks.push({
      x, y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      life: 1,
      hue: hues[Math.floor(Math.random() * hues.length)]
    });
  }
}

function loop(now) {
  const t = (now - startTime) / 1000;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // stars
  stars.forEach(s => {
    s.p += s.s;
    ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.p));
    ctx.fillStyle = '#ffe9b0';
    ctx.beginPath();
    ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // fireworks begin once the title is complete
  if (t > 8 && t > nextBurst) {
    burst(canvas.width * (0.15 + Math.random() * 0.7),
          canvas.height * (0.1 + Math.random() * 0.4));
    nextBurst = t + 0.7 + Math.random() * 1.1;
  }

  // sparks
  sparks.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.vx *= 0.985;
    p.life -= 0.014;
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = `hsl(${p.hue},100%,60%)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  sparks = sparks.filter(p => p.life > 0);

  ctx.globalAlpha = 1;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---- Play / Replay ---- */
function play() {
  stage.classList.remove('play');
  buildTitle();
  sparks = [];
  startTime = performance.now();
  nextBurst = 0;
  void stage.offsetWidth;  // restart CSS animations
  stage.classList.add('play');
}

document.getElementById('replay').addEventListener('click', play);
play();