import * as THREE from 'three';

const cenaElemento = document.getElementById('cena');
const cena = new THREE.Scene();
cena.background = new THREE.Color('#21143d');
cena.fog = new THREE.Fog('#30204e', 26, 52);

const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
const renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderizador.shadowMap.enabled = true;
renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
renderizador.outputColorSpace = THREE.SRGBColorSpace;
renderizador.toneMapping = THREE.ACESFilmicToneMapping;
renderizador.toneMappingExposure = 1.15;
cenaElemento.appendChild(renderizador.domElement);

const cores = {
  chocolate: '#75432f',
  baunilha: '#ffe0a3',
  morango: '#f4a0c0',
  rosa: '#f08bbd',
  chocolateCobertura: '#75432f',
  branca: '#fff9fc',
  confete1: '#f4d35e',
  confete2: '#70c9a1',
  confete3: '#b9a1ec',
  confete4: '#f08bbd',
  creme: '#fff0d5',
  marrom: '#8c573c',
  limao: '#b7d96b',
  frutasVermelhas: '#8d315d',
  mirtilo: '#6e69bd',
  cenoura: '#d9894b',
  pistache: '#a6bd79',
  azul: '#80d4f5',
  lilas: '#b9a1ec',
  verde: '#9edbb4',
  amarelo: '#ffe07a',
  caramelo: '#c88754',
  vermelho: '#f16b7d'
};

const dadosIngredientes = {
  massa: [
    { nome: 'Chocolate', emoji: '🍫', cor: cores.chocolate },
    { nome: 'Baunilha', emoji: '🍦', cor: cores.baunilha },
    { nome: 'Morango', emoji: '🍓', cor: cores.morango },
    { nome: 'Red velvet', emoji: '❤️', cor: '#b83d58' },
    { nome: 'Limão', emoji: '🍋', cor: cores.limao },
    { nome: 'Mirtilo', emoji: '🫐', cor: cores.mirtilo },
    { nome: 'Cenoura', emoji: '🥕', cor: cores.cenoura },
    { nome: 'Pistache', emoji: '💚', cor: cores.pistache }
  ],
  cobertura: [
    { nome: 'Rosa', emoji: '🩷', cor: cores.rosa },
    { nome: 'Chocolate', emoji: '🍫', cor: cores.chocolateCobertura },
    { nome: 'Branca', emoji: '🤍', cor: cores.branca },
    { nome: 'Azul', emoji: '🩵', cor: cores.azul },
    { nome: 'Lilás', emoji: '💜', cor: cores.lilas },
    { nome: 'Verde', emoji: '💚', cor: cores.verde },
    { nome: 'Amarela', emoji: '💛', cor: cores.amarelo },
    { nome: 'Caramelo', emoji: '🍯', cor: cores.caramelo },
    { nome: 'Vermelha', emoji: '❤️', cor: cores.vermelho }
  ],
  decoracao: [
    { nome: 'Morango', emoji: '🍓' },
    { nome: 'Confete', emoji: '🌈' },
    { nome: 'Chocolate', emoji: '🍫' },
    { nome: 'Cereja', emoji: '🍒' },
    { nome: 'Estrela', emoji: '⭐' },
    { nome: 'Chantilly', emoji: '🍦' },
    { nome: 'Macaron', emoji: '🍬' },
    { nome: 'Bolacha', emoji: '🍪' },
    { nome: 'Flor', emoji: '🌸' },
    { nome: 'Marshmallow', emoji: '☁️' },
    { nome: 'Vela', emoji: '🕯️' },
    { nome: 'Wafer', emoji: '🥢' }
  ]
};

const mapaCoresMassa = {
  Chocolate: cores.chocolate, Baunilha: cores.baunilha, Morango: cores.morango,
  'Red velvet': '#b83d58', Limão: cores.limao, Mirtilo: cores.mirtilo,
  Cenoura: cores.cenoura, Pistache: cores.pistache
};
const mapaCoresCobertura = {
  Rosa: cores.rosa, Chocolate: cores.chocolateCobertura, Branca: cores.branca,
  Azul: cores.azul, Lilás: cores.lilas, Verde: cores.verde,
  Amarela: cores.amarelo, Caramelo: cores.caramelo, Vermelha: cores.vermelho
};

const materiais = new Map();
function mat(cor, rugosidade = 0.78, metalness = 0) {
  const chave = `${cor}-${rugosidade}-${metalness}`;
  if (!materiais.has(chave)) {
    materiais.set(chave, new THREE.MeshStandardMaterial({
      color: cor, roughness: rugosidade, metalness
    }));
  }
  return materiais.get(chave);
}

function caixa(w, h, d, cor, x, y, z, grupo = cena, opts = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(cor));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (opts.rotZ) mesh.rotation.z = opts.rotZ;
  grupo.add(mesh);
  return mesh;
}

function cilindro(rt, rb, h, cor, x, y, z, grupo = cena, segmentos = 32) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segmentos), mat(cor));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  grupo.add(mesh);
  return mesh;
}

function esfera(r, cor, x, y, z, grupo = cena) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), mat(cor));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  grupo.add(mesh);
  return mesh;
}

function plano(w, h, cor, x, y, z, grupo = cena) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: cor }));
  mesh.position.set(x, y, z);
  grupo.add(mesh);
  return mesh;
}

// Iluminação
cena.add(new THREE.HemisphereLight('#fff4ff', '#47246f', 2.4));
const luzPrincipal = new THREE.DirectionalLight('#fff1c2', 3.5);
luzPrincipal.position.set(8, 14, 8);
luzPrincipal.castShadow = true;
luzPrincipal.shadow.mapSize.set(2048, 2048);
luzPrincipal.shadow.camera.left = -16;
luzPrincipal.shadow.camera.right = 16;
luzPrincipal.shadow.camera.top = 16;
luzPrincipal.shadow.camera.bottom = -16;
cena.add(luzPrincipal);
const luzRosa = new THREE.PointLight('#ff2e93', 42, 20);
luzRosa.position.set(-5, 5, 3);
cena.add(luzRosa);

