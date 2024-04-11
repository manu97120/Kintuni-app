'use client'

import {Input, Autocomplete, AutocompleteItem} from "@nextui-org/react";
import {SearchIcon} from "./searchIcon";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  console.log(`>>> Search Client log`);
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
  console.log(`>>> DebouncedCallback Client log`);
    console.log(`Searching location for terms :::: ${term}`);
  
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('address', term);
    } else {
      params.delete('address');
    }
    // updates the URL with the user's search data without reloading
    replace(`${pathname}?${params.toString()}`);
    
  }, 400);

  return (
    <div className="w-[340px] h-[240px] px-8 rounded-2xl flex justify-center items-center bg-gradient-to-tr from-indigo-500 to-black-500 text-white shadow-lg">
      <Input
        label="Search location"
        isClearable
        radius="lg"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focused=true]:bg-default-200/50",
            "dark:group-data-[focused=true]:bg-default/60",
            "!cursor-text",
          ],
        }}

        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
          
        }}
        defaultValue={searchParams.get('query')?.toString()}
        id="search"
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
      />
    </div>
  );
}
