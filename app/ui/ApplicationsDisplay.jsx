"use client"

import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Card } from '@/app/ui/cards'
import SquareLoader from "react-spinners/SquareLoader"
import { motion } from 'framer-motion'
import queryParamsPageType from '@/app/lib/appDisplayHelpers'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import FilterUI from '@/app/ui/FilterBar'
import { CardsSkeleton } from '@/app/ui/skeletons'

const override = {
  display: "block",
  margin: "1rem auto",
  borderColor: "gray",
}

export default function ApplicationsDisplay({ pageType, serverFilters, count}) {
    const [filters, setFilters] = useState(serverFilters)
    const [activeId, setActiveId] = useState(0)
    const [removingId, setRemovingId] = useState(null)
    const router = useRouter()
    const queryClient = useQueryClient()

    const isInitialMount = useRef(true);

    const [debouncedSearch] = useDebounce(filters.search, 500)

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)

        const query = new URLSearchParams(window.location.search);

        query.delete('location');
        query.delete('experience');

        if (newFilters.location.length > 0) {
            const locationString = newFilters.location.filter(Boolean).join(',');
            query.set('location', locationString);
        }

        if (newFilters.experience.length > 0) {
            const experienceString = newFilters.experience.filter(Boolean).join(',');
            query.set('experience', experienceString);
        }

        if (newFilters.location.length !== 0 || newFilters.experience.length !== 0) {
            window.history.replaceState({}, '', `?${query.toString()}`);
        }
    }

    const handleRemoval = (applicationId) => {
        setRemovingId(applicationId)

        setTimeout(() => {
            queryClient.setQueryData(queryKey, (data) => ({
                pages: data.pages.map((page) => ({
                    nextCursor: page.nextCursor,
                    data: page.data.filter((app) => app.id !== applicationId)
                })),
                pageParams: data.pageParams,
            }))
            setRemovingId(null)
        }, 300)
    }

    useEffect(() => {
        if (isInitialMount.current) {
          isInitialMount.current = false;
          return;
        }

        const query = new URLSearchParams();

        if (debouncedSearch) {
          query.set('search', debouncedSearch);
        }

        if (filters.location.length > 0) {
            const locationString = filters.location.filter(Boolean).join(',');
            query.set('location', locationString);
        }

        if (filters.experience.length > 0) {
            const experienceString = filters.experience.filter(Boolean).join(',');
            query.set('experience', experienceString);
        }

        const currentSearch = new URLSearchParams(window.location.search);
        if (query.toString() !== currentSearch.toString()) {
          router.replace(`?${query.toString()}`, undefined, { shallow: true });
        }
    }, [debouncedSearch, filters.location, filters.experience, router]);


    const isPrefetch = false
    const [queryKey, queryFn] = queryParamsPageType(pageType, isPrefetch, {
        search: debouncedSearch,
        location: filters.location,
        experience: filters.experience
    })

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView) {
          fetchNextPage()
        }
      }, [inView])

    return (
  <>
    <FilterUI 
      initialCount={count}
      initialFilters={filters} 
      onFilterChange={handleFilterChange} 
      pageType={pageType}
    />

    {status === 'pending' && <CardsSkeleton search={pageType==='search'}/>}

    {status === 'error' && <p>Error: {error.message}</p>}

    {status !== 'pending' && status !== 'error' && data.pages.map((group, i) => (
      <React.Fragment key={i}>
        <div className='flex flex-col'>
          {group.data.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: removingId === application.id ? 0 : 1,
                scale: removingId === application.id ? 0.8 : 1,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                data={application} 
                isActive={activeId === application.id}
                onShow={() => {
                  setActiveId(activeId === application.id ? 0 : application.id);
                }}
                handleRemoval={handleRemoval}
                pageType={pageType}
                className="mb-2"
              />
            </motion.div>
          ))}
        </div>
      </React.Fragment>
    ))}

    <div ref={ref} className="" disabled={!hasNextPage || isFetchingNextPage}>
      {isFetchingNextPage ? (
        <SquareLoader
          color={"#e0e0e0"}
          loading={true}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : hasNextPage ? (
        'Load More'
      ) : (
        <div className='mb-4'></div>
      )}
    </div>
  </>
);
}
