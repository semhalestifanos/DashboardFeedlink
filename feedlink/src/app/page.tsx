'use client'

import { usePathname } from 'next/navigation'
import Sidebar from "./shared-components/Sidebar";

export default function Home() {
  const pathname = usePathname();

  return (
    <div>
      <Sidebar activePath={pathname} /> 
    </div>
  );
}