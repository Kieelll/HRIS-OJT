import EmptyState from './EmptyState'

const Table = ({ headers, data, renderRow, emptyMessage = 'No data available', emptyIcon = '📋', emptyAction }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-warm-beige p-12">
        <EmptyState
          icon={emptyIcon}
          title={emptyMessage}
          description="Try adjusting your filters or check back later."
          actionLabel={emptyAction?.label}
          onAction={emptyAction?.onClick}
        />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-warm-beige bg-white">
      <table className="min-w-full divide-y divide-warm-beige">
        <thead className="bg-mesh-primary">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-warm-beige">
          {data.map((row, index) => renderRow(row, index))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

