import { useEffect } from "react";
import { useNodeStore, MOCK_NODES, NodeCard } from "./entities/node";

export default function App() {
  const nodes = useNodeStore((state) => state.nodes);
  const setNodes = useNodeStore((state) => state.setNodes);

  useEffect(() => {
    setNodes(MOCK_NODES);
  }, [setNodes]);

  const handlManage = (id: string) => {
    console.log("Кликнул на управление сервером", id);
  };

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cloud Manager</h1>
            <p className="text-sm text-muted-foreground">
              Мониторинг и управление инфраструктурой
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node) => (
            <NodeCard key={node.id} node={node} onManage={handlManage} />
          ))}
        </section>
      </div>
    </main>
  );
}