// Cenário da fábrica
caixa(24, 0.35, 20, '#56317e', 0, -0.2, 0);
caixa(24, 8, 0.3, '#3d237b', 0, 3.8, -8);
caixa(0.3, 8, 20, '#48247e', -12, 3.8, 0);
caixa(0.3, 8, 20, '#48247e', 12, 3.8, 0);

for (let i = 0; i < 9; i++) {
  caixa(1.5, 0.12, 0.15, i % 2 ? '#ffffff' : '#f4b8d5', -8 + i * 2, 6.7, -7.78);
}

function janela(x) {
  caixa(2.5, 2.3, 0.12, '#ffffff', x, 4.3, -7.65);
  caixa(2.15, 1.95, 0.08, '#aee5f7', x, 4.3, -7.56);
  caixa(0.09, 2, 0.12, '#ffffff', x, 4.3, -7.48);
  caixa(2.2, 0.09, 0.12, '#ffffff', x, 4.3, -7.48);
}
janela(-8);
janela(8);

function letreiro() {
  caixa(5.4, 1.25, 0.2, '#ffffff', 0, 6.5, -7.2);
  caixa(5.1, 0.95, 0.12, '#f6c1dd', 0, 6.5, -7.05);
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 220;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#c84c91';
  ctx.font = 'bold 108px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DOCE FÁBRICA', 512, 110);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const placa = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 1),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  placa.position.set(0, 6.5, -6.97);
  cena.add(placa);
}
letreiro();

function balcao(x, z, largura = 5) {
  caixa(largura, 1.2, 1.5, '#e83e8c', x, 0.6, z);
  caixa(largura + 0.2, 0.18, 1.7, '#ffcf33', x, 1.3, z);
  for (let i = 0; i < 3; i++) {
    caixa(0.08, 0.65, 0.08, '#7b1fa2', x - largura / 2 + 0.8 + i * 1.5, 0.55, z + 0.77);
  }
}
balcao(-5, -3.8, 5);
balcao(4.7, -3.8, 5.5);

for (let i = 0; i < 3; i++) {
  caixa(5, 0.12, 0.7, '#d9a4c5', 0, 3 + i * 1.25, -7.35);
  for (let j = 0; j < 5; j++) {
    const cor = ['#f7a9c8', '#b9a1ec', '#ffe09b', '#a9dfc0', '#f5c5e0'][j];
    caixa(0.65, 0.65, 0.45, cor, -2 + j, 3.4 + i * 1.25, -7.25);
  }
}

function maquina(x, z, cor) {
  caixa(2.2, 2.5, 1.8, '#fff9fc', x, 1.25, z);
  caixa(2.25, 0.35, 1.85, cor, x, 2.55, z);
  caixa(1.3, 0.7, 0.12, '#bce8f5', x, 1.6, z + 0.92);
  caixa(0.45, 0.15, 0.15, '#b9a1ec', x, 0.8, z + 1);
  cilindro(0.2, 0.2, 0.2, '#f4b6d6', x + 0.65, 2.85, z);
}
maquina(-7, -2.8, '#f5a9cd');
maquina(0, -2.8, '#b9a1ec');
maquina(7, -2.8, '#a9dfc0');

const esteiras = [];
function criarEsteira(x, z, largura = 5.6) {
  const grupo = new THREE.Group();
  grupo.position.set(x, 0, z);
  cena.add(grupo);

  // Bancada completa: pés apoiados no chão, armário frontal e tampo espesso.
  const profundidade = 2.0;
  caixa(largura - 0.32, 0.92, profundidade - 0.28, '#b71970', 0, 0.55, 0, grupo);
  caixa(largura + 0.18, 0.18, profundidade + 0.12, '#ffcf33', 0, 1.08, 0, grupo);
  caixa(largura - 0.38, 0.055, profundidade - 0.34, '#fff0a6', 0, 1.185, 0, grupo);
  // Painel frontal com acabamento e puxadores para parecer um móvel fechado.
  caixa(largura - 0.62, 0.56, 0.055, '#ed3b91', 0, 0.56, profundidade / 2 - 0.08, grupo);
  caixa(largura - 0.72, 0.045, 0.07, '#ffcf33', 0, 0.89, profundidade / 2 - 0.035, grupo);
  for (const lado of [-1, 1]) {
    caixa(0.16, 0.22, 0.16, '#7b1fa2', lado * (largura / 2 - 0.28), 0.12, lado * 0.62, grupo);
  }
  // Rodapé escuro encostado ao piso, sem deixar o móvel visualmente suspenso.
  caixa(largura - 0.48, 0.12, profundidade - 0.42, '#45105f', 0, 0.06, 0, grupo);

  // Faixas decorativas e pequenos rebites no tampo.
  for (let i = 0; i < 9; i++) {
    esfera(0.035, '#fff6c9', -largura / 2 + 0.38 + i * (largura - 0.76) / 8, 1.19, profundidade / 2 - 0.12, grupo);
  }
  // A superfície fica limpa: os rolos antigos atravessavam visualmente o bolo.
  // Pequenos trilhos laterais dão acabamento sem cruzar a área de montagem.
  caixa(0.07, 0.07, profundidade - 0.28, '#fff0c4', -largura / 2 + 0.18, 1.19, 0, grupo);
  caixa(0.07, 0.07, profundidade - 0.28, '#fff0c4', largura / 2 - 0.18, 1.19, 0, grupo);
  esteiras.push({ rolos: [] });
}
criarEsteira(0, 0.5, 5.8);

