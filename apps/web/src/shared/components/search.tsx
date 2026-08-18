import { InputGroup, InputGroupAddon, InputGroupInput } from "@bola/ui/components/input-group";
import { SearchIcon } from "lucide-react";

interface SearchProps {
  placeholder?: string;
}

export function Search({ placeholder }: SearchProps) {
  return (
    <InputGroup className="max-w-md">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder={placeholder} />
    </InputGroup>
  );
}
