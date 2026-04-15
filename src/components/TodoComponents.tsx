import { Button } from "../components/ui/button";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px",
        backgroundColor: todo.done ? "#f0fdf4" : "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
      }}
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        style={{ cursor: "pointer" }}
      />
      <span
        style={{
          flex: 1,
          textDecoration: todo.done ? "line-through" : "none",
          color: todo.done ? "#6b7280" : "#000",
        }}
      >
        {todo.text}
      </span>
      <Button variant="outline" size="sm" onClick={() => onRemove(todo.id)}>
        Remove
      </Button>
    </div>
  );
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

export function TodoList({ todos, onToggle, onRemove }: TodoListProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {todos && todos.length > 0 ? (
        todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onRemove={onRemove}
          />
        ))
      ) : (
        <p style={{ color: "#6b7280", fontStyle: "italic" }}>
          No todos yet. Add one!
        </p>
      )}
    </div>
  );
}
