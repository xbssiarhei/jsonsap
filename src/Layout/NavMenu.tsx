import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

type MenuItem = {
  id: string;
  label: string;
  list?: MenuListItem[];
};

type MenuListItem = { title: string; href: string; description: string };

const components: MenuListItem[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

const itemsDefault: MenuItem[] = [
  {
    id: "common",
    label: "Getting started",
    list: [
      {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
          "A modal dialog that interrupts the user with important content and expects a response.",
      },
    ],
  },
  { id: "components", label: "Components", list: components },
  {
    id: "apps",
    label: "Apps",
    list: [
      {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
          "A modal dialog that interrupts the user with important content and expects a response.",
      },
      {
        title: "Alert Dialog2",
        href: "/docs/primitives/alert-dialog",
        description:
          "A modal dialog that interrupts the user with important content and expects a response.",
      },
    ],
  },
  { id: "docs", label: "Docs" },
];

type NavigationMenuProps = React.ComponentProps<typeof NavigationMenu>;

interface NavigationMenuDemoProps extends NavigationMenuProps {
  items?: MenuItem[];
  menuListProps?: React.ComponentProps<typeof NavigationMenuList>;
}

export function NavigationMenuDemo({
  items = itemsDefault,
  className,
  menuListProps,
}: NavigationMenuDemoProps) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList {...menuListProps}>
        {items.map((item) => {
          return (
            <NavigationMenuItem key={item.id}>
              {item.list ? (
                <>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent className="test">
                    <ul
                      className={cn({
                        "w-96": item.list.length < 2,
                        "grid gap-2 w-[400px] md:w-[500px] lg:w-[600px] md:grid-cols-2":
                          item.list.length > 1,
                      })}
                    >
                      {item.list.map((listItem) => (
                        <ListItem
                          key={listItem.title}
                          title={listItem.title}
                          href={listItem.href}
                        >
                          {listItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/docs">{item.label}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}

        {/*
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem href="/docs" title="Introduction">
                Re-usable components built with Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/docs">Docs</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        */}
        {/*  */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
