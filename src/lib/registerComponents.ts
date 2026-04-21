import { Button } from "../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Repeater } from "./components/Repeater";
import { Repeater2 } from "./components/Repeater2";
import { ControlledInput } from "./components/ControlledInput";
import { componentRegistry } from "./registry";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { SelectWrapper } from "./components/SelectWrapper";
import {
  StoreCollection,
  CollectionRepeater,
} from "./components/StoreCollection";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";

// Register all common components
export function registerCommonComponents() {
  // UI Components
  componentRegistry.register("Button", Button);
  componentRegistry.register("Card", Card);
  componentRegistry.register("CardHeader", CardHeader);
  componentRegistry.register("CardTitle", CardTitle);
  componentRegistry.register("CardDescription", CardDescription);
  componentRegistry.register("CardContent", CardContent);
  componentRegistry.register("CardAction", CardAction);
  componentRegistry.register("Popover", Popover);
  componentRegistry.register("PopoverTrigger", PopoverTrigger);
  componentRegistry.register("PopoverContent", PopoverContent);
  componentRegistry.register("Input", Input);
  componentRegistry.register("ControlledInput", ControlledInput);
  componentRegistry.register("Checkbox", Checkbox);
  componentRegistry.register("Badge", Badge);
  componentRegistry.register("Select", SelectWrapper);
  componentRegistry.register("ButtonGroup", ButtonGroup);
  componentRegistry.register("ButtonGroup.Separator", ButtonGroupSeparator);
  componentRegistry.register("ButtonGroup.Text", ButtonGroupText);

  // Chart Components
  componentRegistry.register("ChartContainer", ChartContainer);
  componentRegistry.register("ChartTooltip", ChartTooltip);
  componentRegistry.register("ChartTooltipContent", ChartTooltipContent);
  componentRegistry.register("PieChart", PieChart);
  componentRegistry.register("Pie", Pie);
  componentRegistry.register("Cell", Cell);
  componentRegistry.register("BarChart", BarChart);
  componentRegistry.register("Bar", Bar);
  componentRegistry.register("XAxis", XAxis);
  componentRegistry.register("YAxis", YAxis);
  componentRegistry.register("CartesianGrid", CartesianGrid);
  componentRegistry.register("LineChart", LineChart);
  componentRegistry.register("Line", Line);

  // Library Components
  componentRegistry.register("Repeater", Repeater);
  componentRegistry.register("Repeater2", Repeater2, {
    requiredPlugins: ["repeater"],
  });
  componentRegistry.register("StoreCollection", StoreCollection);
  componentRegistry.register("CollectionRepeater", CollectionRepeater);

  // HTML Elements
  componentRegistry.register("div", "div");
  componentRegistry.register("h1", "h1");
  componentRegistry.register("h2", "h2");
  componentRegistry.register("h3", "h3");
  componentRegistry.register("p", "p");
  componentRegistry.register("span", "span");
  componentRegistry.register("label", "label");
  componentRegistry.register("pre", "pre");
}
