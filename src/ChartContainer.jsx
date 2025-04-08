function ChartContainer({children}) {

  function handleClick(e) {
    if (e.target?.classList.contains('chart-container-overlay')) {
      e.preventDefault()
      e.target?.parentElement?.classList.add('focused')
    }
    if (e.target?.classList.contains('chart-container')) {
      e.preventDefault()
      e.target?.classList.remove('focused')
    }
  }
  return (<div className="chart-container" onClick={handleClick}>
    {children}
    <div className="chart-container-overlay"></div>
  </div>)
}
export default ChartContainer
