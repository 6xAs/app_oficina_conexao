import { useEffect, useState, type FormEvent } from "react";
import { Activity, ArrowRight, CheckCircle2, CircleHelp, Database, FlaskConical, Github, Home, LayoutDashboard, Menu, Plus, Settings, UserRound, Users, X } from "lucide-react";
import { supabase } from "./supabase";

type Page = "inicio" | "registros" | "sobre" | "configuracoes";
type Registro = { id: string; nome: string; created_at: string };
const items: {id: Page;label: string;icon: typeof Home}[] = [
  {id:"inicio",label:"Visão geral",icon:LayoutDashboard},
  {id:"registros",label:"Registros",icon:Users},
  {id:"sobre",label:"Sobre o teste",icon:CircleHelp},
  {id:"configuracoes",label:"Configurações",icon:Settings},
];
const titles: Record<Page,string> = {inicio:"Visão geral",registros:"Registros",sobre:"Sobre a oficina",configuracoes:"Configurações"};

export default function App() {
  const [page,setPage] = useState<Page>("inicio");
  const [menu,setMenu] = useState(false);
  const [nome,setNome] = useState("");
  const [registros,setRegistros] = useState<Registro[]>([]);
  const [saving,setSaving] = useState(false);
  const [message,setMessage] = useState("");
  const connected = Boolean(supabase);

  async function load() {
    if (!supabase) return;
    const {data,error} = await supabase.from("oficina_nomes").select("id,nome,created_at").order("created_at",{ascending:false}).limit(30);
    if(error) setMessage("Falha ao carregar registros: "+error.message);
    else setRegistros(data ?? []);
  }
  useEffect(()=>{void load();},[]);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = nome.trim();
    if (!value || value.length > 120) return;
    setSaving(true);setMessage("");
    if (!supabase) {
      setRegistros(r=>[{id:crypto.randomUUID(),nome:value,created_at:new Date().toISOString()},...r]);
      setMessage("Registro adicionado ao modo demonstração (não persistido).");
      setNome("");setSaving(false);return;
    }
    const {error} = await supabase.from("oficina_nomes").insert({nome:value});
    if(error) setMessage("Não foi possível salvar: "+error.message);
    else {setNome("");setMessage("Nome salvo no Supabase com sucesso.");await load();}
    setSaving(false);
  }
  function navigate(next:Page){setPage(next);setMenu(false);setMessage("");}
  return <div className="shell">
    <aside className={`sidebar ${menu?"open":""}`}>
      <div className="brand"><span className="brand-icon"><FlaskConical size={22}/></span><div><strong>Oficina<span>Conexão</span></strong><small>LABORATÓRIO DIGITAL</small></div><button className="close-menu icon-button" aria-label="Fechar menu" onClick={()=>setMenu(false)}><X size={20}/></button></div>
      <div className="side-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Menu principal">{items.map(item=><button key={item.id} className={page===item.id?"nav-active":""} onClick={()=>navigate(item.id)}><item.icon size={19}/><span>{item.label}</span>{page===item.id&&<span className="nav-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="lab-status"><span className="live-dot"/><div><strong>Ambiente de teste</strong><small>Interface em desenvolvimento</small></div></div><div className="side-version">OFICINA CONEXÃO <span>v0.1.0</span></div></div>
    </aside>
    {menu&&<button className="backdrop" aria-label="Fechar navegação" onClick={()=>setMenu(false)}/>}
    <div className="workspace">
      <header className="topbar"><div className="top-left"><button className="menu-trigger icon-button" aria-label="Abrir menu" onClick={()=>setMenu(true)}><Menu size={22}/></button><span className="breadcrumb">Workspace</span><span className="slash">/</span><strong>{titles[page]}</strong></div><div className="top-right"><span className="test-pill"><span className="live-dot"/> Modo teste</span><div className="avatar" title="Oficina Conexão"><UserRound size={19}/></div></div></header>
      <main className="main">
        <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> AMBIENTE DE APRENDIZAGEM</div><h1>{page==="inicio"?"Experimente.":titles[page]} <span>{page==="inicio"?"Construa.":""}</span></h1><p>{page==="inicio"?"Um espaço simples para explorar React, interfaces e integração com dados.":page==="registros"?"Visualize os nomes cadastrados no experimento.":page==="sobre"?"Tecnologias, conceitos e objetivos desta oficina.":"Estado atual das integrações deste projeto."}</p></div><div className="heading-mark"><Activity size={23}/></div></div>
        {page==="inicio"&&<><div className="stats"><div className="stat-card"><div className="stat-icon mint"><Users size={20}/></div><div><small>NOMES REGISTRADOS</small><strong>{registros.length.toString().padStart(2,"0")}</strong></div></div><div className="stat-card"><div className="stat-icon violet"><Database size={20}/></div><div><small>BANCO DE DADOS</small><strong className="stat-value">{connected?"Conectado":"Modo demo"}</strong></div></div><div className="stat-card"><div className="stat-icon blue"><CheckCircle2 size={20}/></div><div><small>STATUS DO PROJETO</small><strong className="stat-value">Operacional</strong></div></div></div>
          <section className="primary-card"><div className="section-head"><div className="section-icon"><Plus size={22}/></div><div><span className="overline">EXPERIMENTO 01</span><h2>Cadastro de nomes</h2><p>Nosso primeiro contato com um formulário React.</p></div></div><form onSubmit={save}><label htmlFor="nome">Nome completo</label><div className="input-row"><input id="nome" value={nome} maxLength={120} autoComplete="name" onChange={e=>setNome(e.target.value)} placeholder="Digite um nome para começar..." required/><button type="submit" disabled={saving||!nome.trim()}><Plus size={18}/>{saving?"Salvando...":"Adicionar nome"}</button></div>{message&&<p role="status" className="feedback">{message}</p>}<p className="helper">Este é o único campo do experimento. Simples assim.</p></form></section>
          <section className="recent"><div className="recent-head"><div><h2>Últimos registros</h2><p>Acompanhe os nomes adicionados</p></div><button onClick={()=>navigate("registros")}>Ver todos <ArrowRight size={16}/></button></div>{registros.length?<div className="name-list">{registros.slice(0,4).map(r=><div className="name-item" key={r.id}><span className="person-icon"><UserRound size={17}/></span><strong>{r.nome}</strong><span className="name-date">{new Date(r.created_at).toLocaleDateString("pt-BR")}</span></div>)}</div>:<div className="empty"><Users size={25}/><strong>Nenhum nome registrado ainda</strong><span>Adicione o primeiro nome acima para começar.</span></div>}</section>
        </>}
        {page==="registros"&&<section className="primary-card"><div className="section-head"><div className="section-icon"><Users size={22}/></div><div><span className="overline">DADOS</span><h2>Nomes cadastrados</h2><p>{registros.length} registros visíveis nesta sessão</p></div></div>{registros.length?<div className="name-list">{registros.map(r=><div className="name-item" key={r.id}><span className="person-icon"><UserRound size={17}/></span><strong>{r.nome}</strong><span className="name-date">{new Date(r.created_at).toLocaleDateString("pt-BR")}</span></div>)}</div>:<div className="empty">Nenhum registro ainda. Volte à visão geral para cadastrar.</div>}<button className="secondary-action" onClick={()=>navigate("inicio")}>Voltar ao cadastro <ArrowRight size={16}/></button></section>}
        {page==="sobre"&&<section className="primary-card"><div className="section-head"><div className="section-icon"><FlaskConical size={22}/></div><div><span className="overline">SOBRE</span><h2>Pequeno projeto. Grandes conexões.</h2><p>React + Vite + TypeScript + Supabase + Vercel. Navegação mockada, cadastro funcional em modo demo ou persistente com banco configurado.</p></div></div><div className="feature-note">O objetivo é aprender como interface, versionamento, banco de dados e publicação se conectam.</div></section>}
        {page==="configuracoes"&&<section className="primary-card"><div className="section-head"><div className="section-icon"><Settings size={22}/></div><div><span className="overline">INTEGRAÇÕES</span><h2>Estado do ambiente</h2><p>As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY ativam o banco de dados.</p></div></div><div className="config-line"><Database size={20}/><strong>Supabase</strong><span className="connection-tag">{connected?"Configurado":"Aguardando configuração"}</span></div><div className="config-line"><Github size={20}/><strong>GitHub</strong><span className="connection-tag">Código versionado</span></div></section>}
      </main>
      <footer className="footer"><span>© 2026 Oficina Conexão <span className="footer-sep">•</span> Feito para aprender construindo.</span><div><button onClick={()=>navigate("sobre")}>Sobre</button><button onClick={()=>navigate("configuracoes")}>Configurações</button><span>v0.1.0</span></div></footer>
      <nav className="mobile-bottom" aria-label="Navegação inferior">{items.slice(0,3).map(item=><button key={item.id} onClick={()=>navigate(item.id)} className={page===item.id?"selected":""}><item.icon size={20}/><span>{item.label}</span></button>)}</nav>
    </div>
  </div>;
}
