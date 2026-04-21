import { type AppConfig, type StoreConfig } from "../../lib";

// Kanban task type
type Task = {
  id: number;
  title: string;
  description: string;
  status: "todo" | "progress" | "done";
};

// Kanban state
type KanbanState = {
  tasks: Task[];
  newTaskTitle: string;
  newTaskDescription: string;
};

const store: StoreConfig<KanbanState> = {
  state: {
    tasks: [
      {
        id: 1,
        title: "Design landing page",
        description: "Create mockups for the new landing page",
        status: "todo",
      },
      {
        id: 2,
        title: "Implement authentication",
        description: "Add login and signup functionality",
        status: "progress",
      },
      {
        id: 3,
        title: "Write documentation",
        description: "Document API endpoints",
        status: "done",
      },
      {
        id: 4,
        title: "Setup CI/CD",
        description: "Configure GitHub Actions",
        status: "todo",
      },
      {
        id: 5,
        title: "Code review",
        description: "Review pull requests",
        status: "progress",
      },
    ],
    newTaskTitle: "",
    newTaskDescription: "",
  },
  actions: {
    moveTask: (state, _e: unknown, taskId: number, newStatus: string) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = (newStatus || "todo") as "todo" | "progress" | "done";
      }
    },
    addTask: (state) => {
      if (!state.newTaskTitle.trim()) return;

      const newTask: Task = {
        id: Date.now(),
        title: state.newTaskTitle,
        description: state.newTaskDescription,
        status: "todo",
      };

      state.tasks.push(newTask);
      state.newTaskTitle = "";
      state.newTaskDescription = "";
    },
    deleteTask: (state, _e: unknown, taskId: number) => {
      state.tasks = state.tasks.filter((t) => t.id !== taskId);
    },
  },
  computed: {
    todoTasks: (state) => state.tasks.filter((t) => t.status === "todo"),
    progressTasks: (state) =>
      state.tasks.filter((t) => t.status === "progress"),
    doneTasks: (state) => state.tasks.filter((t) => t.status === "done"),
  },
};

// Kanban column configuration
const createColumn = (
  title: string,
  status: string,
  tasksPath: string,
  bgColor: string,
) => ({
  type: "div",
  props: {
    className:
      "flex flex-col gap-4 p-3 md:p-4 rounded-lg min-h-[400px] md:min-h-[500px]",
    style: {
      backgroundColor: bgColor,
      flex: 1,
    },
  },
  children: [
    // Column header
    {
      type: "div",
      props: {
        className: "flex items-center justify-between mb-3 md:mb-4",
      },
      children: [
        {
          type: "h3",
          props: {
            className: "text-base md:text-lg font-semibold",
          },
          children: title,
        },
        {
          type: "span",
          props: {
            className:
              "bg-white px-2 py-1 rounded-full text-xs md:text-sm font-medium text-gray-700",
          },
          children: ` @store.computed.${tasksPath}.length`,
        },
      ],
    },
    // Tasks list
    {
      type: "Repeater",
      props: {
        items: `@store.computed.${tasksPath}`,
        template: {
          type: "Card",
          props: {
            className: "bg-white hover:shadow-md transition-shadow cursor-move",
          },
          children: [
            {
              type: "CardHeader",
              props: {
                className: "pb-2 md:pb-3",
              },
              children: [
                {
                  type: "CardTitle",
                  props: {
                    className: "text-sm md:text-base",
                  },
                  children: "@item.title",
                },
              ],
            },
            {
              type: "CardContent",
              props: {
                className: "space-y-2 md:space-y-3",
              },
              children: [
                {
                  type: "p",
                  props: {
                    className: "text-xs md:text-sm text-gray-600",
                  },
                  children: "@item.description",
                },
                // Action buttons
                {
                  type: "div",
                  props: {
                    className: "flex flex-wrap gap-1 md:gap-2 pt-2",
                  },
                  children: [
                    // Move to Todo button
                    status !== "todo"
                      ? {
                          type: "Button",
                          props: {
                            variant: "outline",
                            size: "sm",
                            onClick: {
                              $action: "call",
                              name: "moveTask",
                              args: ["@item.id", "todo"],
                            },
                            className: "text-xs",
                          },
                          children: "← Todo",
                        }
                      : null,
                    // Move to Progress button
                    status !== "progress"
                      ? {
                          type: "Button",
                          props: {
                            variant: "outline",
                            size: "sm",
                            onClick: {
                              $action: "call",
                              name: "moveTask",
                              args: ["@item.id", "progress"],
                            },
                            className: "text-xs",
                          },
                          children: "⟳ Progress",
                        }
                      : null,
                    // Move to Done button
                    status !== "done"
                      ? {
                          type: "Button",
                          props: {
                            variant: "outline",
                            size: "sm",
                            onClick: {
                              $action: "call",
                              name: "moveTask",
                              args: ["@item.id", "done"],
                            },
                            className: "text-xs",
                          },
                          children: "✓ Done",
                        }
                      : null,
                    // Delete button
                    {
                      type: "Button",
                      props: {
                        variant: "destructive",
                        size: "sm",
                        onClick: {
                          $action: "call",
                          name: "deleteTask",
                          args: ["@item.id"],
                        },
                        className: "text-xs",
                      },
                      children: "Delete",
                    },
                  ].filter(Boolean),
                },
              ],
            },
          ],
        },
      },
    },
  ],
});

