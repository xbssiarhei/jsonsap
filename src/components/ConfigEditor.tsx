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
import type { AppConfig } from "../lib/types";
import { Editor } from "./Editor";

interface ConfigEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: AppConfig<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfigChange: (config: AppConfig<any>) => void;
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
      <DialogContent className="max-w-4/5 max-h-[90vh] sm:max-w-4/5">
        <DialogHeader>
          <DialogTitle>Edit UI Configuration</DialogTitle>
          <DialogDescription>
            Modify the JSON configuration for the UI. Changes will be applied
            immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[90vh] overflow-y-auto px-4">
          <div className="flex flex-col gap-4">
            <Editor value={jsonText} onChange={(value) => setJsonText(value)} />
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
