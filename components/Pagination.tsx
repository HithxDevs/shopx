'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from './ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  
  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 gap-2">
      {currentPage > 1 && (
        <Link href={createPageURL(currentPage - 1)}>
          <Button variant="outline">Previous</Button>
        </Link>
      )}
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link key={page} href={createPageURL(page)}>
          <Button 
            variant={page === currentPage ? 'default' : 'outline'}
          >
            {page}
          </Button>
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link href={createPageURL(currentPage + 1)}>
          <Button variant="outline">Next</Button>
        </Link>
      )}
    </div>
  );
}