export const kanbanPageConfig: AppConfig<KanbanState> = {
  store,
  ui: {
    type: "PageRoot",
    props: {
      className: "p-4 md:p-10",
    },
    children: [
      // Page header
      {
        type: "div",
        props: {
          className: "mb-6 md:mb-8",
        },
        children: [
          {
            type: "h1",
            props: {
              className: "text-3xl md:text-4xl font-bold mb-2",
            },
            children: "Kanban Board",
          },
          {
            type: "p",
            props: {
              className: "text-gray-600 text-sm md:text-base",
            },
            children: "Manage your tasks with drag-and-drop columns",
          },
        ],
      },

      // Add new task form
      {
        type: "Card",
        props: {
          className: "mb-4 md:mb-6",
        },
        children: [
          {
            type: "CardHeader",
            children: [
              {
                type: "CardTitle",
                props: {
                  className: "text-lg md:text-xl",
                },
                children: "Add New Task",
              },
            ],
          },
          {
            type: "CardContent",
            children: [
              {
                type: "div",
                props: {
                  className: "flex flex-col md:flex-row gap-3 md:gap-4",
                },
                children: [
                  {
                    type: "ControlledInput",
                    props: {
                      placeholder: "Task title",
                      value: "@store.state.newTaskTitle",
                      onChange: {
                        $action: "set",
                        path: "newTaskTitle",
                      },
                      className: "flex-1",
                    },
                  },
                  {
                    type: "ControlledInput",
                    props: {
                      placeholder: "Task description",
                      value: "@store.state.newTaskDescription",
                      onChange: {
                        $action: "set",
                        path: "newTaskDescription",
                      },
                      className: "flex-1",
                    },
                  },
                  {
                    type: "Button",
                    props: {
                      onClick: "@store.actions.addTask",
                      className: "w-full md:w-auto",
                    },
                    children: "Add Task",
                  },
                ],
              },
            ],
          },
        ],
      },

      // Kanban columns
      {
        type: "div",
        props: {
          className: "flex flex-col lg:flex-row gap-6",
        },
        children: [
          createColumn("To Do", "todo", "todoTasks", "#f3f4f6"),
          createColumn("In Progress", "progress", "progressTasks", "#fef3c7"),
          createColumn("Done", "done", "doneTasks", "#d1fae5"),
        ],
      },
    ],
  },
};
