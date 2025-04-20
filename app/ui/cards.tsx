import { motion } from "framer-motion";
import { useState } from 'react'
import ColorHash from 'color-hash'
import { ArrowTopRightOnSquareIcon, BookmarkIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline'

import { addUserJobStatus, changeJobUserStatus } from '@/app/lib/jobUserStatusHandlers' 
import { updateUserCompanyApplied, removeUserCompanyApplied } from '@/app/lib/companiesUserAppliedHandlers' 

import type { PageType, CardData } from '@/app/types'


interface CardProps {
    data: CardData
    isActive: boolean
    onShow: () => void
    className: string
    pageType: PageType
    handleRemoval: (applicationId: string) => void
}

export function Card({ data, isActive, onShow, className, pageType, handleRemoval }: CardProps) {
    return (
    <motion.div onClick={onShow} className={`border-4 border-gray-300 px-5 md:px-8 ${className}`}>
      <div className="flex-col">
            <BaseCardComponent data={data} pageType={pageType} handleRemoval={handleRemoval} />
            {isActive && 
            <motion.div className="mb-6">
                {(data.categories != null || data.industries != null || data.skills != null) && 
                    <TopExpandableCardComponent data={data} />
                }
                {(data.requirements != null || data.responsibilities != null) &&
                    <BottomExpandableCardComponent data={data} /> 
                }
            </motion.div>
            }
      </div>
    </motion.div>
    );
}

interface BaseCardComponentProps {
    data: CardData
    pageType: PageType
    handleRemoval: (applicationId: string) => void
}

type HoverComponent = {
    text: string
    className: string
}


export function BaseCardComponent({ data, pageType, handleRemoval}: BaseCardComponentProps) {
    const [hoverComponent, setHoverComponent] = useState<HoverComponent | null>(null)

    const title = data.title
    const companyName = data.company_name
    const entryLevel = data.entry_level
    const junior = data.junior
    const midLevel = data.mid_level
    const locations = data.locations
    const location = cardLocation(locations)
    const remote = data.remote
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const updatedAt = data.updated_at 
        ? new Date(new Date(data.updated_at).getTime() - 5 * 60 * 60 * 1000).toLocaleString('en-US', { 
            timeZone: userTimeZone, 
            month: 'numeric', 
            day: 'numeric', 
            year: 'numeric',
        }) 
        : null

    const lastApplied = data.last_applied 
        ? new Date(new Date(data.last_applied).getTime() - 5 * 60 * 60 * 1000).toLocaleString('en-US', { 
            timeZone: userTimeZone, 
            month: 'numeric', 
            day: 'numeric', 
            year: 'numeric' 
        }) 
        : null


    const date = postedTimeAgo(data.updated_date)
    const functions = (data.functions != null) ? limitListOrSingleElementSize(data.functions, 3)
    ?.map((func, i) => 
        <div key={i} className="bg-neutral-200 rounded-lg p-1 pl-2 pr-2 mr-2">{func}</div>
    ) : null
    const salary = constructSalaryText(data.min_salary, data.max_salary) 
    const salaryHourly = (data.max_salary != null && data.max_salary < 200) ? true : false 

    return (
        <div className="">
            <div className="flex pb-2 text-base font-bold text-white">
                {entryLevel && <div className="w-8 h-8 bg-indigo-400 flex items-center justify-center">E</div>}
                {junior && <div className="w-8 h-8 bg-emerald-400 flex items-center justify-center">J</div>}
                {midLevel && <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center">M</div>}
                <div className="w-8 h-8 flex items-center justify-center">&nbsp;</div>
            </div>
            <div className="flex justify-between">
                <h2 className="text-[1.1rem] font-semibold">{title}</h2>
                {pageType !== 'completed' ? <h2 className="text-base font-medium text-gray-500">{date}</h2>
                : <h2 className="text-base font-medium text-gray-500">Applied on {updatedAt}</h2>
                }
            </div>
            <div className="flex items-baseline">
                <h2 className="text-base italic">{companyName}&nbsp;</h2>
                {(pageType !== 'completed' && lastApplied) && <h2 className="text-sm font-medium underline">(applied to company on {lastApplied})</h2>}
            </div>
            <div className="flex items-baseline">
                <h2 className="text-base">
                    {remote ? "Remote" : location}
                </h2>
                <h2 className="text-sm">
                    &nbsp;{(!remote && Array.isArray(locations)) && "and others"} 
                </h2>
            </div>
                    <div className="flex items-baseline font-medium">
                        <h2 className="text-base">
                            {(salary != null && !salaryHourly) && salary} 
                            {(salary != null && salaryHourly) && salary} 
                        </h2>
                        <h2 className="text-sm">
                            {(salary != null && salaryHourly) && " " + "\u00A0(hourly)"} 
                        </h2>
                        &nbsp;
                    </div>
            <div className="flex justify-between">
                <div className="flex text-base font-medium mt-1">
                    {functions}
                </div>
                <UserActionsComponent data={data} setHoverComponent={setHoverComponent} pageType={pageType} handleRemoval={handleRemoval} />
            </div>
            {hoverComponent ? 
            <div className="flex justify-end">
                <div className={`h-6 text-center font-bold ${hoverComponent?.className}`}>{hoverComponent?.text}</div>
            </div>
            : <div className="h-6"></div>
            }
        </div>
    )
}

interface BaseActionComponentProps {
    data: CardData
    handleRemoval: (applicationId: string) => void
    setHoverComponent: (hoverValues: HoverComponent | null) => void
}

interface UserActionComponentProps extends BaseActionComponentProps {
    pageType: PageType
}

export function UserActionsComponent({ pageType, data, handleRemoval, setHoverComponent}: UserActionComponentProps) {
    switch (pageType) {
        case 'search':
            return <SearchActionsComponent data={data} setHoverComponent={setHoverComponent} handleRemoval={handleRemoval} />
        case 'reviewed':
            return <ReviewedActionsComponent data={data} setHoverComponent={setHoverComponent} handleRemoval={handleRemoval} />
        case 'completed':
            return <CompletedActionsComponent data={data} setHoverComponent={setHoverComponent} handleRemoval={handleRemoval} />
    }
}

export function SearchActionsComponent({ data, handleRemoval, setHoverComponent }: BaseActionComponentProps) {
    const handleActionClick = (e: React.MouseEvent<HTMLElement>, action: string) => {
        e.stopPropagation()
        addUserJobStatus(data.id, action)
        if (action === 'completed') {
            updateUserCompanyApplied(data.company_id, data.id)
        }
        handleRemoval(data.id)
    }

    return (
        <div className="block md:flex items-baseline text-gray-500 my-auto">
            <div className="flex">
                <a href={data.url} 
                    onClick={(e) => e.stopPropagation()}
                    onMouseOver={() => setHoverComponent({text: "Link", className: "w-32 bg-gray-500 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    target="_blank" rel="noopener noreferrer" className="hover:text-black">
                    <ArrowTopRightOnSquareIcon className="size-6 ml-2" />
                </a>
                <div onClick={(e) => handleActionClick(e, 'reviewed')} 
                    onMouseOver={() => setHoverComponent({text: "Save", className: "w-32 bg-blue-500 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    className="hover:text-blue-500 cursor-pointer">
                    <BookmarkIcon className="size-6 ml-2" />
                </div>
            </div>
            <div className="flex justify-end">
                <div onClick={(e) => handleActionClick(e, 'completed')} 
                    onMouseOver={() => setHoverComponent({text: "Complete", className: "w-32 bg-green-600 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    className="hover:text-green-600 cursor-pointer">
                    <CheckIcon className="size-6 ml-1" />
                </div>
                <div onClick={(e) => handleActionClick(e, 'deleted')} 
                    onMouseOver={() => setHoverComponent({text: "Delete", className: "w-32 bg-red-500 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    className="hover:text-red-500 cursor-pointer">
                    <TrashIcon className="size-6 ml-2 md:ml-1" />
                </div>
            </div>
        </div>
    )
}

export function ReviewedActionsComponent({ data, handleRemoval, setHoverComponent }: BaseActionComponentProps) {
    const handleActionClick = (e: React.MouseEvent<HTMLElement>, action: string) => {
        e.stopPropagation()
        changeJobUserStatus(data.id, action)
        if (action === 'completed') {
            updateUserCompanyApplied(data.company_id, data.id)
        }
        handleRemoval(data.id)
    }

    return (
        <div className="block md:flex items-baseline text-gray-500 my-auto">
            <div className="flex">
                <a href={data.url} 
                    onClick={(e) => e.stopPropagation()}
                    onMouseOver={() => setHoverComponent({text: "Link", className: "w-24 bg-gray-500 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    target="_blank" rel="noopener noreferrer" className="hover:text-black">
                    <ArrowTopRightOnSquareIcon className="size-6 ml-2" />
                </a>
            </div>
            <div className="flex justify-end">
                <div onClick={(e) => handleActionClick(e, 'completed')} 
                    onMouseOver={() => setHoverComponent({text: "Complete", className: "w-24 bg-green-600 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    className="hover:text-green-600 cursor-pointer">
                    <CheckIcon className="size-6 ml-1" />
                </div>
                <div onClick={(e) => handleActionClick(e, 'deleted')} 
                    onMouseOver={() => setHoverComponent({text: "Delete", className: "w-24 bg-red-500 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    className="hover:text-red-500 cursor-pointer">
                    <TrashIcon className="size-6 ml-2 md:ml-1" />
                </div>
            </div>
        </div>
    )
}

export function CompletedActionsComponent({ data, handleRemoval, setHoverComponent }: BaseActionComponentProps) {
    const handleActionClick = (e: React.MouseEvent<HTMLElement>, action: string) => {
        e.stopPropagation()
        changeJobUserStatus(data.id, action)
        removeUserCompanyApplied(data.company_id)
        handleRemoval(data.id)
    }

    return (
        <div className="block md:flex items-baseline text-gray-500 my-auto">
            <div className="flex">
                <a href={data.url} 
                    onClick={(e) => e.stopPropagation()}
                    onMouseOver={() => setHoverComponent({text: "Link", className: "w-24 bg-gray-500 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    target="_blank" rel="noopener noreferrer" className="hover:text-black">
                    <ArrowTopRightOnSquareIcon className="size-6 ml-2" />
                </a>
                <div onClick={(e) => handleActionClick(e, 'reviewed')} 
                    onMouseOver={() => setHoverComponent({text: "Save", className: "w-24 bg-blue-500 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    className="hover:text-blue-500 cursor-pointer">
                    <BookmarkIcon className="size-6 ml-2" />
                </div>
            </div>
            <div className="flex justify-end">
                <div onClick={(e) => handleActionClick(e, 'deleted')} 
                    onMouseOver={() => setHoverComponent({text: "Delete", className: "w-24 bg-red-500 text-white"})}
                    onMouseLeave={() => setHoverComponent(null)}
                    className="hover:text-red-500 cursor-pointer">
                    <TrashIcon className="size-6 ml-2 md:ml-1" />
                </div>
            </div>
        </div>
    )
}

export function TopExpandableCardComponent({ data }: {data: CardData}) {
    const categories = limitListOrSingleElementSize(data.categories, 1)
    const industries = limitListOrSingleElementSize(data.industries, 3)
    const colorHash = new ColorHash()
    const skills = (data.skills != null) ? limitListOrSingleElementSize(data.skills, 4)
    ?.map((skill, i) => 
        <div key={i} style={{ backgroundColor: colorHash.hex(skill) }} className="p-1 pl-2 pr-2 mr-2">{skill}</div>
    ) : null

    return (
        <div>
            <hr className="border-gray-300 border-t-2"/>
            <div className="mt-2">
                {(categories != null) && (<div><span className="font-medium">Category: </span>{categories.join(", ")}</div>)}
                {(industries != null) && (<div><span className="font-medium">Industries: </span>{industries.join(", ")}</div>)}
                {skills != null && (<div className="flex text-white font-medium mt-1 pb-2">{skills}</div>)}
            </div>
        </div>
    )
}

export function BottomExpandableCardComponent({ data }: {data: CardData}) {
    const requirements = (data.requirements != null) ? limitListOrSingleElementSize(data.requirements, 4)
    ?.map((requirement, i) => 
        <li key={i} className="flex mb-2">
            <p className="mr-2">-</p>
            <span>{requirement}</span>
        </li>
    ) : null
  const responsibilities = (data.responsibilities != null) ? limitListOrSingleElementSize(data.responsibilities, 4)
    ?.map((responsibility, i) => 
        <li key={i} className="flex mb-2">
            <p className="mr-2">-</p>
            <span>{responsibility}</span>
        </li>
    ) : null

    return (
        <div className="mt-2">
            <hr className="border-gray-300 border-t-2 mb-2"/>
            <div className="flex">
               {(requirements != null) && 
                <div className="basis-1/2">
                   <h2 className="text-base font-medium mb-2">Requirements</h2>
                   <ul>{requirements}</ul>
                </div>
                }
                {(responsibilities != null) && 
                <div className="basis-1/2">
                   <h2 className="text-base font-medium mb-2">Responsibilities</h2>
                    <ul>{responsibilities}</ul>
                </div>
                }
            </div>
        </div>
    )
}

function cardLocation(locations: string | string[] | null) {
    if (Array.isArray(locations)) {
        if (locations.includes("New York, NY, USA")) {
            return "NYC"
        } else if (locations.includes("San Francisco, CA, USA")) {
            return "SF"
        }
        return locations[0]
    } else if (locations == "New York, NY, USA") {
       return "NYC"
    } else if (locations == "San Francisco, CA, USA") {
        return "SF"
    }
    return locations
}

function postedTimeAgo(utcSeconds: number) {
    const postTime = new Date(utcSeconds * 1000)
    const now = Date.now()

    const timeDifference = now - postTime.getTime()
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

    if (daysDifference === 0) {
        return "Posted today";
    } else if (daysDifference === 1) {
        return "Posted yesterday";
    } else if (daysDifference < 7) {
        return `Posted ${daysDifference} days ago`;
    } else if (daysDifference < 30) {
        const weeks = Math.floor(daysDifference / 7);
        return `Posted ${weeks} weeks ago`;
    } else {
        return "Posted over a month ago";
    }
}

function constructSalaryText(minSalary: number | null, maxSalary: number | null) {
    if (minSalary == null && maxSalary == null) {
        return null
    } else if (minSalary == null && maxSalary != null) {
        return '$' + kConverter(maxSalary).toLocaleString()
    } else if (maxSalary == null && minSalary != null) {
        return '$' + kConverter(minSalary).toLocaleString()
    } else {
        return '$' + kConverter(minSalary!).toLocaleString() + ' - $' + kConverter(maxSalary!).toLocaleString()
    }
}

function kConverter(num: number) {
    if (num < 1000) {
        return num.toFixed(0)
    } else {
        const s = (0.1 * Math.floor(num / 100)).toFixed(0)
        return s.replace('.0', '') + 'k'
    }
}

function limitListOrSingleElementSize(element: null | string[] | string, limit: number) {
    if (element == null) {
        return null
    }
    if (Array.isArray(element)) {
        return element.slice(0, Math.min(limit, element.length)) 
    } else {
        return [element]
    }
}


