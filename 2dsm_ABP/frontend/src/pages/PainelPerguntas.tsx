import { useState, useEffect, useCallback } from 'react';
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
  // ordena por display_order em cada nível
  const sort = (arr: TreeNode[]) => {
    arr.sort((a, b) => a.display_order - b.display_order);
    arr.forEach(n => sort(n.children));
  };
  sort(roots);
  return roots;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TreeItem({
  node,
  depth,
  selectedId,
  onSelect,
  expandedIds,
  onToggle,
}: {
  node: TreeNode;
  depth: number;
  selectedId: number | null;
  onSelect: (n: TreeNode) => void;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isLeaf = !hasChildren; // nó folha = item selecionável com respostas

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: `${depth * 20 + 8}px`,
          paddingRight: '8px',
          paddingTop: '5px',
          paddingBottom: '5px',
          cursor: 'pointer',
          borderRadius: '4px',
          backgroundColor: isSelected ? '#fce8e8' : 'transparent',
          border: isSelected ? '1px solid #C0392B' : '1px solid transparent',
          marginBottom: '2px',
        }}
        onClick={() => {
          if (hasChildren) onToggle(node.id);
          onSelect(node);
        }}
      >
        {/* expand arrow ou spacer */}
        {hasChildren ? (
          <span
            style={{
              fontSize: '10px',
              color: '#666',
              marginRight: '4px',
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s',
              display: 'inline-block',
              width: '12px',
            }}
          >
            ▶
          </span>
        ) : (
          <span style={{ width: '16px', display: 'inline-block' }} />
        )}

        {/* ícone */}
        {isLeaf ? (
          <span style={{ marginRight: '6px', fontSize: '14px', color: isSelected ? '#C0392B' : '#888' }}>
            {isSelected ? '⦿' : '○'}
          </span>
        ) : (
          <span style={{ marginRight: '6px', fontSize: '13px' }}>📁</span>
        )}

        <span
          style={{
            fontSize: '13px',
            color: isSelected ? '#8B0000' : '#333',
            fontWeight: isSelected ? 600 : 400,
            userSelect: 'none',
          }}
        >
          {node.title}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map(child => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
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
  onDeactivate,
}: {
  modal: ModalState;
  allNodes: Node[];
  onClose: () => void;
  onSave: (data: Partial<Node> & { id?: number }) => Promise<void>;
  onDeactivate: (id: number) => Promise<void>;
}) {
  const editing = modal.mode === 'edit' && modal.node;

  const [title, setTitle] = useState(editing ? modal.node!.title : '');
  const [tipo, setTipo] = useState<'menu' | 'resposta'>(
    editing && modal.node!.content ? 'resposta' : 'menu'
  );
  const [parentId, setParentId] = useState<number | null>(
    editing ? modal.node!.parent_id : null
  );
  const [content, setContent] = useState(editing ? modal.node!.content ?? '' : '');
  const [link, setLink] = useState(editing ? modal.node!.link ?? '' : '');
  const [chunkPath, setChunkPath] = useState(editing ? modal.node!.chunk_path ?? '' : '');
  const [order, setOrder] = useState(editing ? modal.node!.display_order : 0);
  const [isActive, setIsActive] = useState(editing ? modal.node!.is_active : true);
  const [saving, setSaving] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

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
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    if (!editing) return;
    if (!confirmDeactivate) {
      setConfirmDeactivate(true);
      return;
    }
    setSaving(true);
    try {
      await onDeactivate(modal.node!.id);
    } finally {
      setSaving(false);
    }
  }

  // filtra nós que podem ser pai (exclui o próprio nó e seus descendentes)
  const parentOptions = allNodes.filter(n => n.id !== modal.node?.id);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        backgroundColor: '#fff', borderRadius: '8px', padding: '28px 24px',
        width: '500px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '17px', fontWeight: 700, color: '#222' }}>
          {modal.mode === 'create' ? 'Criar novo item' : 'Editar item selecionado'}
        </h2>

        {/* Título */}
        <label style={labelStyle}>Titulo</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value.slice(0, 100))}
          placeholder="Digite aqui o titulo"
          style={inputStyle}
          maxLength={100}
        />
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#999', marginBottom: '16px' }}>
          {title.length}/100
        </div>

        {/* Tipo do item */}
        <label style={labelStyle}>Tipo do item</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          {(['menu', 'resposta'] as const).map(t => (
            <label
              key={t}
              style={{
                flex: 1, border: `2px solid ${tipo === t ? '#C0392B' : '#ddd'}`,
                borderRadius: '6px', padding: '10px 12px', cursor: 'pointer',
                backgroundColor: tipo === t ? '#fdf0f0' : '#fafafa',
                display: 'flex', alignItems: 'flex-start', gap: '8px',
              }}
            >
              <input
                type="radio"
                checked={tipo === t}
                onChange={() => setTipo(t)}
                style={{ marginTop: '2px', accentColor: '#C0392B' }}
              />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                  {t === 'menu' ? 'Opção de menu' : 'Resposta final'}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  {t === 'menu' ? '(Possuí mais respostas)' : '(O item chegou a última solução)'}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Pertence a */}
        <label style={labelStyle}>O arquivo pertence há:</label>
        <select
          value={parentId ?? ''}
          onChange={e => setParentId(e.target.value === '' ? null : Number(e.target.value))}
          style={{ ...inputStyle, marginBottom: '16px' }}
        >
          <option value="">
            {modal.mode === 'create' ? 'Defina o local do item' : 'Nenhum (raiz)'}
          </option>
          {parentOptions.map(n => (
            <option key={n.id} value={n.id}>{n.title}</option>
          ))}
        </select>

        {/* Resposta final — só aparece quando tipo = resposta */}
        {tipo === 'resposta' && (
          <>
            <label style={labelStyle}>Resposta final</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value.slice(0, 800))}
              placeholder="Digite aqui a resposta"
              style={{ ...inputStyle, height: '110px', resize: 'vertical', marginBottom: '4px' }}
              maxLength={800}
            />
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#999', marginBottom: '16px' }}>
              {content.length}/800
            </div>

            <label style={labelStyle}>
              Link de evidência{' '}
              <span style={{ color: '#999', fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://... ou /assets/arquivo.pdf"
              style={{ ...inputStyle, marginBottom: '16px' }}
            />

            <label style={labelStyle}>
              Caminho do documento{' '}
              <span style={{ color: '#999', fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              value={chunkPath}
              onChange={e => setChunkPath(e.target.value)}
              placeholder="Ex: /assets/knowledge-base/pdf/arquivo.pdf"
              style={{ ...inputStyle, marginBottom: '16px' }}
            />
          </>
        )}

        {/* Ordem + Status */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Ordem</label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
              style={inputStyle}
              min={0}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Status</label>
            <select
              value={isActive ? 'true' : 'false'}
              onChange={e => setIsActive(e.target.value === 'true')}
              style={inputStyle}
            >
              {modal.mode === 'create' && <option value="">Defina um status</option>}
              <option value="true">Ativo</option>
              <option value="false">Desativado</option>
            </select>
          </div>
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={btnGray} disabled={saving}>Cancelar</button>
          {modal.mode === 'edit' && (
            <button
              onClick={handleDeactivate}
              style={btnRed}
              disabled={saving}
            >
              {confirmDeactivate ? 'Tem certeza? Confirmar ⊘' : 'Desativar item ⊘'}
            </button>
          )}
          <button onClick={handleSave} style={btnBlue} disabled={saving || !title.trim()}>
            {modal.mode === 'create' ? 'Criar item' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation Modal ───────────────────────────────────────────────────────

function ConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [choice, setChoice] = useState<'sim' | 'nao'>('nao');

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '8px', padding: '24px 28px',
        width: '260px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: '15px', textAlign: 'center' }}>
          Você tem certeza ?
        </p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '20px' }}>
          {(['sim', 'nao'] as const).map(v => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="radio"
                checked={choice === v}
                onChange={() => setChoice(v)}
                style={{ accentColor: '#C0392B' }}
              />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onCancel} style={{ ...btnGray, flex: 1 }}>Voltar</button>
          <button
            onClick={() => choice === 'sim' && onConfirm()}
            style={{ ...btnRed, flex: 1, opacity: choice === 'nao' ? 0.5 : 1 }}
            disabled={choice === 'nao'}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: '#333', marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1px solid #ccc', borderRadius: '4px',
  padding: '8px 10px', fontSize: '13px', color: '#333',
  outline: 'none', backgroundColor: '#fff',
};

const btnGray: React.CSSProperties = {
  backgroundColor: '#666', color: '#fff', border: 'none',
  borderRadius: '4px', padding: '9px 16px', fontSize: '13px',
  fontWeight: 600, cursor: 'pointer',
};

const btnRed: React.CSSProperties = {
  backgroundColor: '#C0392B', color: '#fff', border: 'none',
  borderRadius: '4px', padding: '9px 16px', fontSize: '13px',
  fontWeight: 600, cursor: 'pointer',
};

const btnBlue: React.CSSProperties = {
  backgroundColor: '#1a56bb', color: '#fff', border: 'none',
  borderRadius: '4px', padding: '9px 16px', fontSize: '13px',
  fontWeight: 600, cursor: 'pointer',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PainelPerguntas() {
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [modal, setModal] = useState<ModalState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Node | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  // cursos raiz para o select de filtro
  const cursos = allNodes.filter(n => n.parent_id === null);
  const [cursoFiltro, setCursoFiltro] = useState<number | null>(null);

  // filhos diretos do nó selecionado
  const filhosDoSelecionado = selectedNode
    ? allNodes.filter(n => n.parent_id === selectedNode.id)
      .sort((a, b) => a.display_order - b.display_order)
    : [];

  // ── fetch ──────────────────────────────────────────────────────────────────

  const fetchNodes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Node[]>('/admin/nodes/all');
      setAllNodes(data);
      setTree(buildTree(data));
    } catch {
      showToast('Erro ao carregar dados.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNodes(); }, [fetchNodes]);

  // ── helpers ────────────────────────────────────────────────────────────────

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

  function expandAll() {
    setExpandedIds(new Set(allNodes.map(n => n.id)));
  }

  // filtra árvore por curso selecionado
  const visibleTree = cursoFiltro
    ? tree.filter(n => n.id === cursoFiltro)
    : tree;

  // ── CRUD ───────────────────────────────────────────────────────────────────

  async function handleSave(data: Partial<Node> & { id?: number }) {
    try {
      if (data.id) {
        // UPDATE — usa multipart por causa do multer no backend
        const form = new FormData();
        form.append('title', data.title ?? '');
        form.append('content', data.content ?? '');
        form.append('display_order', String(data.display_order ?? 0));
        form.append('is_active', String(data.is_active ?? true));
        form.append('parent_id', data.parent_id !== null && data.parent_id !== undefined ? String(data.parent_id) : 'null');
        form.append('link', data.link ?? '');
        form.append('chunk_path', data.chunk_path ?? '');
        await api.put(`/admin/nodes/${data.id}`, form);
        showToast('Alterações salvas com sucesso!', 'success');
      } else {
        // CREATE
        const form = new FormData();
        form.append('title', data.title ?? '');
        if (data.content) form.append('content', data.content);
        form.append('display_order', String(data.display_order ?? 0));
        form.append('is_active', String(data.is_active ?? true));
        if (data.parent_id !== null && data.parent_id !== undefined)
          form.append('parent_id', String(data.parent_id));
        if (data.link) form.append('link', data.link);
        if (data.chunk_path) form.append('chunk_path', data.chunk_path);
        await api.post('/admin/nodes/create', form);
        showToast('Item criado com sucesso!', 'success');
      }
      setModal(null);
      await fetchNodes();
    } catch {
      showToast('Erro ao salvar item.', 'error');
    }
  }

  async function handleDeactivate(id: number) {
    try {
      const form = new FormData();
      form.append('is_active', 'false');
      // precisamos manter o título atual
      const node = allNodes.find(n => n.id === id);
      if (node) form.append('title', node.title);
      await api.put(`/admin/nodes/${id}`, form);
      showToast('Item desativado', 'error');
      setModal(null);
      await fetchNodes();
    } catch {
      showToast('Erro ao desativar item.', 'error');
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/admin/nodes/${id}`);
      showToast('Item removido', 'error');
      setDeleteTarget(null);
      if (selectedNode?.id === id) setSelectedNode(null);
      await fetchNodes();
    } catch {
      showToast('Erro ao remover item.', 'error');
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ── Barra de ações ── */}
      <div style={{
        backgroundColor: '#8B0000', borderRadius: '6px',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '20px', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Curso</label>
          <select
            value={cursoFiltro ?? ''}
            onChange={e => setCursoFiltro(e.target.value === '' ? null : Number(e.target.value))}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: 'none',
              fontSize: '13px',
              backgroundColor: '#fff',
              color: '#333',
              cursor: 'pointer',
              minWidth: '200px',
            }}
          >
            <option value="">Selecione o curso</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div style={{ flex: 1 }} />

        <button
          style={{
            backgroundColor: "transparent",
            border: "2px solid #fff",
            color: "#fff", // Cor padrão das letras (branco)
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "background-color 0.2s, color 0.2s", // Transição suave para fundo e cor
          }}
          onMouseOver={(e) => {
            // Aplica o hover branco no fundo que você já fez
            e.currentTarget.style.backgroundColor = "#fff";
            // Aplica o hover #333333 nas letras (Texto e Ícone)
            e.currentTarget.style.color = "#333333";
          }}
          onMouseOut={(e) => {
            // Volta o fundo para transparente
            e.currentTarget.style.backgroundColor = "transparent";
            // Volta as letras para branco
            e.currentTarget.style.color = "#fff";
          }}
        >
          <span style={{ fontSize: "16px" }}>+</span> Criar novo item
        </button>

        <button
          style={{
            backgroundColor: "transparent",
            border: "2px solid #fff",
            color: "#fff", // Cor padrão das letras (branco)
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "background-color 0.2s, color 0.2s", // Transição suave para fundo e cor
          }}
          onMouseOver={(e) => {
            // Aplica o hover branco no fundo que você já fez
            e.currentTarget.style.backgroundColor = "#fff";
            // Aplica o hover #333333 nas letras (Texto e Ícone)
            e.currentTarget.style.color = "#333333";
          }}
          onMouseOut={(e) => {
            // Volta o fundo para transparente
            e.currentTarget.style.backgroundColor = "transparent";
            // Volta as letras para branco
            e.currentTarget.style.color = "#fff";
          }}
        >
          Importar/exportar
        </button>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          backgroundColor: toast.type === 'success' ? '#4CAF50' : '#8B0000',
          color: '#fff', borderRadius: '6px', padding: '12px 20px',
          textAlign: 'center', fontWeight: 600, fontSize: '14px',
          marginBottom: '16px', transition: 'opacity 0.3s',
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Painel duplo ── */}
      <div style={{ display: 'flex', gap: '16px', minHeight: '520px' }}>

        {/* ── Árvore ── */}
        <div style={{
          width: '340px', flexShrink: 0, backgroundColor: '#fff',
          borderRadius: '6px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* header da árvore */}
          <div style={{
            padding: '10px 14px', borderBottom: '1px solid #eee',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#333', flex: 1 }}>
              Fluxo de perguntas
            </span>
            <button
              title="Atualizar"
              onClick={fetchNodes}
              style={{ background: 'none', border: '1px solid #ddd', borderRadius: '4px', padding: '4px 7px', cursor: 'pointer', fontSize: '13px' }}
            >
              ↺
            </button>
            <button
              title="Expandir tudo"
              onClick={expandAll}
              style={{ background: 'none', border: '1px solid #ddd', borderRadius: '4px', padding: '4px 7px', cursor: 'pointer', fontSize: '13px' }}
            >
              ⤢
            </button>
          </div>

          {/* árvore scrollável */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginTop: '40px' }}>
                Carregando...
              </p>
            ) : visibleTree.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginTop: '40px' }}>
                Nenhum item encontrado.
              </p>
            ) : (
              visibleTree.map(node => (
                <TreeItem
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedId={selectedNode?.id ?? null}
                  onSelect={n => setSelectedNode(n)}
                  expandedIds={expandedIds}
                  onToggle={toggleExpand}
                />
              ))
            )}
          </div>

          {/* legenda */}
          <div style={{
            padding: '8px 14px', borderTop: '1px solid #eee',
            fontSize: '11px', color: '#888', display: 'flex', gap: '16px',
          }}>
            <span>📁 Pasta de dúvidas</span>
            <span>⦿ Item selecionado</span>
          </div>
        </div>

        {/* ── Painel direito ── */}
        <div style={{
          flex: 1, backgroundColor: '#fff', borderRadius: '6px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex',
          flexDirection: 'column', overflow: 'hidden',
        }}>
          {!selectedNode ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#bbb', fontSize: '14px' }}>
                Selecione um item na árvore para ver suas respostas.
              </p>
            </div>
          ) : (
            <>
              {/* header direito */}
              <div style={{
                padding: '10px 16px', borderBottom: '1px solid #eee',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span style={{ fontSize: '13px', color: '#555' }}>
                  Respostas para:{' '}
                  <strong style={{ color: '#222' }}>{selectedNode.title}</strong>
                </span>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => setModal({ mode: 'create' })}
                  style={{
                    backgroundColor: '#8B0000', color: '#fff', border: 'none',
                    borderRadius: '4px', padding: '7px 14px', fontSize: '13px',
                    fontWeight: 600, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', gap: '5px',
                  }}
                >
                  + Adicionar item
                </button>
              </div>

              {/* aviso de reordenação */}
              {filhosDoSelecionado.length > 1 && (
                <div style={{
                  margin: '12px 16px 0', padding: '7px 12px', backgroundColor: '#fff3cd',
                  border: '1px solid #ffc107', borderRadius: '4px', fontSize: '12px', color: '#856404',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  ℹ️ Arraste os itens para reordenar ou use as setas para organizar.
                </div>
              )}

              {/* tabela */}
              {filhosDoSelecionado.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: '#bbb', fontSize: '13px' }}>
                    Nenhuma resposta cadastrada para este item.
                  </p>
                </div>
              ) : (
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
                  {/* cabeçalho da tabela */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 140px 110px 120px',
                    gap: '0', borderBottom: '2px solid #eee',
                    paddingBottom: '6px', marginBottom: '4px',
                  }}>
                    {['Ordem', 'Nome do item', 'Tipo', 'Status', 'Ações'].map(h => (
                      <span key={h} style={{ fontSize: '12px', fontWeight: 700, color: '#555', padding: '0 8px' }}>
                        {h}
                      </span>
                    ))}
                  </div>

                  {filhosDoSelecionado.map((node, idx) => (
                    <div
                      key={node.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 1fr 140px 110px 120px',
                        alignItems: 'center',
                        borderBottom: '1px solid #f0f0f0',
                        padding: '8px 0',
                      }}
                    >
                      {/* ordem */}
                      <span style={{ fontSize: '13px', color: '#555', paddingLeft: '8px' }}>
                        {node.display_order}
                      </span>

                      {/* título */}
                      <span style={{ fontSize: '13px', color: '#333', padding: '0 8px' }}>
                        {node.title}
                      </span>

                      {/* tipo */}
                      <div style={{ padding: '0 8px' }}>
                        <span style={{
                          backgroundColor: '#1a56bb', color: '#fff',
                          borderRadius: '3px', padding: '2px 8px', fontSize: '11px', fontWeight: 600,
                        }}>
                          {node.content ? 'Resposta final' : 'Resposta'}
                        </span>
                      </div>

                      {/* status */}
                      <div style={{ padding: '0 8px' }}>
                        <span style={{
                          backgroundColor: node.is_active ? '#2e7d32' : '#8B0000',
                          color: '#fff', borderRadius: '3px',
                          padding: '2px 8px', fontSize: '11px', fontWeight: 600,
                        }}>
                          {node.is_active ? 'Ativo' : 'Desativado'}
                        </span>
                      </div>

                      {/* ações */}
                      <div style={{ display: 'flex', gap: '4px', padding: '0 8px', alignItems: 'center' }}>
                        {/* editar */}
                        <button
                          title="Editar"
                          onClick={() => setModal({ mode: 'edit', node })}
                          style={actionBtn}
                        >
                          ✏️
                        </button>
                        {/* mover para cima */}
                        <button
                          title="Mover para cima"
                          onClick={async () => {
                            if (idx === 0) return;
                            const prev = filhosDoSelecionado[idx - 1];
                            const form1 = new FormData();
                            form1.append('title', node.title);
                            form1.append('display_order', String(prev.display_order));
                            const form2 = new FormData();
                            form2.append('title', prev.title);
                            form2.append('display_order', String(node.display_order));
                            await Promise.all([
                              api.put(`/admin/nodes/${node.id}`, form1),
                              api.put(`/admin/nodes/${prev.id}`, form2),
                            ]);
                            await fetchNodes();
                          }}
                          style={{ ...actionBtn, opacity: idx === 0 ? 0.3 : 1 }}
                          disabled={idx === 0}
                        >
                          ↑
                        </button>
                        {/* mover para baixo */}
                        <button
                          title="Mover para baixo"
                          onClick={async () => {
                            if (idx === filhosDoSelecionado.length - 1) return;
                            const next = filhosDoSelecionado[idx + 1];
                            const form1 = new FormData();
                            form1.append('title', node.title);
                            form1.append('display_order', String(next.display_order));
                            const form2 = new FormData();
                            form2.append('title', next.title);
                            form2.append('display_order', String(node.display_order));
                            await Promise.all([
                              api.put(`/admin/nodes/${node.id}`, form1),
                              api.put(`/admin/nodes/${next.id}`, form2),
                            ]);
                            await fetchNodes();
                          }}
                          style={{ ...actionBtn, opacity: idx === filhosDoSelecionado.length - 1 ? 0.3 : 1 }}
                          disabled={idx === filhosDoSelecionado.length - 1}
                        >
                          ↕
                        </button>
                        {/* deletar */}
                        <button
                          title="Remover"
                          onClick={() => setDeleteTarget(node)}
                          style={{ ...actionBtn, color: '#C0392B' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Modais ── */}
      {modal && (
        <ItemModal
          modal={modal}
          allNodes={allNodes}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDeactivate={handleDeactivate}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  background: 'none', border: '1px solid #ddd', borderRadius: '4px',
  padding: '3px 6px', cursor: 'pointer', fontSize: '13px', color: '#555',
};