// Área de montagem interativa
const boloGrupo = new THREE.Group();
cena.add(boloGrupo);
boloGrupo.position.set(0, 1.17, 0.5);

const pedidoGrupo = new THREE.Group();
cena.add(pedidoGrupo);
pedidoGrupo.position.set(4.7, 1.39, -3.8);

const baseBoloGrupo = new THREE.Group();
boloGrupo.add(baseBoloGrupo);
const coberturaGrupo = new THREE.Group();
boloGrupo.add(coberturaGrupo);
const decoracoesGrupo = new THREE.Group();
boloGrupo.add(decoracoesGrupo);

let decoracoes = [];
let estadoBolo = {
  massa: 'Chocolate',
  cobertura: 'Rosa',
  decoracaoPadrao: 'Morango'
};
let historico = [];

function esvaziarGrupo(grupo) {
  while (grupo.children.length) {
    const obj = grupo.children.pop();
    if (obj.parent) obj.parent.remove(obj);
    obj.traverse?.((child) => {
      if (child.geometry) child.geometry.dispose();
    });
  }
}

function limparGrupo(grupo) {
  while (grupo.children.length) {
    const obj = grupo.children[0];
    grupo.remove(obj);
    obj.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material && child.material.map) child.material.map.dispose();
    });
  }
}

function criarBaseBolo(grupo, massa, escala = 1) {
  const cor = mapaCoresMassa[massa] || cores.chocolate;
  const base = cilindro(1.0 * escala, 1.0 * escala, 0.5 * escala, cor, 0, 0.25 * escala, 0, grupo, 48);
  base.userData.parteBolo = true;
  // Pequena faixa visual no meio da massa
  cilindro(1.01 * escala, 1.01 * escala, 0.06 * escala, '#fff0df', 0, 0.25 * escala, 0, grupo, 48);
}

function criarCobertura(grupo, cobertura, escala = 1) {
  const cor = mapaCoresCobertura[cobertura] || cores.rosa;
  cilindro(1.06 * escala, 1.06 * escala, 0.13 * escala, cor, 0, 0.54 * escala, 0, grupo, 48);
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const altura = 0.38 + (i % 3) * 0.045;
    esfera(0.12 * escala, cor, Math.cos(ang) * 0.92 * escala, altura * escala, Math.sin(ang) * 0.92 * escala, grupo);
  }
}

function criarFolha(grupo, x, y, z, escala = 1, rotacao = 0) {
  const folha = new THREE.Mesh(
    new THREE.SphereGeometry(0.075 * escala, 12, 10),
    mat('#4fa968', 0.7)
  );
  folha.position.set(x, y, z);
  folha.scale.set(1.2, 0.35, 0.55);
  folha.rotation.y = rotacao;
  folha.rotation.z = -0.35;
  folha.castShadow = true;
  grupo.add(folha);
  return folha;
}

function criarMorango3D(grupo, x, y, z, escala = 1, rotacao = 0) {
  // Corpo afunilado, com a ponta voltada para baixo.
  const corpo = new THREE.Mesh(
    new THREE.SphereGeometry(0.16 * escala, 24, 18),
    new THREE.MeshStandardMaterial({
      color: '#ef476f',
      roughness: 0.42,
      metalness: 0
    })
  );
  corpo.position.set(x, y, z);
  corpo.scale.set(0.82, 1.05, 0.82);
  corpo.rotation.z = Math.PI;
  corpo.rotation.y = rotacao;
  corpo.castShadow = true;
  corpo.receiveShadow = true;
  grupo.add(corpo);

  // Pequenas sementes douradas na superfície do morango.
  for (let i = 0; i < 7; i++) {
    const ang = (i / 7) * Math.PI * 2;
    const seedY = (i % 3 - 1) * 0.055 * escala;
    const seedX = x + Math.cos(ang) * 0.105 * escala;
    const seedZ = z + Math.sin(ang) * 0.105 * escala;
    const semente = new THREE.Mesh(
      new THREE.SphereGeometry(0.012 * escala, 8, 6),
      mat('#ffe7a8', 0.5)
    );
    semente.position.set(seedX, y + seedY, seedZ);
    semente.castShadow = true;
    grupo.add(semente);
  }

  // Coroa de folhas em cima.
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    criarFolha(
      grupo,
      x + Math.cos(ang) * 0.065 * escala,
      y + 0.14 * escala,
      z + Math.sin(ang) * 0.065 * escala,
      escala,
      ang
    );
  }
}

function criarCereja3D(grupo, x, y, z, escala = 1, indice = 0) {
  const cor = indice % 2 === 0 ? '#d91e50' : '#f34f70';
  const cereja = new THREE.Mesh(
    new THREE.SphereGeometry(0.13 * escala, 24, 18),
    new THREE.MeshPhysicalMaterial({
      color: cor,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.18
    })
  );
  cereja.position.set(x, y, z);
  cereja.scale.set(1, 0.88, 1);
  cereja.castShadow = true;
  grupo.add(cereja);

  const haste = cilindro(
    0.014 * escala, 0.022 * escala, 0.22 * escala,
    '#478c50', x + 0.025 * escala, y + 0.16 * escala, z,
    grupo, 10
  );
  haste.rotation.z = -0.25;

  esfera(0.025 * escala, '#ffffff', x - 0.045 * escala, y + 0.025 * escala, z + 0.09 * escala, grupo);
}

