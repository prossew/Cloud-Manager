import { useEffect, useState, useMemo } from "react"; // 👈 Добавлен useMemo
import {
  useNodeStore,
  MOCK_NODES,
  NodeCard,
  type ServerNode,
} from "./entities/node";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NetworkGraph } from "./widgets/network-graph";
import { MetricsChart } from "./widgets/metrics-chart";
import { ManageNodeModal } from "./features/manage-node";
import { ThemeToggle } from "./features/theme-toggle";
import { AddNodeModal } from "./features/add-node";
import { NodeFilter, type StatusFilter } from "./features/node-filter";

export default function App() {
  const nodes = useNodeStore((state) => state.nodes);
  const setNodes = useNodeStore((state) => state.setNodes);

  const [managingNode, setManagingNode] = useState<ServerNode | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    setNodes(MOCK_NODES);
  }, [setNodes]);

  const handlManage = (id: string) => {
    const node = nodes.find((n) => n.id === id) || null;
    setManagingNode(node);
  };

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch =
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.ip.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || node.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [nodes, searchQuery, statusFilter]);

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <img src="/favicon.png" alt="Favicon" className="w-8 h-8" />
              Cloud Manager
            </h1>
            <p className="text-sm text-muted-foreground">
              Мониторинг и управление инфраструктурой
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Добавить сервер
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Топология сети</h2>
          <NetworkGraph />
        </section>

        <section className="space-y-3">
          <MetricsChart />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Список серверов</h2>
            <span className="text-xs text-muted-foreground font-mono">
              Показано: {filteredNodes.length} из {nodes.length}
            </span>
          </div>

          <NodeFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {filteredNodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNodes.map((node) => (
                <NodeCard key={node.id} node={node} onManage={handlManage} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-xl bg-card text-muted-foreground">
              Серверы не найдены
            </div>
          )}
        </section>

        <ManageNodeModal
          node={managingNode}
          isOpen={!!managingNode}
          onClose={() => setManagingNode(null)}
        />
        <AddNodeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </main>
  );
}
