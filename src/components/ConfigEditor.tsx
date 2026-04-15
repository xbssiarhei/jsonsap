import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import type { AppConfig } from "../lib/types";

interface ConfigEditorProps {
  config: AppConfig;
  onConfigChange: (config: AppConfig) => void;
}

export function ConfigEditor({ config, onConfigChange }: ConfigEditorProps) {
  const [open, setOpen] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    // Extract only UI config for editing
    setJsonText(JSON.stringify(config.ui, null, 2));
    setError(null);
    setOpen(true);
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);

      // Validate that it's a valid component config
      if (!parsed.type) {
        setError("Invalid config: missing 'type' field");
        return;
      }

      // Update config with new UI, keep existing store
      onConfigChange({
        ...config,
        ui: parsed,
      });

      setError(null);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpen}>
          Edit Config
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit UI Configuration</DialogTitle>
          <DialogDescription>
            Modify the JSON configuration for the UI. Changes will be applied
            immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <div className="flex flex-col gap-4">
            <Textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="font-mono text-xs min-h-[400px]"
              placeholder="Enter JSON configuration..."
            />
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
