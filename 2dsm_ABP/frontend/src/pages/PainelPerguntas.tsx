import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Node {
  id: number;
  parent_id: number | null;
  title: string;
  content: string | null;
  display_order: number;
  chunk_path: string | null;
  link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TreeNode extends Node {
  children: TreeNode[];
}

type NodeStatus = 'healthy' | 'incomplete';

type Toast = { msg: string; type: 'success' | 'error' } | null;

interface ModalState {
  mode: 'create' | 'edit';
  node?: Node;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildTree(nodes: Node[]): TreeNode[] {
  const map = new Map<number, TreeNode>();
  nodes.forEach(n => map.set(n.id, { ...n, children: [] }));
  const roots: TreeNode[] = [];
  nodes.forEach(n => {
    if (n.parent_id === null) {
      roots.push(map.get(n.id)!);
    } else {
      map.get(n.parent_id)?.children.push(map.get(n.id)!);
    }
  });
  const sort = (arr: TreeNode[]) => {
    arr.sort((a, b) => a.display_order - b.display_order);
    arr.forEach(n => sort(n.children));
  };
  sort(roots);
  return roots;
}

function getBreadcrumbs(nodeId: number | null, allNodes: Node[]): Node[] {
  if (!nodeId) return [];
  const path: Node[] = [];
  let current = allNodes.find(n => n.id === nodeId);
  while (current) {
    path.unshift(current);
    const parentId = current.parent_id;
    current = parentId ? allNodes.find(n => n.id === parentId) : undefined;
  }
  return path;
}

function getNodeStatus(node: Node, allNodes: Node[]): NodeStatus {
  const children = allNodes.filter(n => n.parent_id === node.id);
  const hasChildren = children.length > 0;
  const hasContent = !!(node.content?.trim() || node.link?.trim() || node.chunk_path?.trim());
  return (hasChildren || hasContent) ? 'healthy' : 'incomplete';
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

function TreeItem({
  node,
  depth,
  selectedId,
  onSelect,
  expandedIds,
  onToggle,
  allNodes,
}: {
  node: TreeNode;
  depth: number;
  selectedId: number | null;
  onSelect: (n: TreeNode) => void;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  allNodes: Node[];
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const status = getNodeStatus(node, allNodes);

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-colors ${
          isSelected 
          ? "bg-[#8B0000] text-white font-bold" 
          : "hover:bg-gray-100 text-gray-700"
        }`}
        style={{ marginLeft: `${depth * 12}px` }}
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) onToggle(node.id);
          onSelect(node);
        }}
      >
        <div className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""} ${!hasChildren ? "opacity-0" : ""}`}>
          <ChevronRight />
        </div>
        <div className={isSelected ? "text-white" : "text-gray-400"}>
          {hasChildren ? <FolderIcon /> : <FileIcon />}
        </div>
        <span className="text-sm truncate flex-1">{node.title}</span>
        {status === 'incomplete' && <span className="text-orange-500 font-black text-xs" title="Incompleto">!</span>}
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-0.5 ml-3 border-l border-gray-200 pl-1">
          {node.children.map(child => (
            <TreeItem key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} expandedIds={expandedIds} onToggle={onToggle} allNodes={allNodes} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ItemModal({
  modal,
  allNodes,
  onClose,
  onSave,
  breadcrumbs,
}: {
  modal: ModalState;
  allNodes: Node[];
  onClose: () => void;
  onSave: (data: Partial<Node> & { id?: number }) => Promise<void>;
  breadcrumbs: Node[];
}) {
  const editing = modal.mode === 'edit' && modal.node;
  const [title, setTitle] = useState(editing ? modal.node!.title : '');
  const [tipo, setTipo] = useState<'menu' | 'resposta'>(editing && modal.node!.content ? 'resposta' : 'menu');
  const [parentId, setParentId] = useState<number | null>(editing ? modal.node!.parent_id : (modal.node?.parent_id ?? null));
  const [content, setContent] = useState(editing ? modal.node!.content ?? '' : '');
  const [link, setLink] = useState(editing ? modal.node!.link ?? '' : '');
  const [chunkPath, setChunkPath] = useState(editing ? modal.node!.chunk_path ?? '' : '');
  const [order, setOrder] = useState(editing ? modal.node!.display_order : 0);
  const [isActive, setIsActive] = useState(editing ? modal.node!.is_active : true);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        id: editing ? modal.node!.id : undefined,
        title: title.trim(),
        content: tipo === 'resposta' ? content : null,
        link: tipo === 'resposta' && link.trim() ? link.trim() : null,
        chunk_path: tipo === 'resposta' && chunkPath.trim() ? chunkPath.trim() : null,
        parent_id: parentId,
        display_order: order,
        is_active: isActive,
      });
    } finally { setSaving(false); }
  }

  const parentOptions = allNodes.filter(n => n.id !== modal.node?.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-lg w-full max-w-xl shadow-xl flex flex-col overflow-hidden border border-gray-300">
        <div className="bg-[#8B0000] p-4 flex items-center justify-between text-white">
           <h2 className="font-bold">{editing ? 'Editar Registro' : 'Novo Registro'}</h2>
           <button onClick={onClose} className="opacity-70 hover:opacity-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
           </button>
        </div>
        
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase flex gap-1 items-center">
           <span>Caminho:</span>
           {breadcrumbs.length === 0 ? 'Raiz' : breadcrumbs.map((b, i) => <span key={b.id}>{b.title} {i < breadcrumbs.length - 1 && '/'}</span>)}
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Título:</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8B0000]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Pasta Pai:</label>
              <select value={parentId ?? ''} onChange={e => setParentId(e.target.value === '' ? null : Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-2 text-sm outline-none">
                <option value="">Raiz</option>
                {parentOptions.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Ordem:</label>
              <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" min={0} />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tipo === 'menu'} onChange={() => setTipo('menu')} name="tipo" />
                <span className="text-sm font-bold text-gray-700">Pasta / Menu</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={tipo === 'resposta'} onChange={() => setTipo('resposta')} name="tipo" />
                <span className="text-sm font-bold text-gray-700">Resposta Final</span>
             </label>
          </div>

          {tipo === 'resposta' && (
            <div className="space-y-4 pt-2 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Texto da Resposta:</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#8B0000] h-32" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Link:</label>
                  <input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">PDF:</label>
                  <input value={chunkPath} onChange={e => setChunkPath(e.target.value)} placeholder="/assets/..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status:</label>
            <select value={isActive ? 'true' : 'false'} onChange={e => setIsActive(e.target.value === 'true')} className={`w-full border rounded px-3 py-2 text-sm font-bold outline-none ${isActive ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              <option value="true">Ativo</option>
              <option value="false">Desativado</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="bg-white border border-gray-300 text-gray-600 px-6 py-2 rounded text-sm font-bold hover:bg-gray-50" disabled={saving}>Cancelar</button>
          <button onClick={handleSave} className="bg-[#2E7D32] text-white px-8 py-2 rounded text-sm font-bold hover:bg-green-800 disabled:opacity-50" disabled={saving || !title.trim()}>Gravar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PainelPerguntas({ isAdmin = true }: { isAdmin?: boolean }) {
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Node | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [cursoFiltro, setCursoFiltro] = useState<number | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<'todos' | 'incompletos'>('todos');

  const cursos = allNodes.filter(n => n.parent_id === null);

  const fetchNodes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Node[]>('/admin/nodes/all');
      setAllNodes(data);
      setTree(buildTree(data));
    } catch { showToast('Erro ao carregar dados.', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNodes(); }, [fetchNodes]);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function toggleExpand(id: number) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const visibleTree = useMemo(() => {
    let result = cursoFiltro ? tree.filter(n => n.id === cursoFiltro) : tree;
    if (statusFiltro === 'incompletos') {
      const filterAudit = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.reduce((acc: TreeNode[], node) => {
          const status = getNodeStatus(node, allNodes);
          const filteredChildren = filterAudit(node.children);
          if (status === 'incomplete' || filteredChildren.length > 0) acc.push({ ...node, children: filteredChildren });
          return acc;
        }, []);
      };
      result = filterAudit(result);
    }
    return result;
  }, [tree, cursoFiltro, statusFiltro, allNodes]);

  const filhosDoSelecionado = selectedNode
    ? allNodes.filter(n => n.parent_id === selectedNode.id).sort((a, b) => a.display_order - b.display_order)
    : [];

  const breadcrumbs = useMemo(() => getBreadcrumbs(selectedNode?.id ?? null, allNodes), [selectedNode, allNodes]);

  async function handleSave(data: Partial<Node> & { id?: number }) {
    try {
      const form = new FormData();
      form.append('title', data.title ?? '');
      form.append('content', data.content ?? '');
      form.append('display_order', String(data.display_order ?? 0));
      form.append('is_active', String(data.is_active ?? true));
      form.append('parent_id', data.parent_id !== null && data.parent_id !== undefined ? String(data.parent_id) : 'null');
      form.append('link', data.link ?? '');
      form.append('chunk_path', data.chunk_path ?? '');
      if (data.id) await api.put(`/admin/nodes/${data.id}`, form);
      else await api.post('/admin/nodes/create', form);
      showToast('Salvo com sucesso!', 'success');
      setModal(null);
      await fetchNodes();
    } catch { showToast('Erro ao salvar.', 'error'); }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/admin/nodes/${id}`);
      showToast('Excluído', 'success');
      setDeleteTarget(null);
      if (selectedNode?.id === id) setSelectedNode(null);
      await fetchNodes();
    } catch { showToast('Erro ao remover.', 'error'); }
  }

  return (
    <div className="flex flex-col space-y-6">
      
      {/* HEADER DE AÇÕES - PADRONIZADO */}
      <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm flex flex-wrap items-center gap-4">
        {!isAdmin && (
          <div className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-blue-700 text-[10px] font-black uppercase">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Modo Somente Leitura
          </div>
        )}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Filtrar:</label>
          <select value={cursoFiltro ?? ''} onChange={e => { setCursoFiltro(e.target.value === '' ? null : Number(e.target.value)); setSelectedNode(null); }} className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#8B0000]">
            <option value="">Todos os Cursos</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          <label className="text-xs font-bold text-gray-500 uppercase">Auditoria:</label>
          <button onClick={() => setStatusFiltro(statusFiltro === 'todos' ? 'incompletos' : 'todos')} className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${statusFiltro === 'incompletos' ? "bg-orange-500 text-white border-orange-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>
            {statusFiltro === 'incompletos' ? 'Exibindo Problemas' : 'Ver Fluxos Incompletos'}
          </button>
        </div>
        <div className="flex-1" />
        {isAdmin && (
          <button onClick={() => setModal({ mode: 'create', node: { parent_id: selectedNode?.id ?? null } as any })} className="bg-[#8B0000] text-white px-5 py-2 rounded text-xs font-bold hover:bg-red-900 transition-colors">
            + Novo Item {selectedNode ? `em ${selectedNode.title}` : 'na Raiz'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ÁRVORE (Mais estreita) */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-300 flex flex-col overflow-hidden sticky top-6 max-h-[calc(100vh-120px)]">
          <div className="bg-[#F9F9F9] p-3 border-b border-gray-300 font-bold text-gray-700 text-sm flex justify-between items-center shrink-0">
            <span>Estrutura</span>
            <button onClick={fetchNodes} className="text-gray-400 hover:text-[#8B0000] transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {loading ? <div className="py-10 text-center text-gray-400 italic text-xs">Carregando...</div> : (
              <div className="space-y-1">
                {visibleTree.map(node => <TreeItem key={node.id} node={node} depth={0} selectedId={selectedNode?.id ?? null} onSelect={n => setSelectedNode(n)} expandedIds={expandedIds} onToggle={toggleExpand} allNodes={allNodes} />)}
              </div>
            )}
          </div>
        </div>

        {/* DETALHES (Mais larga) */}
        <div className="lg:col-span-9 bg-white rounded-lg shadow-sm border border-gray-300 flex flex-col overflow-hidden min-h-[500px]">
          {!selectedNode ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 p-8">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
               <p className="text-sm font-medium">Selecione um nó na árvore lateral para visualizar ou editar seu conteúdo.</p>
            </div>
          ) : (
            <>
              {/* STATUS BANNER */}
              {getNodeStatus(selectedNode, allNodes) === 'incomplete' && (
                <div className="bg-orange-50 border-b border-orange-200 px-6 py-3 flex items-center gap-3 text-orange-800 text-xs font-bold">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-200 text-orange-700">!</span>
                  <span>Este fluxo está incompleto. Ele precisa de uma Resposta, um Link ou um PDF configurado para aparecer no Chat.</span>
                </div>
              )}
              
              {/* HEADER E BREADCRUMB CLICÁVEL */}
              <div className="bg-white px-6 py-5 border-b border-gray-200 flex flex-col gap-4">
                 <div className="flex flex-wrap items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <button onClick={() => setSelectedNode(null)} className="hover:text-[#8B0000] transition-colors">Início</button>
                    {breadcrumbs.map((b, i) => (
                       <div key={b.id} className="flex items-center gap-2">
                          <span>›</span>
                          <button 
                            onClick={() => setSelectedNode(b as TreeNode)} 
                            className={`transition-colors ${i === breadcrumbs.length - 1 ? "text-[#8B0000]" : "hover:text-[#8B0000]"}`}
                          >
                             {b.title}
                          </button>
                       </div>
                    ))}
                 </div>
                 
                 <div className="flex justify-between items-start gap-4">
                    <h2 className="font-black text-gray-800 text-2xl leading-none">{selectedNode.title}</h2>
                    {isAdmin && (
                      <div className="flex gap-2 shrink-0">
                         <button onClick={() => setModal({ mode: 'edit', node: selectedNode })} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Editar
                         </button>
                         <button onClick={() => setDeleteTarget(selectedNode)} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-xs font-bold hover:bg-red-50 transition-colors shadow-sm flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            Excluir
                         </button>
                      </div>
                    )}
                 </div>
              </div>
              
              {/* CONTEÚDO PRINCIPAL (HERO CARD) */}
              <div className="p-6 bg-gray-50 border-b border-gray-200 flex-1">
                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="bg-gray-800 text-white px-5 py-3 flex items-center gap-3">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                       <span className="text-xs font-bold uppercase tracking-widest">Conteúdo da Resposta</span>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col gap-6">
                       <div>
                          <p className={`text-base leading-relaxed whitespace-pre-wrap ${!selectedNode.content ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                             {selectedNode.content || "Nenhum texto principal configurado para este nó."}
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-100">
                          <div className="flex flex-col gap-1 p-3 bg-blue-50 rounded-lg border border-blue-100">
                             <span className="text-[10px] font-black text-blue-800 uppercase flex items-center gap-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                Link Externo Anexado
                             </span>
                             <span className={`text-xs truncate ${selectedNode.link ? 'text-blue-600 font-medium' : 'text-blue-300 italic'}`}>
                                {selectedNode.link || "Nenhum link"}
                             </span>
                          </div>
                          
                          <div className="flex flex-col gap-1 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                             <span className="text-[10px] font-black text-emerald-800 uppercase flex items-center gap-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                PDF Anexado
                             </span>
                             <span className={`text-xs truncate ${selectedNode.chunk_path ? 'text-emerald-600 font-medium' : 'text-emerald-300 italic'}`}>
                                {selectedNode.chunk_path ? selectedNode.chunk_path.split('/').pop() : "Nenhum documento"}
                             </span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* LISTA DE FILHOS */}
              <div className="p-6 bg-white min-h-[250px]">
                 <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">Sub-itens de Navegação</h4>
                 </div>
                 
                 {filhosDoSelecionado.length === 0 ? (
                   <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <div className="text-sm">
                         <span className="font-bold block">Resposta Final.</span>
                         <span>Este item não possui sub-opções. O usuário encerrará a navegação ou fará uma avaliação após ler este conteúdo.</span>
                      </div>
                   </div>
                 ) : (
                   <div className="border border-gray-200 rounded-lg overflow-hidden">
                     <table className="w-full border-collapse bg-white">
                        <thead>
                          <tr className="text-left text-[10px] font-black text-gray-400 uppercase bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-4 w-16 text-center">Ordem</th>
                            <th className="py-3 px-4">Título do Botão (Chip)</th>
                            <th className="py-3 px-4 w-32 text-center">Saúde</th>
                            {isAdmin && <th className="py-3 px-4 w-24 text-right">Ação</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {filhosDoSelecionado.map((node) => {
                            const isHealthy = getNodeStatus(node, allNodes) === 'healthy';
                            return (
                            <tr key={node.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 text-center text-gray-400 font-bold text-xs">{node.display_order}</td>
                              <td className="py-3 px-4 font-bold text-gray-700 text-sm">
                                 <button onClick={() => setSelectedNode(node as TreeNode)} className="hover:text-[#8B0000] hover:underline text-left">
                                    {node.title}
                                 </button>
                              </td>
                              <td className="py-3 px-4 text-center">
                                 {isHealthy 
                                    ? <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded text-[9px] font-black uppercase">OK</span> 
                                    : <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 border border-orange-200 rounded text-[9px] font-black uppercase">Atenção</span>}
                              </td>
                              {isAdmin && (
                                <td className="py-3 px-4 text-right">
                                   <button onClick={() => setModal({ mode: 'edit', node })} className="text-[#8B0000] font-bold text-xs uppercase hover:underline">Editar</button>
                                </td>
                              )}
                            </tr>
                            )
                          })}
                        </tbody>
                     </table>
                   </div>
                 )}
              </div>
            </>
          )}
        </div>
      </div>

      {modal && <ItemModal modal={modal} allNodes={allNodes} onClose={() => setModal(null)} onSave={handleSave} breadcrumbs={getBreadcrumbs(modal.node?.parent_id ?? null, allNodes)} />}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] p-4 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl border border-gray-300 text-center">
            <h3 className="font-bold text-gray-800 mb-2">Confirmar Exclusão?</h3>
            <p className="text-gray-500 text-xs mb-6">Esta ação removerá o item "{deleteTarget.title}" permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-bold text-sm">Voltar</button>
              <button onClick={() => handleDelete(deleteTarget.id)} className="flex-1 bg-[#8B0000] text-white py-2 rounded font-bold text-sm">Excluir</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className={`fixed bottom-6 right-6 px-6 py-3 rounded text-white font-bold shadow-xl animate-fadeIn ${toast.type === 'success' ? 'bg-[#2E7D32]' : 'bg-[#8B0000]'}`}>{toast.msg}</div>}
    </div>
  );
}