
"use strict";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const today = () => new Date().toISOString().slice(0, 10);

const words = {
  pt: {
    brand:"Almoxarifado Inteligente",language:"Idioma",dashboard:"Painel",
    products:"Produtos",movements:"Movimentações",notes:"Anotações",
    alerts:"Alertas",suppliers:"Fornecedores",reports:"Relatórios",
    overview:"Resumo do estoque",newProduct:"Cadastrar produto",
    totalProducts:"Produtos cadastrados",units:"Unidades em estoque",
    lowStock:"Estoque baixo",recent:"Movimentações recentes",
    attention:"Precisam de atenção",quick:"Ações rápidas",
    addEntry:"Registrar entrada",addExit:"Registrar saída",
    search:"Pesquisar produtos...",all:"Todos",lowOnly:"Estoque baixo",
    noProducts:"Nenhum produto cadastrado.",name:"Nome do produto",
    code:"Código",quantity:"Quantidade atual",minimum:"Estoque mínimo",
    reorder:"Quantidade para repor",supplier:"Fornecedor",phone:"Telefone do fornecedor",
    location:"Localização",description:"Descrição",aliases:"Nomes alternativos",
    notesField:"Observações",photo:"Foto",camera:"Abrir câmera",
    takePhoto:"Tirar foto",choosePhoto:"Escolher foto",save:"Salvar",
    cancel:"Cancelar",edit:"Editar",details:"Detalhes",delete:"Excluir",
    stock:"Estoque",status:"Situação",normal:"Normal",critical:"Baixo",
    date:"Data",type:"Tipo",entry:"Entrada",exit:"Saída",
    adjustment:"Ajuste",amount:"Quantidade movimentada",reason:"Motivo / observação",
    submit:"Registrar movimentação",history:"Histórico",dailyNote:"Anotação do dia",
    notePlaceholder:"Ex.: saíram 2 fitas isolantes ou chegaram 10 caixas.",
    analyze:"Analisar anotação",plainNote:"Salvar como anotação simples",
    confirmMovement:"Confirmar movimentação",detected:"Interpretação encontrada",
    action:"Ação",apply:"Confirmar e atualizar estoque",
    noMatch:"Não identifiquei com segurança produto, quantidade e ação. Salve como anotação simples.",
    saved:"Salvo com sucesso.",deleted:"Excluído.",confirmDelete:"Excluir este produto?",
    productSaved:"Produto salvo.",movementSaved:"Movimentação registrada.",
    noteSaved:"Anotação salva.",noAlerts:"Nenhum produto com estoque baixo.",
    alertsText:"Produtos que atingiram ou passaram do limite mínimo.",
    orderMore:"Pedir mais",messageSupplier:"Mensagem ao fornecedor",
    noPhone:"Cadastre o telefone do fornecedor para abrir o WhatsApp.",
    noSuppliers:"Nenhum fornecedor cadastrado nos produtos.",productsCount:"Produtos",
    inventory:"Inventário atual",exportCSV:"Exportar CSV",noMovements:"Nenhuma movimentação.",
    totalValue:"Valor estimado",settings:"Configurações",refresh:"Atualizar dados",
    connected:"API conectada",disconnected:"API desconectada",
    localWarning:"Esta versão inicial usa armazenamento temporário no servidor. Os dados podem ser perdidos quando o servidor reiniciar. Configure um banco de dados antes de usar em produção.",
    serverError:"Não foi possível comunicar com o servidor.",
    quantityError:"Informe uma quantidade válida.",insufficient:"Saída maior que o estoque disponível.",
    orderTitle:"Pedido de reposição",orderQty:"Quantidade a pedir",message:"Mensagem",
    copy:"Copiar mensagem",openWhatsApp:"Abrir WhatsApp",close:"Fechar",
    company:"Empresa",companyPlaceholder:"Minha empresa",normalStock:"Estoque normal",
    inbound:"Entrada",outbound:"Saída",product:"Produto",value:"Valor unitário (opcional)",
    supplierMsg:"Olá! Gostaria de solicitar a reposição deste produto:",
    photoError:"Não foi possível abrir a câmera. Tente escolher uma foto ou usar HTTPS.",
    nameRequired:"Informe o nome do produto.",searchEmpty:"Nenhum resultado encontrado.",
    notesHistory:"Anotações salvas",processed:"Movimentação confirmada",
    simpleNote:"Anotação simples",restock:"Pedir reposição",
    productForm:"Cadastro de produto",stockInfo:"Informações do produto",
    restore:"Importar backup",backup:"Exportar backup",backupError:"Arquivo de backup inválido.",
    backupOk:"Backup importado.",noData:"Sem dados para exibir.",deleteConfirm:"Excluir",
    dashboardDesc:"Visão geral do seu almoxarifado",report:"Relatório de inventário",
    entries:"Entradas",exits:"Saídas",phoneLabel:"Telefone",saveNote:"Salvar anotação",
    dateFrom:"De",dateTo:"Até",loginNeeded:"Configure a autenticação antes de publicar para uso real."
  },
  en: {
    brand:"Smart Inventory",language:"Language",dashboard:"Dashboard",
    products:"Products",movements:"Movements",notes:"Daily notes",alerts:"Alerts",
    suppliers:"Suppliers",reports:"Reports",overview:"Inventory overview",
    newProduct:"Add product",totalProducts:"Registered products",units:"Units in stock",
    lowStock:"Low stock",recent:"Recent movements",attention:"Needs attention",
    quick:"Quick actions",addEntry:"Stock in",addExit:"Stock out",
    search:"Search products...",all:"All",lowOnly:"Low stock",
    noProducts:"No products registered.",name:"Product name",code:"Code",
    quantity:"Current quantity",minimum:"Minimum stock",reorder:"Restock quantity",
    supplier:"Supplier",phone:"Supplier phone",location:"Location",
    description:"Description",aliases:"Alternative names",notesField:"Notes",
    photo:"Photo",camera:"Open camera",takePhoto:"Take photo",choosePhoto:"Choose photo",
    save:"Save",cancel:"Cancel",edit:"Edit",details:"Details",delete:"Delete",
    stock:"Stock",status:"Status",normal:"Normal",critical:"Low",date:"Date",
    type:"Type",entry:"Stock in",exit:"Stock out",adjustment:"Adjustment",
    amount:"Quantity moved",reason:"Reason / note",submit:"Record movement",
    history:"History",dailyNote:"Daily note",notePlaceholder:"E.g. 2 rolls of tape went out or 10 boxes arrived.",
    analyze:"Analyze note",plainNote:"Save as simple note",confirmMovement:"Confirm movement",
    detected:"Detected interpretation",action:"Action",apply:"Confirm and update stock",
    noMatch:"Could not confidently identify the product, quantity, and action. Save as a simple note.",
    saved:"Saved successfully.",deleted:"Deleted.",confirmDelete:"Delete this product?",
    productSaved:"Product saved.",movementSaved:"Movement recorded.",noteSaved:"Note saved.",
    noAlerts:"No low-stock products.",alertsText:"Products at or below their configured minimum.",
    orderMore:"Restock",messageSupplier:"Message supplier",
    noPhone:"Add the supplier phone number to open WhatsApp.",
    noSuppliers:"No suppliers registered on products.",productsCount:"Products",
    inventory:"Current inventory",exportCSV:"Export CSV",noMovements:"No movements.",
    totalValue:"Estimated value",settings:"Settings",refresh:"Refresh data",
    connected:"API connected",disconnected:"API disconnected",
    localWarning:"This initial version uses temporary server storage. Data may be lost when the server restarts. Configure a database before production use.",
    serverError:"Could not communicate with the server.",quantityError:"Enter a valid quantity.",
    insufficient:"Stock out exceeds available inventory.",orderTitle:"Restock order",
    orderQty:"Quantity to order",message:"Message",copy:"Copy message",
    openWhatsApp:"Open WhatsApp",close:"Close",company:"Company",
    companyPlaceholder:"My company",normalStock:"Normal stock",inbound:"Stock in",
    outbound:"Stock out",product:"Product",value:"Unit value (optional)",
    supplierMsg:"Hello! I'd like to request a restock of this product:",
    photoError:"Could not open camera. Choose a photo or use HTTPS.",
    nameRequired:"Enter a product name.",searchEmpty:"No results found.",
    notesHistory:"Saved notes",processed:"Movement confirmed",simpleNote:"Simple note",
    restock:"Restock",productForm:"Product form",stockInfo:"Product information",
    restore:"Import backup",backup:"Export backup",backupError:"Invalid backup file.",
    backupOk:"Backup imported.",noData:"No data to display.",deleteConfirm:"Delete",
    dashboardDesc:"Your inventory overview",report:"Inventory report",
    entries:"Stock in",exits:"Stock out",phoneLabel:"Phone",saveNote:"Save note",
    dateFrom:"From",dateTo:"To",loginNeeded:"Configure authentication before real-world use."
  },
  es: {
    brand:"Inventario Inteligente",language:"Idioma",dashboard:"Panel",
    products:"Productos",movements:"Movimientos",notes:"Notas del día",
    alerts:"Alertas",suppliers:"Proveedores",reports:"Informes",
    overview:"Resumen del inventario",newProduct:"Registrar producto",
    totalProducts:"Productos registrados",units:"Unidades en stock",
    lowStock:"Stock bajo",recent:"Movimientos recientes",attention:"Necesitan atención",
    quick:"Acciones rápidas",addEntry:"Registrar entrada",addExit:"Registrar salida",
    search:"Buscar productos...",all:"Todos",lowOnly:"Stock bajo",
    noProducts:"No hay productos registrados.",name:"Nombre del producto",code:"Código",
    quantity:"Cantidad actual",minimum:"Stock mínimo",reorder:"Cantidad para reponer",
    supplier:"Proveedor",phone:"Teléfono del proveedor",location:"Ubicación",
    description:"Descripción",aliases:"Nombres alternativos",notesField:"Observaciones",
    photo:"Foto",camera:"Abrir cámara",takePhoto:"Tomar foto",choosePhoto:"Elegir foto",
    save:"Guardar",cancel:"Cancelar",edit:"Editar",details:"Detalles",delete:"Eliminar",
    stock:"Stock",status:"Estado",normal:"Normal",critical:"Bajo",date:"Fecha",
    type:"Tipo",entry:"Entrada",exit:"Salida",adjustment:"Ajuste",
    amount:"Cantidad movida",reason:"Motivo / observación",submit:"Registrar movimiento",
    history:"Historial",dailyNote:"Nota del día",
    notePlaceholder:"Ej.: salieron 2 cintas o llegaron 10 cajas.",
    analyze:"Analizar nota",plainNote:"Guardar como nota simple",
    confirmMovement:"Confirmar movimiento",detected:"Interpretación detectada",
    action:"Acción",apply:"Confirmar y actualizar stock",
    noMatch:"No pude identificar con seguridad el producto, la cantidad y la acción. Guarda una nota simple.",
    saved:"Guardado correctamente.",deleted:"Eliminado.",confirmDelete:"¿Eliminar este producto?",
    productSaved:"Producto guardado.",movementSaved:"Movimiento registrado.",noteSaved:"Nota guardada.",
    noAlerts:"No hay productos con stock bajo.",alertsText:"Productos que alcanzaron el mínimo configurado.",
    orderMore:"Reponer",messageSupplier:"Mensaje al proveedor",
    noPhone:"Añade el teléfono del proveedor para abrir WhatsApp.",
    noSuppliers:"No hay proveedores registrados.",productsCount:"Productos",
    inventory:"Inventario actual",exportCSV:"Exportar CSV",noMovements:"No hay movimientos.",
    totalValue:"Valor estimado",settings:"Configuración",refresh:"Actualizar datos",
    connected:"API conectada",disconnected:"API desconectada",
    localWarning:"Esta versión inicial usa almacenamiento temporal en el servidor. Los datos pueden perderse al reiniciar. Configura una base de datos antes de usar en producción.",
    serverError:"No se pudo comunicar con el servidor.",quantityError:"Introduce una cantidad válida.",
    insufficient:"La salida supera el stock disponible.",orderTitle:"Pedido de reposición",
    orderQty:"Cantidad a pedir",message:"Mensaje",copy:"Copiar mensaje",
    openWhatsApp:"Abrir WhatsApp",close:"Cerrar",company:"Empresa",
    companyPlaceholder:"Mi empresa",normalStock:"Stock normal",inbound:"Entrada",
    outbound:"Salida",product:"Producto",value:"Valor unitario (opcional)",
    supplierMsg:"¡Hola! Quisiera solicitar la reposición de este producto:",
    photoError:"No se pudo abrir la cámara. Elige una foto o usa HTTPS.",
    nameRequired:"Introduce el nombre del producto.",searchEmpty:"No se encontraron resultados.",
    notesHistory:"Notas guardadas",processed:"Movimiento confirmado",simpleNote:"Nota simple",
    restock:"Reponer",productForm:"Formulario de producto",stockInfo:"Información del producto",
    restore:"Importar copia",backup:"Exportar copia",backupError:"Archivo de copia no válido.",
    backupOk:"Copia importada.",noData:"No hay datos para mostrar.",deleteConfirm:"Eliminar",
    dashboardDesc:"Resumen de tu almacén",report:"Informe de inventario",
    entries:"Entradas",exits:"Salidas",phoneLabel:"Teléfono",saveNote:"Guardar nota",
    dateFrom:"Desde",dateTo:"Hasta",loginNeeded:"Configura la autenticación antes del uso real."
  }
};

