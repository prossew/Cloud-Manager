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
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: "init-1",
      type: "info",
      text: `Connecting to ${node.name} (${node.ip}) via SSH port 22...`,
    },
    {
      id: "init-2",
      type: "info",
      text: `Connected. Welcome to ${node.provider} Linux OS (x86_64).`,
    },
    {
      id: "init-3",
      type: "info",
      text: 'Type "help" to view available Cloud Manager commands.',
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const userLog: CommandLog = {
      id: Date.now().toString(),
      type: "input",
      text: cmd,
    };

    const newLogs = [...logs, userLog];
    const cleanCmd = cmd.toLowerCase();

    if (cleanCmd === "clear") {
      setLogs([]);
      setInput("");
      return;
    }

    let responseLog: CommandLog;

    switch (cleanCmd) {
      case "help":
        responseLog = {
          id: (Date.now() + 1).toString(),
          type: "output",
          text: `Available commands:
  help      - Show this help message
  status    - Display current node system status
  top       - Show real-time CPU & RAM usage
  ping      - Ping server IP (${node.ip})
  clear     - Clear terminal screen
  restart   - Trigger soft reboot simulation`,
        };
        break;

      case "status":
        responseLog = {
          id: (Date.now() + 1).toString(),
          type: "output",
          text: `[SYSTEM STATUS]
  Node Name:  ${node.name}
  IP Address: ${node.ip}
  Provider:   ${node.provider}
  Location:   ${node.location}
  State:      ${node.status.toUpperCase()}`,
        };
        break;

      case "top":
        responseLog = {
          id: (Date.now() + 1).toString(),
          type: "output",
          text: `[TOP PROCESSES]
  CPU Load:  ${node.metrics?.cpuUsage ?? 0}%
  RAM Usage: ${node.metrics?.ramUsage ?? 0}%
  Disk:      ${node.metrics?.diskUsage ?? 0}%
  Network:   ${node.metrics?.networkSpeed ?? 0} MB/s`,
        };
        break;

      case "ping":
        responseLog = {
          id: (Date.now() + 1).toString(),
          type: "output",
          text: `PING ${node.ip} 56(84) bytes of data.
64 bytes from ${node.ip}: icmp_seq=1 ttl=54 time=14.2 ms
64 bytes from ${node.ip}: icmp_seq=2 ttl=54 time=13.8 ms
--- ${node.ip} ping statistics ---
2 packets transmitted, 2 received, 0% packet loss`,
        };
        break;

      case "restart":
        responseLog = {
          id: (Date.now() + 1).toString(),
          type: "info",
          text: `Initiating system reboot on ${node.name}... OK. Services restarted.`,
        };
        break;

      default:
        responseLog = {
          id: (Date.now() + 1).toString(),
          type: "error",
          text: `zsh: command not found: ${cmd}. Type "help" for a list of commands.`,
        };
    }

    setLogs([...newLogs, responseLog]);
    setInput("");
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
