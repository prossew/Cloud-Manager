import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { ServerNode } from "@/entities/node";

import { RefreshCw, Power, Copy, Check } from "lucide-react";

import { Terminal } from "./Terminal";

interface ManageNodeModalProps {
  node: ServerNode | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ManageNodeModal = ({
  node,
  isOpen,
  onClose,
}: ManageNodeModalProps) => {
  const [copied, setCopied] = useState(false);
  if (!node) return null;
  const sshCommand = `ssh root@${node.ip}`;

  const handleCopySsh = () => {
    navigator.clipboard.writeText(sshCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Управление {node.name}</span>
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            IP: {node.ip} | ID: {node.id}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="actions" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="actions">Быстрые действия</TabsTrigger>
            <TabsTrigger value="logs">SSH Терминал</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Подключение по SSH
              </label>
              <div className="flex items-center gap-2 bg-muted p-2 rounded-lg font-mono text-xs">
                <span className="flex-1 truncate">{sshCommand}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleCopySsh}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 justify-start"
                onClick={() => alert(`Перезагрузка сервера ${node.name}...`)}
              >
                <RefreshCw className="w-4 h-4 text-emerald-500" /> Перезагрузить
              </Button>

              <Button
                variant="destructive"
                className="flex items-center gap-2 justify-start"
                onClick={() => alert(`Остановка ноды ${node.name}...`)}
              >
                <Power className="w-4 h-4 text-red-500" /> Остановить
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="pt-4">
            <Terminal node={node} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
