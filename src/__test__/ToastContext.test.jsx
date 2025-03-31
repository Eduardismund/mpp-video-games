import {describe, test, expect, beforeEach, afterEach, vi} from "vitest";
import {act, render} from "@testing-library/react";
import {ToastProvider, useToast} from "../ToastContext.jsx";

function TestComponent() {
  const {showToast, showConfirmation} = useToast()

  function onConfirm(button) {
    button.dataset.did = 'confirm';
  }

  function onCancel(button) {
    button.dataset.did = 'cancel';
  }

  function doShowConfirm(e) {
    const button = e.target
    showConfirmation({
      message: "Confirm?",
      onConfirm: () => onConfirm(button),
      onCancel: () => onCancel(button),
      confirmLabel: "Yes, Confirm"
    })
  }

  return (<>
    <button className="t" data-level="info" onClick={(e) => showToast("Toast!", e.target['dataset'].level)}>T</button>
    <button className="c" onClick={doShowConfirm}>C</button>
  </>)
}

describe("ToastContext.Provider", () => {

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders without crashing", async () => {
    const {container} = render(<ToastProvider>
      <div className="content"></div>
    </ToastProvider>)
    expect(container.innerHTML).toEqual('<div class="content"></div><div class="toasts-container"><div class="confirmation-overlay" style="display: none;"></div></div>')
  })
  test("can show a toast", async () => {
    const {container} = render(<ToastProvider><TestComponent/></ToastProvider>)

    await act(() => container.querySelector('button.t').click())
    expect(container.querySelector('.confirmation-overlay').outerHTML)
      .toEqual('<div class="confirmation-overlay" style=""><div class="confirmation-box toast info">Toast!</div></div>')
  })
  test("can show two toasts", async () => {
    const {container} = render(<ToastProvider><TestComponent/></ToastProvider>)

    await act(() => {
      let tBtn = container.querySelector('button.t');
      vi.setSystemTime(('2025-03-31T01:01:01.01Z'));
      tBtn.click()
      tBtn['dataset'].level = 'error'
      vi.setSystemTime(('2025-03-31T01:01:01.02Z'));
      tBtn.click()

    })
    expect(container.querySelector('.confirmation-overlay').outerHTML)
      .toEqual('<div class="confirmation-overlay" style=""><div class="confirmation-box toast info">Toast!</div><div class="confirmation-box toast error">Toast!</div></div>')
  })
  test("closes toast after 3 seconds", async () => {
    const {container} = render(<ToastProvider><TestComponent/></ToastProvider>)
    await act(() => container.querySelector('button.t').click())
    expect(container.querySelector('.confirmation-overlay').outerHTML)
      .toEqual('<div class="confirmation-overlay" style=""><div class="confirmation-box toast info">Toast!</div></div>')
    await act(() => vi.advanceTimersByTime(2999))
    expect(container.querySelector('.confirmation-overlay').outerHTML)
      .toEqual('<div class="confirmation-overlay" style=""><div class="confirmation-box toast info">Toast!</div></div>')
    await act(() => vi.advanceTimersByTime(3000))
    expect(container.querySelector('.confirmation-overlay').outerHTML)
      .toEqual('<div class="confirmation-overlay" style="display: none;"></div>')
  })
  test('can show confirmation', async () => {
    const {container} = render(<ToastProvider><TestComponent/></ToastProvider>)
    await act(() => container.querySelector('button.c').click())
    expect(container.querySelector('.confirmation-overlay').outerHTML)
      .toEqual('<div class="confirmation-overlay" style=""><div class="confirmation-box"><p>Confirm?</p><div class="button-group"><button class="confirm-button">Yes, Confirm</button><button class="cancel-button">Cancel</button></div></div></div>')
  })
  test('confirmation closes on confirm button', async () => {
    const {container} = render(<ToastProvider><TestComponent/></ToastProvider>)
    await act(() => container.querySelector('button.c').click())
    await act(() => container.querySelector('.confirm-button').click())
    expect(container.querySelector('button.c').dataset.did).toBe('confirm')
  })
  test('confirmation closes on cancel button', async () => {
    const {container} = render(<ToastProvider><TestComponent/></ToastProvider>)
    await act(() => container.querySelector('button.c').click())
    await act(() => container.querySelector('.cancel-button').click())
    expect(container.querySelector('button.c').dataset.did).toBe('cancel')
  })
})
