import * as THREE from 'three';

const cenaElemento = document.getElementById('cena');

const cena = new THREE.Scene();
cena.background = new THREE.Color('#d9edff');
cena.fog = new THREE.Fog('#d9edff', 18, 38);

const camera = new THREE.PerspectiveCamera(
  45,
  cenaElemento.clientWidth / cenaElemento.clientHeight,
  0.1,
  100
);

camera.position.set(10, 9, 13);
camera.lookAt(0, 1.5, 0);

const renderizador = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});

renderizador.setSize(cenaElemento.clientWidth, cenaElemento.clientHeight);
renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
renderizador.outputColorSpace = THREE.SRGBColorSpace;
renderizador.toneMapping = THREE.ACESFilmicToneMapping;
renderizador.toneMappingExposure = 1.2;

cenaElemento.appendChild(renderizador.domElement);

// Cores usadas na confeitaria
const cores = {
  rosa: '#f08bbd',
  rosaEscuro: '#c84c91',
  lilas: '#b9a1ec',
  branco: '#fff9fc',
  creme: '#fff0d5',
  marrom: '#8c573c',
  chocolate: '#75432f',
  azul: '#bce8f5',
  verde: '#8acb9b',
  amarelo: '#ffdc85'
};

const materiais = {};

function material(cor, rugosidade = 0.8) {
  const chave = `${cor}-${rugosidade}`;

  if (!materiais[chave]) {
    materiais[chave] = new THREE.MeshStandardMaterial({
      color: cor,
      roughness: rugosidade
    });
  }

  return materiais[chave];
}

function criarCaixa(
  largura,
  altura,
  profundidade,
  cor,
  x,
  y,
  z,
  grupo = cena,
  arredondar = false
) {
  const geometria = new THREE.BoxGeometry(
    largura,
    altura,
    profundidade
  );

  const objeto = new THREE.Mesh(
    geometria,
    material(cor)
  );

  objeto.position.set(x, y, z);
  objeto.castShadow = true;
  objeto.receiveShadow = true;

  grupo.add(objeto);

  return objeto;
}

function criarCilindro(
  raioTopo,
  raioBase,
  altura,
  cor,
  x,
  y,
  z,
  grupo = cena,
  segmentos = 32
) {
  const geometria = new THREE.CylinderGeometry(
    raioTopo,
    raioBase,
    altura,
    segmentos
  );

  const objeto = new THREE.Mesh(
    geometria,
    material(cor)
  );

  objeto.position.set(x, y, z);
  objeto.castShadow = true;
  objeto.receiveShadow = true;

  grupo.add(objeto);

  return objeto;
}

function criarEsfera(
  raio,
  cor,
  x,
  y,
  z,
  grupo = cena
) {
  const objeto = new THREE.Mesh(
    new THREE.SphereGeometry(raio, 20, 16),
    material(cor)
  );

  objeto.position.set(x, y, z);
  objeto.castShadow = true;

  grupo.add(objeto);

  return objeto;
}

// Iluminação da confeitaria
const luzAmbiente = new THREE.HemisphereLight(
  '#ffffff',
  '#d9a8c8',
  2.2
);

cena.add(luzAmbiente);

const luzPrincipal = new THREE.DirectionalLight(
  '#fff5e9',
  3
);

luzPrincipal.position.set(8, 13, 7);
luzPrincipal.castShadow = true;
luzPrincipal.shadow.mapSize.set(2048, 2048);
luzPrincipal.shadow.camera.left = -15;
luzPrincipal.shadow.camera.right = 15;
luzPrincipal.shadow.camera.top = 15;
luzPrincipal.shadow.camera.bottom = -15;

cena.add(luzPrincipal);

const luzRosa = new THREE.PointLight('#ffc3e2', 30, 15);
luzRosa.position.set(-5, 5, 3);
cena.add(luzRosa);

// Piso e paredes
criarCaixa(24, 0.3, 20, '#f8d8e8', 0, -0.2, 0);

criarCaixa(24, 8, 0.3, '#ffe9f4', 0, 3.8, -8);

criarCaixa(0.3, 8, 20, '#f7d9ec', -12, 3.8, 0);

criarCaixa(0.3, 8, 20, '#f7d9ec', 12, 3.8, 0);

