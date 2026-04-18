export default {
  byLastUpdate: (path: string) => ({
    conditions: [
      {
        store: {
          // store: `@store/state/${state}/items/@item.id`,
          store: `${path}/items/@item.id`,
          path: "lastUpdate",
        },
        operator: "equals",
        value: 0,
      },
    ],
    props: {
      className: "bg-card",
    },
  }),
  byStatus: (path: string) => ({
    conditions: [
      {
        store: {
          store: `${path}/items/@item.id`,
          path: "status",
        },
        operator: "equals",
        value: "active",
      },
    ],
    props: {
      className: "bg-green-100",
    },
  }),
  byValue: (
    path: string,
    propName = "value",
    pathThreshold = "@store/state",
    propNameThreshold = "threshold",
  ) => ({
    conditions: [
      {
        store: {
          store: `${path}/items/@item.id`,
          path: propName,
        },
        operator: "greaterThan",
        value: {
          store: pathThreshold,
          path: propNameThreshold,
        },
      },
    ],
    props: {
      className: "text-secondary bg-destructive/70",
    },
  }),
};