function criarChantilly(grupo, x, y, z, escala = 1, cor = '#fffafc') {
  // Espiral ascendente construída com segmentos tubulares.
  const pontos = [];
  const voltas = 2.5;
  const passos = 44;
  for (let i = 0; i <= passos; i++) {
    const t = i / passos;
    const ang = t * voltas * Math.PI * 2;
    const raio = (0.13 * (1 - t) + 0.012) * escala;
    pontos.push(new THREE.Vector3(
      x + Math.cos(ang) * raio,
      y + t * 0.28 * escala,
      z + Math.sin(ang) * raio
    ));
  }
  const curva = new THREE.CatmullRomCurve3(pontos);
  const creme = new THREE.Mesh(
    new THREE.TubeGeometry(curva, 52, 0.055 * escala, 10, false),
    new THREE.MeshStandardMaterial({
      color: cor,
      roughness: 0.3
    })
  );
  creme.castShadow = true;
  creme.receiveShadow = true;
  grupo.add(creme);

  esfera(0.055 * escala, cor, x, y + 0.28 * escala, z, grupo);
}

function criarEstrela3D(grupo, x, y, z, escala = 1, indice = 0) {
  const coresEstrela = ['#ffda69', '#ffb7dc', '#c6a8ff'];
  const estrela = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.12 * escala, 0),
    new THREE.MeshStandardMaterial({
      color: coresEstrela[indice % coresEstrela.length],
      roughness: 0.3,
      metalness: 0.12
    })
  );
  estrela.position.set(x, y, z);
  estrela.rotation.set(0.35, indice * 0.7, 0.25);
  estrela.scale.set(1.15, 0.65, 1.15);
  estrela.castShadow = true;
  grupo.add(estrela);
}

function criarGranulado3D(grupo, x, y, z, escala = 1, indice = 0) {
  const coresGranulado = ['#ff6fae', '#ffd166', '#73d6ae', '#a98bfa', '#69c9f0'];
  const granulado = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.025 * escala, 0.09 * escala, 3, 8),
    new THREE.MeshStandardMaterial({
      color: coresGranulado[indice % coresGranulado.length],
      roughness: 0.38
    })
  );
  granulado.position.set(x, y, z);
  granulado.rotation.set(0.2 + indice * 0.3, indice * 0.8, 0.6 + indice * 0.45);
  granulado.castShadow = true;
  grupo.add(granulado);
}

function corDecoracao(nome, indice = 0) {
  const coresExtras = {
    Morango: '#ef476f', Chocolate: '#75432f', Cereja: '#d91e50',
    Estrela: '#ffda69', Chantilly: '#fffafc', Macaron: ['#ffb4d2','#b8a1ef','#8edbc1'][indice % 3],
    Bolacha: '#c78a55', Flor: ['#ff8fbd','#fff0a6','#bda5ff'][indice % 3],
    Marshmallow: '#fff3fb', Vela: ['#ff6fae','#6acbf1','#ffd166','#a98bfa'][indice % 4],
    Wafer: '#dba56b'
  };
  if (nome === 'Confete') return ['#ff6fae', '#ffd166', '#73d6ae', '#a98bfa', '#69c9f0'][indice % 5];
  return coresExtras[nome] || '#ff8fbd';
}

function criarItemDecoracao(grupo, item, escala = 1) {
  const { nome, x, z, indice = 0 } = item;
  const y = 0.67 * escala;

  if (nome === 'Morango') {
    criarMorango3D(grupo, x, y, z, escala, indice * 0.7);
  } else if (nome === 'Cereja') {
    criarCereja3D(grupo, x, y, z, escala, indice);
  } else if (nome === 'Estrela') {
    criarEstrela3D(grupo, x, y, z, escala, indice);
  } else if (nome === 'Chantilly') {
    criarChantilly(grupo, x, y - 0.05 * escala, z, escala);
  } else if (nome === 'Chocolate') {
    // Quadradinho de chocolate com brilho e pequenas ranhuras.
    const doce = caixa(
      0.19 * escala, 0.12 * escala, 0.18 * escala,
      '#75432f', x, y, z, grupo
    );
    doce.rotation.y = indice * 0.7;
    doce.rotation.x = -0.12;
    caixa(
      0.12 * escala, 0.018 * escala, 0.035 * escala,
      '#a86b4c', x, y + 0.068 * escala, z, grupo
    );
  } else if (nome === 'Macaron') {
    cilindro(0.14 * escala, 0.14 * escala, 0.09 * escala, corDecoracao(nome, indice), x, y, z, grupo, 24);
    cilindro(0.145 * escala, 0.145 * escala, 0.025 * escala, '#fff2f8', x, y, z, grupo, 24);
    esfera(0.12 * escala, corDecoracao(nome, indice), x, y + 0.045 * escala, z, grupo);
  } else if (nome === 'Bolacha') {
    cilindro(0.13 * escala, 0.13 * escala, 0.065 * escala, corDecoracao(nome, indice), x, y, z, grupo, 20);
    for (let i = 0; i < 4; i++) esfera(0.018 * escala, '#70432d', x + Math.cos(i * 1.6) * 0.07 * escala, y + 0.035 * escala, z + Math.sin(i * 1.6) * 0.07 * escala, grupo);
  } else if (nome === 'Flor') {
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      esfera(0.075 * escala, corDecoracao(nome, indice), x + Math.cos(a) * 0.07 * escala, y, z + Math.sin(a) * 0.07 * escala, grupo);
    }
    esfera(0.055 * escala, '#ffdf73', x, y + 0.025 * escala, z, grupo);
  } else if (nome === 'Marshmallow') {
    const doce = esfera(0.11 * escala, '#fff4fb', x, y, z, grupo);
    doce.scale.set(1.25, 0.85, 0.9);
    doce.rotation.z = indice * 0.3;
  } else if (nome === 'Vela') {
    cilindro(0.035 * escala, 0.035 * escala, 0.27 * escala, corDecoracao(nome, indice), x, y + 0.11 * escala, z, grupo, 12);
    esfera(0.045 * escala, '#ffb347', x, y + 0.28 * escala, z, grupo);
    esfera(0.025 * escala, '#fff2a6', x, y + 0.29 * escala, z, grupo);
  } else if (nome === 'Wafer') {
    const wafer = caixa(0.09 * escala, 0.32 * escala, 0.09 * escala, corDecoracao(nome, indice), x, y + 0.09 * escala, z, grupo);
    wafer.rotation.z = indice % 2 ? -0.18 : 0.18;
    caixa(0.095 * escala, 0.025 * escala, 0.095 * escala, '#f5d4a5', x, y + 0.11 * escala, z, grupo);
  } else {
    criarGranulado3D(grupo, x, y, z, escala, indice);
  }
}