// Decoração das paredes
for (let i = 0; i < 9; i++) {
  criarCaixa(
    1.5,
    0.12,
    0.15,
    i % 2 === 0 ? '#f4b8d5' : '#ffffff',
    -8 + i * 2,
    6.7,
    -7.78
  );
}

// Janelas
function criarJanela(x, y, z) {
  criarCaixa(2.5, 2.3, 0.12, '#ffffff', x, y, z);
  criarCaixa(2.15, 1.95, 0.08, '#aee5f7', x, y, z + 0.09);
  criarCaixa(0.09, 2, 0.12, '#ffffff', x, y, z + 0.15);
  criarCaixa(2.2, 0.09, 0.12, '#ffffff', x, y, z + 0.15);
}

criarJanela(-8, 4.3, -7.65);
criarJanela(8, 4.3, -7.65);

// Balcões
function criarBalcao(x, z, largura = 5) {
  criarCaixa(
    largura,
    1.2,
    1.5,
    '#f4b6d6',
    x,
    0.6,
    z
  );

  criarCaixa(
    largura + 0.2,
    0.18,
    1.7,
    '#fff8fc',
    x,
    1.3,
    z
  );

  for (let i = 0; i < 3; i++) {
    criarCaixa(
      0.08,
      0.65,
      0.08,
      '#d881b2',
      x - largura / 2 + 0.8 + i * 1.5,
      0.55,
      z + 0.77
    );
  }
}

criarBalcao(-5, -3.8, 5);
criarBalcao(4.7, -3.8, 5.5);

// Prateleiras
for (let i = 0; i < 3; i++) {
  criarCaixa(
    5,
    0.12,
    0.7,
    '#d9a4c5',
    0,
    3 + i * 1.25,
    -7.35
  );

  for (let j = 0; j < 5; j++) {
    const cor = [
      '#f7a9c8',
      '#b9a1ec',
      '#ffe09b',
      '#a9dfc0',
      '#f5c5e0'
    ][j];

    criarCaixa(
      0.65,
      0.65,
      0.45,
      cor,
      -2 + j,
      3.4 + i * 1.25,
      -7.25
    );
  }
}

// Letreiro da parede
function criarLetreiro() {
  criarCaixa(5.4, 1.25, 0.2, '#ffffff', 0, 6.5, -7.2);
  criarCaixa(5.1, 0.95, 0.12, '#f6c1dd', 0, 6.5, -7.05);

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 220;

  const contexto = canvas.getContext('2d');

  contexto.fillStyle = '#c84c91';
  contexto.font = 'bold 110px Arial';
  contexto.textAlign = 'center';
  contexto.textBaseline = 'middle';
  contexto.fillText('DOCE FÁBRICA', 512, 110);

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;

  const placa = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 1),
    new THREE.MeshBasicMaterial({
      map: textura,
      transparent: true
    })
  );

  placa.position.set(0, 6.5, -6.97);
  cena.add(placa);
}

criarLetreiro();

// Máquina de confeitaria
function criarMaquina(x, z, cor) {
  criarCaixa(2.2, 2.5, 1.8, '#fff9fc', x, 1.25, z);

  criarCaixa(2.25, 0.35, 1.85, cor, x, 2.55, z);

  criarCaixa(1.3, 0.7, 0.12, '#bce8f5', x, 1.6, z + 0.92);

  criarCaixa(0.45, 0.15, 0.15, '#b9a1ec', x, 0.8, z + 1);

  criarCilindro(
    0.2,
    0.2,
    0.2,
    '#f4b6d6',
    x + 0.65,
    2.85,
    z
  );
}

criarMaquina(-7, -2.8, '#f5a9cd');
criarMaquina(0, -2.8, '#b9a1ec');
criarMaquina(7, -2.8, '#a9dfc0');

// Esteira de produção
const esteiras = [];

function criarEsteira(x, z, largura = 5.2) {
  const grupo = new THREE.Group();
  grupo.position.set(x, 0, z);
  cena.add(grupo);

  criarCaixa(
    largura,
    0.35,
    1.5,
    '#d6b0ca',
    0,
    0.8,
    0,
    grupo
  );

  criarCaixa(
    largura - 0.15,
    0.12,
    1.3,
    '#8b6d82',
    0,
    1.02,
    0,
    grupo
  );

  const rolos = [];

  for (let i = 0; i < 13; i++) {
    const rolo = criarCilindro(
      0.09,
      0.09,
      1.25,
      '#f7d8e8',
      -largura / 2 + 0.2 + i * (largura - 0.4) / 12,
      1.1,
      0,
      grupo,
      16
    );

    rolo.rotation.z = Math.PI / 2;
    rolos.push(rolo);
  }

  esteiras.push({ grupo, rolos });
}