let lang = localStorage.getItem("almox_lang") || "pt";
if (!words[lang]) lang = "pt";
const t = key => words[lang][key] || words.pt[key] || key;

let state = { products: [], movements: [], notes: [] };
let currentPage = "dashboard";
let cameraStream = null;
let photoData = "";
let pendingNote = null;
let loaded = false;

async function api(path, options = {}) {
  const response = await fetch("/api" + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || t("serverError"));
  return data;
}

async function loadState() {
  setStatus(false);
  try {
    state = await api("/state");
    state.products ||= [];
    state.movements ||= [];
    state.notes ||= [];
    loaded = true;
    setStatus(true);
    render();
  } catch (error) {
    loaded = false;
    $("#content").innerHTML = `<div class="card"><h2>${t("disconnected")}</h2><p>${esc(error.message)}</p><button class="primary" onclick="loadState()">${t("refresh")}</button></div>`;
    toast(t("serverError"));
  }
}

function setStatus(ok) {
  const el = $("#connectionStatus");
  if (!el) return;
  el.textContent = (ok ? "● " : "● ") + t(ok ? "connected" : "disconnected");
  el.style.color = ok ? "#15803d" : "#dc2626";
}

function toast(message) {
  $("#toastRoot").innerHTML = `<div class="toast">${esc(message)}</div>`;
  setTimeout(() => { $("#toastRoot").innerHTML = ""; }, 3200);
}

