"use client"

import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Card } from '@/app/ui/cards'
import SquareLoader from "react-spinners/SquareLoader"
import { motion } from 'framer-motion'
import queryParamsPageType from '@/app/lib/appDisplayHelpers'

const override = {
  display: "block",
  margin: "1rem auto",
  borderColor: "gray",
}

export default function ApplicationsDisplay({ pageType, filters }) {
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState(0)
  const isPrefetch = false
  const [queryKey, queryFn] = queryParamsPageType(pageType, isPrefetch, filters)
  const [removingId, setRemovingId] = useState(null)


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

  function handleRemoval(applicationId) {
    setRemovingId(applicationId)
    
    setTimeout(() => {
      queryClient.setQueryData(queryKey, (data) => ({
        pages: data.pages.map((page) => ({
          nextCursor: page.nextCursor,
          data: page.data.filter((app) => app.id !== applicationId)
        })),
        pageParams: data.pageParams,
      }))
    }, 300)
  }

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
    <div>
    <input type="text" id="small-input" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
</div>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          <div className='flex flex-col'>
            {group.data.map((application) => {
              return (
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
                      if (activeId === application.id) {
                        return setActiveId(0)
                      }
                      return setActiveId(application.id)
                    }}
                    handleRemoval={handleRemoval}
                    pageType={pageType}
                    className="mb-2"
                  />
                </motion.div>
              )
            })}
          </div>
        </React.Fragment>
      ))}
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
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
  )
}