criarEsteira(-5, 0.5);
criarEsteira(3.8, 0.5, 5.5);

// Bolo que o jogador está preparando
const boloGrupo = new THREE.Group();
cena.add(boloGrupo);

const pedidoGrupo = new THREE.Group();
cena.add(pedidoGrupo);

const coresMassa = {
  Chocolate: '#75432f',
  Baunilha: '#ffe0a3',
  Morango: '#f4a0c0'
};

const coresCobertura = {
  Rosa: '#f08bbd',
  Chocolate: '#75432f',
  Branca: '#fff9fc'
};

const coresDecoracao = {
  Morango: '#ed4668',
  Confete: '#b9a1ec',
  Chocolate: '#75432f'
};

function limparGrupo(grupo) {
  while (grupo.children.length > 0) {
    const objeto = grupo.children[0];

    grupo.remove(objeto);

    if (objeto.geometry) {
      objeto.geometry.dispose();
    }

    if (objeto.material && objeto.material !== materiais[objeto.material.color?.getStyle()]) {
      if (Array.isArray(objeto.material)) {
        objeto.material.forEach((item) => item.dispose());
      } else if (objeto.material.map) {
        objeto.material.map.dispose();
        objeto.material.dispose();
      }
    }
  }
}

function criarBolo(grupo, dados, escala = 1) {
  limparGrupo(grupo);

  const x = 0;
  const z = 0;
  const baseY = 0.15;

  const corMassa = coresMassa[dados.massa];
  const corCobertura = coresCobertura[dados.cobertura];

  const base = criarCilindro(
    1.05 * escala,
    1.05 * escala,
    0.5 * escala,
    corMassa,
    x,
    baseY + 0.25 * escala,
    z,
    grupo,
    48
  );

  base.position.y = baseY + 0.25 * escala;

  criarCilindro(
    1.1 * escala,
    1.1 * escala,
    0.14 * escala,
    corCobertura,
    x,
    baseY + 0.53 * escala,
    z,
    grupo,
    48
  );

  // Cobertura escorrendo pelas laterais
  for (let i = 0; i < 10; i++) {
    const angulo = (i / 10) * Math.PI * 2;

    const gotaX = Math.cos(angulo) * 0.91 * escala;
    const gotaZ = Math.sin(angulo) * 0.91 * escala;

    criarEsfera(
      0.13 * escala,
      corCobertura,
      gotaX,
      baseY + (0.39 + (i % 3) * 0.045) * escala,
      gotaZ,
      grupo
    );
  }

  // Decoração do bolo
  for (let i = 0; i < 6; i++) {
    const angulo = (i / 6) * Math.PI * 2;
    const dx = Math.cos(angulo) * 0.68 * escala;
    const dz = Math.sin(angulo) * 0.68 * escala;

    if (dados.decoracao === 'Morango') {
      criarCilindro(
        0.07 * escala,
        0.12 * escala,
        0.2 * escala,
        coresDecoracao.Morango,
        dx,
        baseY + 0.68 * escala,
        dz,
        grupo,
        12
      );
    } else if (dados.decoracao === 'Confete') {
      criarEsfera(
        0.075 * escala,
        ['#f4d35e', '#70c9a1', '#b9a1ec', '#f08bbd'][i % 4],
        dx,
        baseY + 0.67 * escala,
        dz,
        grupo
      );
    } else {
      criarEsfera(
        0.09 * escala,
        coresDecoracao.Chocolate,
        dx,
        baseY + 0.68 * escala,
        dz,
        grupo
      );
    }
  }

  // Vela no centro
  criarCilindro(
    0.045 * escala,
    0.045 * escala,
    0.3 * escala,
    '#fff9fc',
    0,
    baseY + 0.78 * escala,
    0,
    grupo,
    12
  );

  criarEsfera(
    0.07 * escala,
    '#ffb347',
    0,
    baseY + 0.97 * escala,
    0,
    grupo
  );
}

const escolha = {
  massa: 'Chocolate',
  cobertura: 'Rosa',
  decoracao: 'Morango'
};

let pedido = {
  massa: 'Chocolate',
  cobertura: 'Rosa',
  decoracao: 'Morango'
};

