import clsx from 'clsx'

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className }) => (
  <div className={clsx('mb-4 pb-4 border-b border-gray-200', className)}>
    {children}
  </div>
)

export const CardBody = ({ children, className }) => (
  <div className={className}>{children}</div>
)

export const CardFooter = ({ children, className }) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-200', className)}>
    {children}
  </div>
)
