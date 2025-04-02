import {describe, test, expect, vi} from "vitest";
import {render} from "@testing-library/react";
import Pagination from "../Pagination.jsx";

vi.mock('react-router-dom', async () => ({
    'Link': ({to, children}) => (<a href={to}>{children}</a>)
}))

describe("Pagination Component", () => {
    function testPaginationRender({
                                      totalCount, currentPage, pageSize, maxPageButtonsCount,
                                      expectedItems, expectedEllipses, expectNoCurrentPage
                                  }) {
        const {container} = render(<Pagination totalCount={totalCount} currentPage={currentPage} pageSize={pageSize}
                                               maxPageButtonsCount={maxPageButtonsCount}/>)
        expect([...container.querySelectorAll('li>a')].map(el => el.innerHTML))
            .toEqual(expectedItems)
        if (expectNoCurrentPage) {
            expect(container.querySelector('li.current')?.innerHTML).toBeUndefined()
        } else {
            expect(container.querySelector('li.current>a')?.innerHTML).toEqual(`${currentPage}`)
        }
        if (expectedEllipses) {
            for (let expectedEll of expectedEllipses) {
                expect([...(container.querySelector(`li:nth-child(${expectedEll})`)?.classList || [])]).toEqual(['ellipsis'])
                expect(container.querySelector(`li:nth-child(${expectedEll})`)?.innerHTML).toEqual('<span class="ellipsis">...</span>')
            }
        } else {
            expect(container.querySelectorAll(`li.ellipsis`).length).toBe(0)
        }
    }

    describe("without ellipses", () => {
        test("current page = 1 / 5", () => {
            testPaginationRender({
                totalCount: 100,
                currentPage: 1,
                pageSize: 20,
                maxPageButtonsCount: 5,
                expectedItems: ['1', '2', '3', '4', '5']
            })

        })
        test("current page = 3 / 5", () => {
            testPaginationRender({
                totalCount: 100,
                currentPage: 3,
                pageSize: 20,
                maxPageButtonsCount: 5,
                expectedItems: ['1', '2', '3', '4', '5']
            })
        })
        test("current page = 5 / 5", () => {
            testPaginationRender({
                totalCount: 100,
                currentPage: 5,
                pageSize: 20,
                maxPageButtonsCount: 5,
                expectedItems: ['1', '2', '3', '4', '5']
            })
        })
        test("current page = 1 / 1", () => {
            testPaginationRender({
                totalCount: 100,
                currentPage: 1,
                pageSize: 101,
                maxPageButtonsCount: 5,
                expectedItems: ['1']
            })
        })
        test("current page = 3 / 2", () => {
            testPaginationRender({
                totalCount: 100,
                currentPage: 3,
                pageSize: 60,
                maxPageButtonsCount: 5,
                expectedItems: ['1', '2'],
                expectNoCurrentPage: true
            })
        })
    })
    describe("with ellipses", () => {
        test("before and after", () => {
            testPaginationRender({
                totalCount: 100,
                currentPage: 20,
                pageSize: 2,
                maxPageButtonsCount: 6,
                expectedItems: ["1","18", "19", "20", "21", "22", "50"],
                expectedEllipses: [2, 8]
            })
        })
        test("after", () => {
            testPaginationRender({
                totalCount: 100,
                currentPage: 3,
                pageSize: 10,
                maxPageButtonsCount: 6,
                expectedItems: ["1", "2", "3", "4", '5', "10"],
                expectedEllipses: [6]
            })
        })
        test("before", () => {
            testPaginationRender({
                totalCount: 100,
                currentPage: 7,
                pageSize: 10,
                maxPageButtonsCount: 6,
                expectedItems: ["1", "5", "6", "7", "8", "9", "10"],
                expectedEllipses: [2]
            })
        })
    })
})