let pontos = 0;
let tempo = 90;
let fase = 1;
let acertos = 0;
let jogoAtivo = true;
let relogio = null;

const elementoPontos = document.getElementById('pontos');
const elementoTempo = document.getElementById('tempo');
const elementoFase = document.getElementById('fase');
const elementoMensagem = document.getElementById('mensagem');
const elementoStatus = document.getElementById('status');

function atualizarIndicadores() {
  elementoPontos.textContent = pontos;
  elementoTempo.textContent = tempo;
  elementoFase.textContent = fase;
}

function mostrarMensagem(texto, tipo = '') {
  elementoMensagem.textContent = texto;
  elementoMensagem.className = `mensagem ${tipo}`;
}

function atualizarBoloDoJogador() {
  criarBolo(boloGrupo, escolha, 0.8);
  boloGrupo.position.set(-5, 1.2, 0.5);
}

function atualizarBoloDoPedido() {
  criarBolo(pedidoGrupo, pedido, 0.48);
  pedidoGrupo.position.set(4, 1.4, -3.1);
}

function atualizarTextoPedido() {
  document.getElementById('pedido-massa').textContent = pedido.massa;
  document.getElementById('pedido-cobertura').textContent = pedido.cobertura;
  document.getElementById('pedido-decoracao').textContent = pedido.decoracao;

  const modelo = document.getElementById('modelo-pedido');
  modelo.innerHTML = '';

  const boloEmoji = document.createElement('span');
  boloEmoji.textContent = '🎂';
  boloEmoji.style.filter = 'drop-shadow(0 5px 5px #ad76a244)';
  modelo.appendChild(boloEmoji);
}

function gerarPedido() {
  const massas = Object.keys(coresMassa);
  const coberturas = Object.keys(coresCobertura);
  const decoracoes = Object.keys(coresDecoracao);

  pedido = {
    massa: massas[Math.floor(Math.random() * massas.length)],
    cobertura: coberturas[Math.floor(Math.random() * coberturas.length)],
    decoracao: decoracoes[Math.floor(Math.random() * decoracoes.length)]
  };

  atualizarTextoPedido();
  atualizarBoloDoPedido();
}

function atualizarSelecaoVisual() {
  document.querySelectorAll('.opcao').forEach((botao) => {
    const tipo = botao.dataset.tipo;
    const valor = botao.dataset.valor;

    botao.classList.toggle(
      'selecionada',
      escolha[tipo] === valor
    );
  });
}

document.querySelectorAll('.opcao').forEach((botao) => {
  botao.addEventListener('click', () => {
    if (!jogoAtivo) return;

    const tipo = botao.dataset.tipo;
    const valor = botao.dataset.valor;

    escolha[tipo] = valor;

    atualizarSelecaoVisual();
    atualizarBoloDoJogador();

    mostrarMensagem('Seu bolo está ficando lindo! 🧁');
  });
});

document.getElementById('finalizar').addEventListener('click', () => {
  if (!jogoAtivo) return;

  const correto =
    escolha.massa === pedido.massa &&
    escolha.cobertura === pedido.cobertura &&
    escolha.decoracao === pedido.decoracao;

  if (correto) {
    pontos += 100;
    acertos++;

    mostrarMensagem('Pedido correto! O cliente amou! 💖', 'sucesso');

    if (acertos % 3 === 0) {
      fase++;
      tempo += 5;
      mostrarMensagem(
        `Perfeito! Você avançou para a fase ${fase}! 🎉`,
        'sucesso'
      );
    }
  } else {
    pontos = Math.max(0, pontos - 20);

    mostrarMensagem(
      'Ops! Confira a massa, a cobertura e a decoração do pedido.',
      'erro'
    );
  }

  atualizarIndicadores();

  if (correto) {
    escolha.massa = 'Chocolate';
    escolha.cobertura = 'Rosa';
    escolha.decoracao = 'Morango';

    atualizarSelecaoVisual();
    atualizarBoloDoJogador();

    gerarPedido();
  }
});

function encerrarJogo() {
  jogoAtivo = false;
  clearInterval(relogio);

  document.getElementById('finalizar').disabled = true;

  elementoStatus.textContent = 'Fábrica fechada';

  document.getElementById('resultado-final').textContent =
    `Você fez ${pontos} pontos e acertou ${acertos} pedidos!`;

  document.getElementById('modal-fim').classList.remove('escondido');
}