function normalize(text) {
  return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function lowProducts() {
  return state.products.filter(p => Number(p.qty) <= Number(p.min));
}

function productById(id) {
  return state.products.find(p => p.id === id);
}

function productName(id) {
  return productById(id)?.name || "—";
}

function pageName(page) {
  return t(page);
}

function render() {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  $("#language").value = lang;
  $$(".nav-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.page === currentPage);
  });
  $("#pageTitle").textContent = pageName(currentPage);
  if (!loaded) return;

  const pages = {
    dashboard: dashboardPage,
    products: productsPage,
    movements: movementsPage,
    notes: notesPage,
    alerts: alertsPage,
    suppliers: suppliersPage,
    reports: reportsPage
  };
  $("#content").innerHTML = (pages[currentPage] || dashboardPage)();
}

function pageHead(title, desc, button = "") {
  return `<div class="page-head"><div><h1>${esc(title)}</h1><p>${esc(desc || "")}</p></div>${button}</div>`;
}

function btn(text, onclick, cls = "secondary") {
  return `<button class="${cls}" onclick="${onclick}">${esc(text)}</button>`;
}

function empty(text) {
  return `<div class="empty">${esc(text)}</div>`;
}

function stat(label, value, icon) {
  return `<div class="card"><div class="stat-label">${icon || "📦"} ${esc(label)}</div><div class="stat-value">${esc(value)}</div></div>`;
}

