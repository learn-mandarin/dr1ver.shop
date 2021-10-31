import React, { useEffect, useState } from 'react'

const TableColumn = ({ originalColumn, inputProps: { productKeys, index } }) => {
  const [column, setColumn] = useState({})

  useEffect(() => {
    console.log(column)
  }, [column])

  useEffect(() => {
    setColumn(originalColumn)
  }, [originalColumn])

  function inputHandler(e) {}

  return (
    <React.Fragment>
      <td>
        <input key={column} value={column} name={productKeys[index]} onChange={inputHandler} />
      </td>
    </React.Fragment>
  )
}

export default TableColumn
