import { useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type UseProviderListControlsOptions = {
  initialPage?: number;
  debounceMs?: number;
};

export function useProviderListControls(
  options?: UseProviderListControlsOptions,
) {
  const initialPage = options?.initialPage ?? 1;
  const debounceMs = options?.debounceMs ?? 400;

  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(initialPage);
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebouncedValue(searchInput, debounceMs);

  const retry = () => setReloadKey((value) => value + 1);

  return {
    searchInput,
    setSearchInput,
    debouncedSearch,
    page,
    setPage,
    reloadKey,
    retry,
  };
}
