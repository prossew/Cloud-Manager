import { useEffect, useState } from "react";
import {
  useNodeStore,
  MOCK_NODES,
  NodeCard,
  type ServerNode,
} from "./entities/node";
import { NetworkGraph } from "./widgets/network-graph";
import { MetricsChart } from "./widgets/metrics-chart";
import { ManageNodeModal } from "./features/manage-node";
import { ThemeToggle } from "./features/theme-toggle";

export default function App() {
  const nodes = useNodeStore((state) => state.nodes);
  const setNodes = useNodeStore((state) => state.setNodes);

  const [managingNode, setManagingNode] = useState<ServerNode | null>(null);

  useEffect(() => {
    setNodes(MOCK_NODES);
  }, [setNodes]);

  const handlManage = (id: string) => {
    const node = nodes.find((n) => n.id === id) || null;
    setManagingNode(node);
  };

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <img
                src="/favicon.png"
                alt="Favicon"
                className="inline-block w-8 h-8 mr-1 "
              />
              Cloud Manager
            </h1>
            <p className="text-sm text-muted-foreground">
              Мониторинг и управление инфраструктурой
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Топология сети</h2>
          <NetworkGraph />
        </section>

        <section className="space-y-3">
          <MetricsChart />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Список серверов</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <NodeCard key={node.id} node={node} onManage={handlManage} />
            ))}
          </div>
        </section>

        <ManageNodeModal
          node={managingNode}
          isOpen={!!managingNode}
          onClose={() => setManagingNode(null)}
        />
      </div>
    </main>
  );
}
