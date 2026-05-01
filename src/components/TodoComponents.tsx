import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Card } from "./ui/card";

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
    <Card
      style={{
        padding: "12px 16px",
        backgroundColor: todo.done ? "var(--accent)" : "var(--card)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Checkbox
          checked={todo.done}
          onCheckedChange={() => onToggle(todo.id)}
        />
        <span
          style={{
            flex: 1,
            textDecoration: todo.done ? "line-through" : "none",
            // color: todo.done ? "#6b7280" : "#000",
          }}
        >
          {todo.text}
        </span>
        <Button variant="outline" size="sm" onClick={() => onRemove(todo.id)}>
          Remove
        </Button>
      </div>
    </Card>
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
