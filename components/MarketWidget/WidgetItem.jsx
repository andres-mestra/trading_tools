'use client'
import { memo } from 'react'

export const WidgetItem = memo(({ symbol, change }) => (
  <li className="widget_item">
    <p className="widget_symbol">{symbol}</p>
    <p className={change > 0 ? 'widget_change_up' : 'widget_change_down'}>
      {change}%
    </p>
  </li>
))
