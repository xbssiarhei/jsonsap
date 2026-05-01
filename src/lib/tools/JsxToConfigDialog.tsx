import { useState, useCallback } from "react";
import { transform } from "sucrase";
import { jsxConfig, Fragment } from "./jsxConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";

const DEFAULT_INPUT = `<Panel
  slots={{
    header: <h1 className="text-xl font-bold">Title</h1>,
    footer: <Button>Save</Button>,
  }}
>
  <div className="p-4">Body content</div>
</Panel>`;

function transformJsx(input: string): unknown {
  const { code } = transform(input.trim(), {
    transforms: ["jsx"],
    jsxPragma: "jsxConfig",
    jsxFragmentPragma: "Fragment",
    production: true, // removes __self / __source debug props
  });

  // sucrase may prepend helper declarations on the same line as the expression
  // strip all leading `const/var/let x = ...;` regardless of newlines
  const expr = code
    .trim()
    .replace(/^(?:(?:const|var|let)\s+\w+\s*=[^;]*;\s*)+/, "")
    .replace(/;\s*$/, "")
    .trim();

  // builds a proxy that accumulates dotted names: Item.Item → "Item.Item"
  function makeRef(name: string): object {
    return new Proxy(
      {},
      {
        get(_, prop) {
          if (
            prop === Symbol.toPrimitive ||
            prop === "toString" ||
            prop === "valueOf"
          )
            return () => name;
          if (typeof prop === "string") return makeRef(`${name}.${prop}`);
        },
      },
    );
  }

  // unknown component names (e.g. Panel, Item.Item) resolve to their string name
  const scope = new Proxy({ jsxConfig, Fragment } as Record<string, unknown>, {
    has: (_, prop) => typeof prop === "string",
    get: (target, prop) => {
      if (typeof prop !== "string") return undefined;
      return prop in target ? target[prop] : makeRef(prop);
    },
  });

  // eslint-disable-next-line no-new-func
  const fn = new Function("__scope", `with(__scope) { return (${expr}); }`);
  return fn(scope);
}

export function JsxToConfigDialog() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = useCallback(() => {
    try {
      const result = transformJsx(input);
      setOutput(JSON.stringify(result, null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }, [input]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          JSX → Config
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[80vh] sm:max-w-[80%] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>JSX to Config</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 flex-1 min-h-0">
          <div className="flex flex-col flex-1 gap-2 min-h-0">
            <span className="text-sm text-muted-foreground">JSX</span>
            <div className="flex-1 border rounded-md overflow-hidden">
              <Editor
                language="javascript"
                value={input}
                onChange={(v) => setInput(v ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-2 min-h-0">
            <span className="text-sm text-muted-foreground">
              ComponentConfig JSON
            </span>
            <div className="flex-1 border rounded-md overflow-hidden">
              <Editor
                language="json"
                value={error ? `// Error:\n// ${error}` : output}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleConvert} className="self-end">
          Convert
        </Button>
      </DialogContent>
    </Dialog>
  );
}
