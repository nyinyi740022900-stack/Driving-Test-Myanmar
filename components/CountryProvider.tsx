'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Country } from '@/lib/types';

interface CountryCtx {
  country: Country;
  setCountryRaw: (c: Country) => void;
}

const Ctx = createContext<CountryCtx>({ country: 'sg', setCountryRaw: () => {} });

const STORAGE_KEY = 'rr_country';

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<Country>('sg');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'sg' || stored === 'jp') setCountryState(stored);
  }, []);

  function setCountryRaw(c: Country) {
    localStorage.setItem(STORAGE_KEY, c);
    setCountryState(c);
  }

  return (
    <Ctx.Provider value={{ country, setCountryRaw }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCountry() {
  const { country, setCountryRaw } = useContext(Ctx);
  return { country, setCountry: setCountryRaw };
}