function desenharBoloJogador() {
  limparGrupo(baseBoloGrupo);
  limparGrupo(coberturaGrupo);
  limparGrupo(decoracoesGrupo);
  criarBaseBolo(baseBoloGrupo, estadoBolo.massa, 0.8);
  criarCobertura(coberturaGrupo, estadoBolo.cobertura, 0.8);
  decoracoes.forEach((item, i) => criarItemDecoracao(decoracoesGrupo, { ...item, indice: i }, 0.8));
}

function desenharBoloPedido() {
  limparGrupo(pedidoGrupo);
  criarBaseBolo(pedidoGrupo, pedido.massa, 0.48);
  criarCobertura(pedidoGrupo, pedido.cobertura, 0.48);
  const quantidade = pedido.decoracao === 'Confete' ? 12 : pedido.decoracao === 'Chantilly' ? 4 : pedido.decoracao === 'Vela' ? 3 : 5;
  for (let i = 0; i < quantidade; i++) {
    const ang = (i / quantidade) * Math.PI * 2;
    const nome = pedido.decoracao === 'Confete' ? 'Confete' : pedido.decoracao;
    criarItemDecoracao(pedidoGrupo, {
      nome, x: Math.cos(ang) * 0.31, z: Math.sin(ang) * 0.31, indice: i
    }, 0.48);
  }
  pedidoGrupo.position.set(4.7, 1.39, -3.8);
}

function salvarHistorico() {
  historico.push({
    estadoBolo: { ...estadoBolo },
    decoracoes: decoracoes.map(item => ({ ...item }))
  });
  if (historico.length > 25) historico.shift();
}

function adicionarDecoracao(nome, ponto) {
  if (decoracoes.length >= 18) {
    mensagem('O bolo já está cheio de enfeites! Use desfazer para remover algum.', 'erro');
    return;
  }
  salvarHistorico();
  const pos = ponto || posicaoDecoracaoLivre();
  decoracoes.push({ nome, x: pos.x, z: pos.z, indice: decoracoes.length });
  desenharBoloJogador();
  mensagem(`${nome} adicionado ao bolo! ✨`, 'sucesso');
}

function posicaoDecoracaoLivre() {
  const quantidade = decoracoes.length;
  const ang = quantidade * 2.39996;
  const raio = 0.18 + (quantidade % 3) * 0.18;
  return { x: Math.cos(ang) * raio, z: Math.sin(ang) * raio };
}

let pedido;
let pontos = 0;
let moedas = 0;
let tempo = 120;
let fase = 1;
let acertos = 0;
let jogoAtivo = true;
let relogio = null;
let abaAtual = 'massa';
let ingredienteSelecionado = { tipo: 'massa', nome: 'Chocolate', emoji: '🍫' };
let ingredienteEmArrasto = null;
let inicioArrastoIngrediente = null;
let arrastoRealizado = false;
let bloquearCliqueIngrediente = false;
let indicadorArrasto = null;

const $ = (id) => document.getElementById(id);
function mensagem(texto, tipo = '') {
  $('mensagem').textContent = texto;
  $('mensagem').className = `mensagem ${tipo}`;
}
function toast(texto) {
  const el = $('toast');
  el.textContent = texto;
  el.classList.add('visivel');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('visivel'), 1700);
}
function atualizarIndicadores() {
  $('pontos').textContent = pontos;
  $('moedas').textContent = moedas;
  $('tempo').textContent = tempo;
  $('fase').textContent = fase;
}
function atualizarResumoPedido() {
  $('pedido-massa').textContent = pedido.massa;
  $('pedido-cobertura').textContent = pedido.cobertura;
  $('pedido-decoracao').textContent = pedido.decoracao;
  $('pedido-resumo').textContent = `Bolo de ${pedido.massa.toLowerCase()} com cobertura ${pedido.cobertura.toLowerCase()} e ${pedido.decoracao.toLowerCase()}.`;
  $('pedido-emoji').textContent = (dadosIngredientes.decoracao.find(item => item.nome === pedido.decoracao) || { emoji: '🎂' }).emoji;
}

function gerarPedido() {
  const massas = dadosIngredientes.massa.map(item => item.nome);
  const coberturas = dadosIngredientes.cobertura.map(item => item.nome);
  const decoracoesDisponiveis = dadosIngredientes.decoracao.map(item => item.nome);
  pedido = {
    massa: massas[Math.floor(Math.random() * massas.length)],
    cobertura: coberturas[Math.floor(Math.random() * coberturas.length)],
    decoracao: decoracoesDisponiveis[Math.floor(Math.random() * decoracoesDisponiveis.length)]
  };
  atualizarResumoPedido();
  desenharBoloPedido();
}

