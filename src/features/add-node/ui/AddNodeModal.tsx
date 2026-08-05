import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNodeStore, type ServerNode } from "@/entities/node";

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddNodeModal = ({ isOpen, onClose }: AddNodeModalProps) => {
  const addNode = useNodeStore((state) => state.addNode);

  const [name, setName] = useState("");
  const [ip, setIp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !ip.trim()) return;

    const newNode: ServerNode = {
      id: `vps-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      ip: ip.trim(),
      status: "online",
      provider: "Custom",
      location: "Local",
      lastSeen: "Только что",
      metrics: {
        cpuUsage: Math.floor(Math.random() * 20) + 5,
        ramUsage: Math.floor(Math.random() * 30) + 20,
        networkSpeed: Math.floor(Math.random() * 100) + 30,
        diskUsage: Math.floor(Math.random() * 40) + 20,
        uptime: "0d 0h 1m",
        ping: Math.floor(Math.random() * 30) + 15,
        bandWithUp: Math.floor(Math.random() * 50) + 10,
        bandWithDown: Math.floor(Math.random() * 100) + 50,
      },
    };
    addNode(newNode);
    setName("");
    setIp("");
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-500" />
            <span>Добавить новый сервер</span>
          </DialogTitle>
          <DialogDescription>
            <span>
              Введите параметры сервера для подключение к мониторингу.
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Название Сервера
            </label>
            <input
              type="text"
              required
              placeholder="например, Warsaw-Edge-01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border rounded-lg focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              IP-адрес сервера
            </label>
            <input
              type="text"
              required
              placeholder="например, 194.87.12.50"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">Добавить сервер</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
