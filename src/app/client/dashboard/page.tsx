import { Suspense } from 'react';

import DashboardPage from './dashboard'; // Separate your main component logic

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DashboardPage />
    </Suspense>
  );
}