function renderizarIngredientes() {
  const container = $('ingredientes');
  container.innerHTML = '';
  dadosIngredientes[abaAtual].forEach((item) => {
    const botao = document.createElement('button');
    botao.className = 'ingrediente';
    botao.draggable = false; // Arrasto customizado também funciona em telas touch.
    botao.dataset.tipo = abaAtual;
    botao.dataset.nome = item.nome;
    botao.innerHTML = `<span class="emoji">${item.emoji}</span><span class="nome">${item.nome}</span>`;
    const selecionado = ingredienteSelecionado.tipo === abaAtual && ingredienteSelecionado.nome === item.nome;
    if (selecionado) botao.classList.add('selecionado');
    botao.addEventListener('click', () => {
      if (bloquearCliqueIngrediente) {
        bloquearCliqueIngrediente = false;
        return;
      }
      selecionarIngrediente(abaAtual, item);
    });
    // Arrasto próprio com Pointer Events: funciona com mouse e com o dedo no celular.
    botao.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType === 'mouse' && evento.button !== 0) return;
      ingredienteEmArrasto = { tipo: abaAtual, nome: item.nome, emoji: item.emoji };
      inicioArrastoIngrediente = { x: evento.clientX, y: evento.clientY };
      arrastoRealizado = false;
      botao.setPointerCapture?.(evento.pointerId);
    });
    botao.addEventListener('pointermove', (evento) => {
      if (!ingredienteEmArrasto || !inicioArrastoIngrediente) return;
      const dx = evento.clientX - inicioArrastoIngrediente.x;
      const dy = evento.clientY - inicioArrastoIngrediente.y;
      if (Math.hypot(dx, dy) > 9) {
        arrastoRealizado = true;
        mostrarIndicadorArrasto(ingredienteEmArrasto, evento.clientX, evento.clientY);
      }
    });
    botao.addEventListener('pointerup', (evento) => {
      if (!ingredienteEmArrasto) return;
      const arrastado = ingredienteEmArrasto;
      const foiArrasto = arrastoRealizado;
      esconderIndicadorArrasto();
      ingredienteEmArrasto = null;
      inicioArrastoIngrediente = null;
      arrastoRealizado = false;
      if (foiArrasto) {
        bloquearCliqueIngrediente = true;
        setTimeout(() => { bloquearCliqueIngrediente = false; }, 250);
        const rect = renderizador.domElement.getBoundingClientRect();
        if (evento.clientX >= rect.left && evento.clientX <= rect.right && evento.clientY >= rect.top && evento.clientY <= rect.bottom) {
          aplicarIngredienteArrastado(arrastado, evento.clientX, evento.clientY);
        } else {
          toast('Solte o ingrediente em cima do bolo! 🎂');
        }
      }
    });
    botao.addEventListener('pointercancel', () => {
      ingredienteEmArrasto = null;
      inicioArrastoIngrediente = null;
      arrastoRealizado = false;
      esconderIndicadorArrasto();
    });
    botao.addEventListener('dragstart', (evento) => {
      ingredienteSelecionado = { tipo: abaAtual, nome: item.nome, emoji: item.emoji };
      evento.dataTransfer?.setData('text/plain', JSON.stringify(ingredienteSelecionado));
      evento.dataTransfer.effectAllowed = 'copy';
      atualizarSelecao();
    });
    container.appendChild(botao);
  });
  const dicas = {
    massa: 'ARRASTE a massa até o bolo para trocar o sabor. Também pode tocar para selecionar.',
    cobertura: 'ARRASTE a cobertura até o bolo para aplicar. Também pode tocar para selecionar.',
    decoracao: 'ARRASTE cada decoração para o ponto do bolo onde quer colocá-la. Funciona com mouse e dedo!'
  };
  $('ajuda-selecao').textContent = dicas[abaAtual];
}

function mostrarIndicadorArrasto(item, x, y) {
  if (!indicadorArrasto) {
    indicadorArrasto = document.createElement('div');
    indicadorArrasto.className = 'fantasma-ingrediente';
    document.body.appendChild(indicadorArrasto);
  }
  indicadorArrasto.textContent = `${item.emoji} ${item.nome}`;
  indicadorArrasto.style.left = `${x + 14}px`;
  indicadorArrasto.style.top = `${y + 14}px`;
  indicadorArrasto.classList.add('visivel');
}

function esconderIndicadorArrasto() {
  indicadorArrasto?.classList.remove('visivel');
}

function aplicarIngredienteArrastado(item, clientX, clientY) {
  if (!jogoAtivo) return;
  ingredienteSelecionado = item;
  atualizarSelecao();
  if (item.tipo === 'massa') {
    salvarHistorico();
    estadoBolo.massa = item.nome;
    desenharBoloJogador();
    mensagem(`Massa de ${item.nome.toLowerCase()} aplicada ao bolo! 🍰`, 'sucesso');
    return;
  }
  if (item.tipo === 'cobertura') {
    salvarHistorico();
    estadoBolo.cobertura = item.nome;
    desenharBoloJogador();
    mensagem(`Cobertura ${item.nome.toLowerCase()} aplicada ao bolo! 🍥`, 'sucesso');
    return;
  }
  definirPonteiro({ clientX, clientY });
  raycaster.setFromCamera(ponteiro, camera);
  const alvos = [...baseBoloGrupo.children, ...coberturaGrupo.children];
  const hits = raycaster.intersectObjects(alvos, true);
  if (!hits.length) {
    toast('Solte a decoração sobre o bolo! 🎂');
    return;
  }
  const local = boloGrupo.worldToLocal(hits[0].point.clone());
  const distancia = Math.hypot(local.x, local.z);
  if (distancia > 0.86) {
    toast('Coloque a decoração no topo do bolo!');
    return;
  }
  adicionarDecoracao(item.nome, {
    x: THREE.MathUtils.clamp(local.x / 0.8, -0.78, 0.78),
    z: THREE.MathUtils.clamp(local.z / 0.8, -0.78, 0.78)
  });
}

