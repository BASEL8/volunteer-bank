import React from 'react'
import { Skeleton } from 'antd'
export const PageSkeleton: React.FC<{}> = () => {
  const skeletonParagraph = (<Skeleton active paragraph={{ rows: 4 }} className="page-skeleton__paragraph" />)
  return (
    <>
      {skeletonParagraph}
      {skeletonParagraph}
      {skeletonParagraph}
    </>
  )
}