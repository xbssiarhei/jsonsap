// import { type FC, useRef, useState, useEffect } from "react";
// import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// import styles from "./Editor.module.css";
import MonacoEditor, { type EditorProps } from "@monaco-editor/react";

// export const Editor2: FC = () => {
//   const [editor, setEditor] =
//     useState<monaco.editor.IStandaloneCodeEditor | null>(null);
//   const monacoEl = useRef(null);

//   useEffect(() => {
//     if (monacoEl) {
//       setEditor((editor) => {
//         if (editor) return editor;

//         return monaco.editor.create(monacoEl.current!, {
//           value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
//             "\n",
//           ),
//           language: "typescript",
//         });
//       });
//     }

//     return () => editor?.dispose();
//   }, [monacoEl.current]);

//   return <div className={styles.Editor} ref={monacoEl}></div>;
// };

// interface EditorProps extends MonacoEditor {
//   test: string;
// }

export const Editor = (props: EditorProps) => {
  return <MonacoEditor height="400px" language="json" {...props} />;
};