function selecionarIngrediente(tipo, item) {
  ingredienteSelecionado = { tipo, nome: item.nome, emoji: item.emoji };
  atualizarSelecao();
  if (tipo === 'massa') {
    salvarHistorico();
    estadoBolo.massa = item.nome;
    desenharBoloJogador();
    mensagem(`Massa de ${item.nome.toLowerCase()} escolhida! 🍰`, 'sucesso');
  } else if (tipo === 'cobertura') {
    salvarHistorico();
    estadoBolo.cobertura = item.nome;
    desenharBoloJogador();
    mensagem(`Cobertura ${item.nome.toLowerCase()} escolhida! 🍥`, 'sucesso');
  } else {
    mensagem(`${item.nome} selecionado. Agora toque ou clique no bolo para colocar!`);
    toast(`${item.emoji} ${item.nome} selecionado`);
  }
}

function atualizarSelecao() {
  document.querySelectorAll('.ingrediente').forEach((botao) => {
    botao.classList.toggle(
      'selecionado',
      botao.dataset.tipo === ingredienteSelecionado.tipo &&
      botao.dataset.nome === ingredienteSelecionado.nome
    );
  });
}

document.querySelectorAll('.aba').forEach((botao) => {
  botao.addEventListener('click', () => {
    abaAtual = botao.dataset.aba;
    document.querySelectorAll('.aba').forEach(b => b.classList.toggle('ativa', b === botao));
    renderizarIngredientes();
  });
});

$('desfazer').addEventListener('click', () => {
  if (!historico.length) {
    mensagem('Ainda não há nenhuma ação para desfazer.');
    return;
  }
  const anterior = historico.pop();
  estadoBolo = { ...anterior.estadoBolo };
  decoracoes = anterior.decoracoes.map(item => ({ ...item }));
  desenharBoloJogador();
  mensagem('Última alteração desfeita. ↩');
});

$('limpar').addEventListener('click', () => {
  salvarHistorico();
  estadoBolo = { massa: 'Chocolate', cobertura: 'Rosa', decoracaoPadrao: 'Morango' };
  decoracoes = [];
  desenharBoloJogador();
  mensagem('Seu bolo foi limpo. Monte de novo do seu jeito!');
});

$('finalizar').addEventListener('click', () => {
  if (!jogoAtivo) return;
  const decoracaoCerta = decoracoes.some(item => item.nome === pedido.decoracao);
  const correto = estadoBolo.massa === pedido.massa &&
    estadoBolo.cobertura === pedido.cobertura &&
    decoracaoCerta;

  if (correto) {
    pontos += 100 + Math.max(0, tempo);
    moedas += 10 + fase * 2;
    acertos++;
    mensagem('Pedido perfeito! O cliente adorou! 💖 +100 pontos e moedas!', 'sucesso');
    toast('⭐ Pedido perfeito!');
    if (acertos % 3 === 0) {
      fase++;
      tempo += 10;
      mensagem(`Você avançou para a fase ${fase}! Novos pedidos chegando! 🎉`, 'sucesso');
    }
    decoracoes = [];
    estadoBolo = { massa: 'Chocolate', cobertura: 'Rosa', decoracaoPadrao: 'Morango' };
    historico = [];
    desenharBoloJogador();
    gerarPedido();
  } else {
    pontos = Math.max(0, pontos - 15);
    mensagem('Quase! Confira a massa, a cobertura e coloque pelo menos uma decoração pedida.', 'erro');
  }
  atualizarIndicadores();
});

function encerrarJogo() {
  jogoAtivo = false;
  clearInterval(relogio);
  $('finalizar').disabled = true;
  $('status').textContent = 'Fábrica fechada';
  $('resultado-final').textContent = `Você fez ${pontos} pontos, ganhou ${moedas} moedas e acertou ${acertos} pedidos!`;
  $('modal-fim').classList.remove('escondido');
}

function iniciarRelogio() {
  clearInterval(relogio);
  relogio = setInterval(() => {
    if (!jogoAtivo) return;
    tempo = Math.max(0, tempo - 1);
    atualizarIndicadores();
    if (tempo <= 0) encerrarJogo();
  }, 1000);
}

$('reiniciar').addEventListener('click', () => {
  pontos = 0;
  moedas = 0;
  tempo = 120;
  fase = 1;
  acertos = 0;
  jogoAtivo = true;
  historico = [];
  decoracoes = [];
  estadoBolo = { massa: 'Chocolate', cobertura: 'Rosa', decoracaoPadrao: 'Morango' };
  $('modal-fim').classList.add('escondido');
  $('finalizar').disabled = false;
  $('status').textContent = 'Fábrica aberta';
  desenharBoloJogador();
  gerarPedido();
  atualizarIndicadores();
  mensagem('Seu primeiro pedido está esperando!');
  iniciarRelogio();
});

// Interação 3D com o bolo: raycasting permite colocar decoração no ponto clicado.
const raycaster = new THREE.Raycaster();
const ponteiro = new THREE.Vector2();
let pressionado = false;
let arrastou = false;
let xInicial = 0;
let yInicial = 0;
let rotacaoHorizontal = 0.62;
let rotacaoVertical = 0.42;
let distanciaCamera = 14.5;

