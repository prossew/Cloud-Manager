import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, CornerDownLeft } from "lucide-react";
import type { ServerNode } from "@/entities/node";

interface CommandLog {
  id: string;
  type: "input" | "output" | "error" | "info";
  text: string;
}

interface TerminalProps {
  node: ServerNode;
}

export const Terminal = ({ node }: TerminalProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([
    {
      id: "init-1",
      type: "info",
      text: `Connected to ${node.name} ${node.ip} as root.`,
    },
    {
      id: "init-2",
      type: "info",
      text: "Type any Linux command (e.g. 'uptime', 'uname -a', 'free -h', 'docker ps').",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || isLoading) return;

    if (cmd.toLowerCase() === "clear") {
      setLogs([]);
      setInput("");
      return;
    }

    const userLog: CommandLog = {
      id: Date.now().toString(),
      type: "input",
      text: cmd,
    };

    setLogs((prev) => [...prev, userLog]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/nodes/${node.id}/exec`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: cmd }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute command");
      }

      setLogs((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "output",
          text: data.output || "(no output)",
        },
      ]);
    } catch (err) {
      setLogs((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "error",
          text: (err as Error).message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[350px] bg-zinc-950 text-zinc-100 font-mono text-xs rounded-xl border border-zinc-800 overflow-hidden shadow-inner">
      <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>root@{node.id}: ~</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2 selection:bg-emerald-500/30">
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed">
            {log.type === "input" && (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span>root@{node.id}:~$</span>
                <span className="text-zinc-100">{log.text}</span>
              </div>
            )}
            {log.type === "output" && (
              <pre className="text-zinc-300 whitespace-pre-wrap pl-4 border-l-2 border-emerald-500/30 my-1">
                {log.text}
              </pre>
            )}
            {log.type === "info" && (
              <div className="text-zinc-400 italic"># {log.text}</div>
            )}
            {log.type === "error" && (
              <div className="text-rose-400 pl-4">{log.text}</div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleCommand}
        className="p-2 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center gap-2"
      >
        <span className="text-emerald-400 pl-2 font-bold">$&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type 'help'..."
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-600 font-mono text-xs"
          autoFocus
        />
        <button
          type="submit"
          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
