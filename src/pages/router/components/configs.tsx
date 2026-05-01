/** @jsxRuntime classic */
/** @jsx jsxConfig */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsxConfig } from "@/lib/tools/jsxConfig";
import type { ComponentConfig } from "@/lib";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const cardConfig: ComponentConfig = (
  <Item variant="default" className="items-start">
    <ItemMedia variant="icon">
      <Avatar className="rounded-md after:border-0">
        <AvatarFallback className="rounded-lg">A</AvatarFallback>
      </Avatar>
    </ItemMedia>
    <ItemContent>
      <ItemTitle>@name</ItemTitle>
      <ItemDescription>@description</ItemDescription>
      <div>dasda</div>
    </ItemContent>
    <ItemActions>
      <Button variant="outline" size="sm">
        Action
      </Button>
    </ItemActions>
  </Item>
);

export const avatarConfig: ComponentConfig = (
  <Avatar className="rounded-md">
    <AvatarFallback className="rounded-lg bg-indigo-500 text-white">
      A
    </AvatarFallback>
  </Avatar>
);

export const tabsConfig: ComponentConfig = (
  <Tabs
    className="w-full"
    value="@store.state.tab"
    onValueChange={(v) => {
      console.log(v);
    }}
  >
    <TabsList className="w-full">
      <TabsTrigger value="units">Units</TabsTrigger>
      <TabsTrigger value="groups">Groups</TabsTrigger>
    </TabsList>
  </Tabs>
);

console.log(tabsConfig);