function atualizarCamera() {
  rotacaoVertical = THREE.MathUtils.clamp(rotacaoVertical, 0.16, 1.05);
  distanciaCamera = THREE.MathUtils.clamp(distanciaCamera, 9, 20);
  // Mantém a bancada principal e o bolo no centro da área 3D.
  const centroBancadaX = 0;
  const centroBancadaZ = 0.5;
  camera.position.x = centroBancadaX + Math.sin(rotacaoHorizontal) * Math.cos(rotacaoVertical) * distanciaCamera;
  camera.position.y = 1.55 + Math.sin(rotacaoVertical) * distanciaCamera;
  camera.position.z = centroBancadaZ + Math.cos(rotacaoHorizontal) * Math.cos(rotacaoVertical) * distanciaCamera;
  camera.lookAt(centroBancadaX, 1.55, centroBancadaZ);
}

function definirPonteiro(evento) {
  const rect = renderizador.domElement.getBoundingClientRect();
  ponteiro.x = ((evento.clientX - rect.left) / rect.width) * 2 - 1;
  ponteiro.y = -((evento.clientY - rect.top) / rect.height) * 2 + 1;
}

function tentarColocarDecoracao(evento) {
  if (ingredienteSelecionado.tipo !== 'decoracao' || !jogoAtivo) return;
  definirPonteiro(evento);
  raycaster.setFromCamera(ponteiro, camera);
  const alvos = [...baseBoloGrupo.children, ...coberturaGrupo.children];
  const intersecoes = raycaster.intersectObjects(alvos, true);
  if (!intersecoes.length) return;

  const pontoMundo = intersecoes[0].point;
  const pontoLocal = boloGrupo.worldToLocal(pontoMundo.clone());
  const distancia = Math.sqrt(pontoLocal.x ** 2 + pontoLocal.z ** 2);
  if (distancia > 0.83) {
    toast('Coloque a decoração no topo do bolo!');
    return;
  }
  adicionarDecoracao(ingredienteSelecionado.nome, {
    x: THREE.MathUtils.clamp(pontoLocal.x / 0.8, -0.78, 0.78),
    z: THREE.MathUtils.clamp(pontoLocal.z / 0.8, -0.78, 0.78)
  });
}

renderizador.domElement.addEventListener('pointerdown', (evento) => {
  pressionado = true;
  arrastou = false;
  xInicial = evento.clientX;
  yInicial = evento.clientY;
  renderizador.domElement.setPointerCapture?.(evento.pointerId);
});

renderizador.domElement.addEventListener('pointermove', (evento) => {
  if (!pressionado) return;
  const dx = evento.clientX - xInicial;
  const dy = evento.clientY - yInicial;
  if (Math.abs(dx) + Math.abs(dy) > 5) arrastou = true;
  if (arrastou) {
    rotacaoHorizontal -= dx * 0.006;
    rotacaoVertical += dy * 0.004;
    xInicial = evento.clientX;
    yInicial = evento.clientY;
    atualizarCamera();
  }
});

renderizador.domElement.addEventListener('pointerup', (evento) => {
  if (pressionado && !arrastou) tentarColocarDecoracao(evento);
  pressionado = false;
});
renderizador.domElement.addEventListener('pointercancel', () => { pressionado = false; });

renderizador.domElement.addEventListener('dragover', (evento) => {
  evento.preventDefault();
  if (evento.dataTransfer) evento.dataTransfer.dropEffect = 'copy';
});
renderizador.domElement.addEventListener('drop', (evento) => {
  evento.preventDefault();
  if (!jogoAtivo) return;
  try {
    const item = JSON.parse(evento.dataTransfer?.getData('text/plain') || '{}');
    if (!item.tipo || !item.nome) return;
    ingredienteSelecionado = item;
    if (item.tipo === 'massa') {
      salvarHistorico();
      estadoBolo.massa = item.nome;
      desenharBoloJogador();
      mensagem(`Massa de ${item.nome.toLowerCase()} aplicada!`, 'sucesso');
    } else if (item.tipo === 'cobertura') {
      salvarHistorico();
      estadoBolo.cobertura = item.nome;
      desenharBoloJogador();
      mensagem(`Cobertura ${item.nome.toLowerCase()} aplicada!`, 'sucesso');
    } else {
      definirPonteiro(evento);
      raycaster.setFromCamera(ponteiro, camera);
      const alvos = [...baseBoloGrupo.children, ...coberturaGrupo.children];
      const hits = raycaster.intersectObjects(alvos, true);
      if (hits.length) {
        const local = boloGrupo.worldToLocal(hits[0].point.clone());
        adicionarDecoracao(item.nome, {
          x: THREE.MathUtils.clamp(local.x / 0.8, -0.78, 0.78),
          z: THREE.MathUtils.clamp(local.z / 0.8, -0.78, 0.78)
        });
      }
    }
  } catch {
    // Ignora itens arrastados que não sejam ingredientes do jogo.
  }
});

renderizador.domElement.addEventListener('wheel', (evento) => {
  evento.preventDefault();
  distanciaCamera += evento.deltaY * 0.01;
  atualizarCamera();
}, { passive: false });

window.addEventListener('resize', redimensionar);
function redimensionar() {
  const largura = Math.max(1, cenaElemento.clientWidth);
  const altura = Math.max(1, cenaElemento.clientHeight);
  camera.aspect = largura / altura;
  camera.updateProjectionMatrix();
  renderizador.setSize(largura, altura);
}
redimensionar();

// Animação
const relogioAnimacao = new THREE.Clock();
function animar() {
  requestAnimationFrame(animar);
  const t = relogioAnimacao.getElapsedTime();
  boloGrupo.rotation.y = 0;
  pedidoGrupo.rotation.y = 0;
  esteiras.forEach(esteira => esteira.rolos.forEach(rolo => { rolo.rotation.x += 0.012; }));
  renderizador.render(cena, camera);
}

// Começar
renderizarIngredientes();
desenharBoloJogador();
gerarPedido();
atualizarIndicadores();
atualizarCamera();
iniciarRelogio();
animar();