function iniciarRelogio() {
  clearInterval(relogio);

  relogio = setInterval(() => {
    if (!jogoAtivo) return;

    tempo--;
    atualizarIndicadores();

    if (tempo <= 0) {
      tempo = 0;
      atualizarIndicadores();
      encerrarJogo();
    }
  }, 1000);
}

function reiniciarJogo() {
  pontos = 0;
  tempo = 90;
  fase = 1;
  acertos = 0;
  jogoAtivo = true;

  escolha.massa = 'Chocolate';
  escolha.cobertura = 'Rosa';
  escolha.decoracao = 'Morango';

  document.getElementById('modal-fim').classList.add('escondido');
  document.getElementById('finalizar').disabled = false;

  elementoStatus.textContent = 'Fábrica aberta';

  atualizarSelecaoVisual();
  atualizarBoloDoJogador();
  gerarPedido();
  atualizarIndicadores();

  mostrarMensagem('Vamos preparar seu primeiro bolo!');

  iniciarRelogio();
}

document.getElementById('reiniciar').addEventListener('click', reiniciarJogo);

// Controle de câmera: arrastar para girar e rodinha para aproximar
let arrastando = false;
let posicaoAnteriorX = 0;
let posicaoAnteriorY = 0;
let rotacaoHorizontal = 0.65;
let rotacaoVertical = 0.45;
let distanciaCamera = 17;

function atualizarCamera() {
  rotacaoVertical = THREE.MathUtils.clamp(
    rotacaoVertical,
    0.15,
    1.15
  );

  distanciaCamera = THREE.MathUtils.clamp(
    distanciaCamera,
    10,
    24
  );

  camera.position.x =
    Math.sin(rotacaoHorizontal) *
    Math.cos(rotacaoVertical) *
    distanciaCamera;

  camera.position.y =
    2 + Math.sin(rotacaoVertical) * distanciaCamera;

  camera.position.z =
    Math.cos(rotacaoHorizontal) *
    Math.cos(rotacaoVertical) *
    distanciaCamera;

  camera.lookAt(0, 2, 0);
}

renderizador.domElement.addEventListener('pointerdown', (evento) => {
  arrastando = true;
  posicaoAnteriorX = evento.clientX;
  posicaoAnteriorY = evento.clientY;

  renderizador.domElement.setPointerCapture(evento.pointerId);
});

renderizador.domElement.addEventListener('pointermove', (evento) => {
  if (!arrastando) return;

  const movimentoX = evento.clientX - posicaoAnteriorX;
  const movimentoY = evento.clientY - posicaoAnteriorY;

  rotacaoHorizontal -= movimentoX * 0.006;
  rotacaoVertical += movimentoY * 0.004;

  posicaoAnteriorX = evento.clientX;
  posicaoAnteriorY = evento.clientY;

  atualizarCamera();
});

renderizador.domElement.addEventListener('pointerup', () => {
  arrastando = false;
});

renderizador.domElement.addEventListener('pointercancel', () => {
  arrastando = false;
});

renderizador.domElement.addEventListener(
  'wheel',
  (evento) => {
    evento.preventDefault();

    distanciaCamera += evento.deltaY * 0.01;

    atualizarCamera();
  },
  { passive: false }
);

// Redimensionar a cena conforme a tela
window.addEventListener('resize', () => {
  const largura = cenaElemento.clientWidth;
  const altura = cenaElemento.clientHeight;

  camera.aspect = largura / altura;
  camera.updateProjectionMatrix();

  renderizador.setSize(largura, altura);
});

// Animação da confeitaria
const relogioAnimacao = new THREE.Clock();

function animar() {
  requestAnimationFrame(animar);

  const tempoAnimacao = relogioAnimacao.getElapsedTime();

  boloGrupo.rotation.y = Math.sin(tempoAnimacao * 0.7) * 0.06;
  pedidoGrupo.rotation.y = Math.sin(tempoAnimacao * 0.7) * 0.04;

  esteiras.forEach((esteira) => {
    esteira.rolos.forEach((rolo) => {
      rolo.rotation.x += 0.015;
    });
  });

  renderizador.render(cena, camera);
}

// Iniciar o jogo
atualizarCamera();
atualizarBoloDoJogador();
gerarPedido();
atualizarIndicadores();
iniciarRelogio();
animar();