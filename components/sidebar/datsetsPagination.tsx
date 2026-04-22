import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPage, fetchWorkItem } from '@/store/features/datasets/datasets'
import type { RootState } from '@/store/store'
import { useEffect, useState, useRef } from "react"
import { Input } from "@base-ui/react"
import { setActiveLabel, setActiveVolume } from "@/store/features/annotator/annotator"

export default function DatasetsPagination() {
    const worklistSize = useSelector((state: RootState) => state.datasets.worklist_size)
    const currentPage = useSelector((state: RootState) => state.datasets.currentPage)
    const token = useSelector((state: RootState) => state.datasets.token)
    const dataset_name = useSelector((state: RootState) => state.datasets.selectedDataset)
    const workItem = useSelector((state: RootState) => state.datasets.workItem)

    const [pages, setPages] = useState<number[]>([1, 2, 3])
    const [showTooltip, setShowTooltip] = useState(false)
    const [wasClicked, setWasClicked] = useState(false)
    const tooltipRef = useRef<HTMLDivElement>(null); // Used to identify our component

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // 1. Did they click outside our main wrapper?
            const clickedOutsideWrapper = tooltipRef.current && !tooltipRef.current.contains(target);

            // 2. Did they click outside the floating tooltip content?
            const tooltipContentNode = document.getElementById("pagination-tooltip-content");
            const clickedOutsideContent = tooltipContentNode ? !tooltipContentNode.contains(target) : true;

            // If they clicked outside BOTH, then close it.
            if (clickedOutsideWrapper && clickedOutsideContent) {
                setShowTooltip(false);
                setWasClicked(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dispatch = useDispatch()

    const handlePageChange = (page: number) => {
        // set case and label to empty
        dispatch(setActiveLabel(""))
        dispatch(setActiveVolume(""))
        dispatch(setCurrentPage(page))
    }


    useEffect(() => {
        if (currentPage <= 3) {
            console.log({ worklistSize })
            setPages(Array.from({ length: Math.min(worklistSize, 3) }, (_, i) => i + 1))
        } else {
            setPages([currentPage - 2, currentPage - 1, currentPage])
        }
        // @ts-ignore
        if (token && dataset_name) dispatch(fetchWorkItem({ token, dataset_name, idx: currentPage - 1 }))
    }, [currentPage, worklistSize])

    const handleTooltipClick = () => {
        setShowTooltip(!showTooltip)
        setWasClicked(true)
    }

    return (
        <Pagination>

            <PaginationContent>

                {currentPage > 1 && worklistSize > 3 && <PaginationItem >
                    <PaginationPrevious className="select-none" onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>}

                {currentPage == worklistSize && worklistSize > 3 &&
                    <div ref={tooltipRef}
                        // onMouseEnter={() => setShowTooltip(true)}
                        // onMouseLeave={() => wasClicked ? setShowTooltip(true) : setShowTooltip(false)}
                        onClick={() => handleTooltipClick()}
                    >
                        <Tooltip open={showTooltip} >
                            <TooltipTrigger >
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            </TooltipTrigger>

                            <TooltipContent className="" onClick={(e) => e.stopPropagation()}>
                                <Input placeholder="Page"
                                    id="pagination-tooltip-content"
                                    type="number"
                                    min={1}
                                    max={worklistSize}

                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            let page = Number(e.currentTarget.value)
                                            page = isNaN(page) ? 1 : page
                                            page = page > worklistSize ? worklistSize : page
                                            page = page == 0 ? 1 : page
                                            page = page < 0 ? worklistSize + page + 1 : page
                                            page = page < 0 ? 1 : page

                                            handlePageChange(page)
                                            setShowTooltip(false)
                                            setWasClicked(false)
                                        }
                                    }}
                                    className="w-20" />
                            </TooltipContent>
                        </Tooltip>
                    </div>
                }

                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink className="select-none" isActive={page === currentPage} onClick={() => handlePageChange(page)}>{page}</PaginationLink>
                    </PaginationItem>
                ))}


                {currentPage < worklistSize && worklistSize > 3 && <PaginationItem>
                    <div ref={tooltipRef}
                        // onMouseEnter={() => setShowTooltip(true)}
                        // onMouseLeave={() => wasClicked ? setShowTooltip(true) : setShowTooltip(false)}
                        onClick={() => handleTooltipClick()}
                    >
                        <Tooltip open={showTooltip} >
                            <TooltipTrigger >
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            </TooltipTrigger>

                            <TooltipContent className="" onClick={(e) => e.stopPropagation()}>
                                <Input placeholder="Page"
                                    id="pagination-tooltip-content"
                                    type="number"
                                    min={1}
                                    max={worklistSize}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            let page = Number(e.currentTarget.value)
                                            page = isNaN(page) ? 1 : page
                                            page = page > worklistSize ? worklistSize : page
                                            page = page == 0 ? 1 : page
                                            page = page < 0 ? worklistSize + page + 1 : page
                                            page = page < 0 ? 1 : page

                                            handlePageChange(page)
                                            setShowTooltip(false)
                                            setWasClicked(false)
                                        }
                                    }}
                                    className="w-20" />
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </PaginationItem>}

                {worklistSize > 3 && <PaginationItem>
                    {currentPage < worklistSize &&
                        <PaginationNext className="select-none" onClick={() => handlePageChange(currentPage + 1)} />
                    }
                </PaginationItem>}

            </PaginationContent>
        </Pagination>
    )
}