function dashboardPage() {
  const low = lowProducts();
  const todayMoves = state.movements.filter(m => m.date === today());
  const units = state.products.reduce((sum, p) => sum + Number(p.qty || 0), 0);
  return pageHead(t("dashboard"), t("dashboardDesc"), btn("＋ " + t("newProduct"), "openProductForm()", "primary")) +
    `<div class="grid stats">
      ${stat(t("totalProducts"), state.products.length, "📦")}
      ${stat(t("units"), units, "▤")}
      ${stat(t("lowStock"), low.length, "⚠️")}
      ${stat(t("movements"), todayMoves.length, "↕")}
    </div>
    <div class="grid two-col">
      <div class="card"><h3>${t("attention")}</h3>
        ${low.length ? low.map(p => alertRow(p)).join("") : empty(t("noAlerts"))}
      </div>
      <div class="card"><h3>${t("quick")}</h3>
        <div class="actions">${btn("＋ " + t("newProduct"), "openProductForm()", "primary")}</div>
        <div class="actions">${btn("↓ " + t("addEntry"), "openMovementForm('in')")}</div>
        <div class="actions">${btn("↑ " + t("addExit"), "openMovementForm('out')")}</div>
        <div class="actions">${btn("📝 " + t("notes"), "navigate('notes')")}</div>
      </div>
      <div class="card"><h3>${t("recent")}</h3>${recentMovements(7)}</div>
    </div>`;
}

