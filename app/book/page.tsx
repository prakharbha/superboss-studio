import { Suspense } from 'react';
import BookPageWrapper from './BookPageWrapper';

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookPageWrapper />
    </Suspense>
  );
}
