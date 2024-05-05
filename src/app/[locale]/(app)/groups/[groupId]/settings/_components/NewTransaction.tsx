import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export const NewTransaction = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <ListTile>New transaction</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8"></div>
      </DrawerContent>
    </Drawer>
  );
};