function alertRow(p) {
  return `<div class="item-row">
    <div style="flex:1"><div class="item-name">${esc(p.name)}</div>
    <div class="small-text muted">${t("stock")}: ${Number(p.qty)} · ${t("minimum")}: ${Number(p.min)}</div></div>
    ${btn(t("details"), `openProductDetail('${p.id}')`, "small")}
  </div>`;
}

function productsPage() {
  return pageHead(t("products"), t("overview"), btn("＋ " + t("newProduct"), "openProductForm()", "primary")) +
    `<div class="toolbar"><input id="productSearch" placeholder="${t("search")}" oninput="filterProducts()">
    <select id="productFilter" onchange="filterProducts()"><option value="all">${t("all")}</option><option value="low">${t("lowOnly")}</option></select></div>
    <div id="productList">${productCards(state.products)}</div>`;
}

function productCards(list) {
  if (!list.length) return empty(t("noProducts"));
  return `<div class="grid products-grid">${list.map(p => `
    <div class="card product-card">
      ${p.photo ? `<img class="product-photo" src="${p.photo}" alt="">` : `<div class="product-photo" style="display:grid;place-items:center;font-size:42px">📦</div>`}
      <div class="product-info"><h3>${esc(p.name)}</h3>
        <p>${t("code")}: ${esc(p.code || "—")}</p>
        <p>${t("stock")}: <b>${Number(p.qty)}</b></p>
        <p>${t("minimum")}: ${Number(p.min)}</p>
        <span class="badge ${Number(p.qty) <= Number(p.min) ? "low" : ""}">${Number(p.qty) <= Number(p.min) ? t("critical") : t("normal")}</span>
        <div class="actions">${btn(t("details"), `openProductDetail('${p.id}')`, "small")}${btn(t("edit"), `openProductForm('${p.id}')`, "small")}</div>
      </div>
    </div>`).join("")}</div>`;
}

function filterProducts() {
  const query = normalize($("#productSearch").value);
  const filter = $("#productFilter").value;
  const list = state.products.filter(p =>
    normalize([p.name, p.code, p.supplier, p.aliases, p.location].join(" ")).includes(query) &&
    (filter !== "low" || Number(p.qty) <= Number(p.min))
  );
  $("#productList").innerHTML = list.length ? productCards(list) : empty(t("searchEmpty"));
}

function movementsPage() {
  return pageHead(t("movements"), t("history"), btn("＋ " + t("submit"), "openMovementForm()", "primary")) +
    `<div class="card"><div class="toolbar">
      <select id="moveFilter" onchange="filterMovements()">
        <option value="all">${t("all")}</option><option value="in">${t("entry")}</option>
        <option value="out">${t("exit")}</option><option value="adjust">${t("adjustment")}</option>
      </select>
      <input id="moveDate" type="date" onchange="filterMovements()">
    </div><div id="moveTable">${movementTable(state.movements)}</div></div>`;
}

function movementTable(list) {
  if (!list.length) return empty(t("noMovements"));
  return `<div class="table-wrap"><table><thead><tr><th>${t("date")}</th><th>${t("product")}</th><th>${t("type")}</th><th>${t("amount")}</th><th>${t("reason")}</th></tr></thead><tbody>
    ${[...list].sort((a,b) => (b.created || "").localeCompare(a.created || "")).map(m => `
      <tr><td>${esc(m.date)}</td><td>${esc(productName(m