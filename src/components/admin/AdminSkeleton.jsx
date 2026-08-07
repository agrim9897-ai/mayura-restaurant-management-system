import React from 'react';

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 w-full animate-fadeIn">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 w-full skeleton-box rounded-xl" />
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-fadeIn">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-28 w-full skeleton-box rounded-2xl" />
      ))}
    </div>
  );
}

export function InboxSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full h-[600px] animate-fadeIn">
      <div className="lg:col-span-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 w-full skeleton-box rounded-xl" />
        ))}
      </div>
      <div className="lg:col-span-8 h-full skeleton-box rounded-2xl" />
    </div>
  );
}

export default function AdminSkeleton({ type = 'table', count = 5 }) {
  if (type === 'cards') return <CardGridSkeleton count={count} />;
  if (type === 'inbox') return <InboxSkeleton />;
  return <TableSkeleton rows={count} />;
}
