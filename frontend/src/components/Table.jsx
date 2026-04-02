import clsx from 'clsx'

export const Table = ({ children, className }) => (
  <div className="overflow-x-auto">
    <table className={clsx('w-full text-sm text-left text-gray-700', className)}>
      {children}
    </table>
  </div>
)

export const TableHead = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-200">
    {children}
  </thead>
)

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-200">
    {children}
  </tbody>
)

export const TableRow = ({ children, className }) => (
  <tr className={clsx('hover:bg-gray-50 transition-colors', className)}>
    {children}
  </tr>
)

export const TableCell = ({ children, className, header = false }) => {
  const baseClass = 'px-6 py-4'
  const headerClass = 'font-semibold text-gray-900 bg-gray-50'

  return (
    <td className={clsx(baseClass, header && headerClass, className)}>
      {children}
    </td>
  )
}

export const TableHeader = ({ children, className }) => (
  <th className={clsx('px-6 py-4 font-semibold text-gray-900 bg-gray-50', className)}>
    {children}
  </th>
)
