import { memo } from 'react'

export const WidgetBtc = memo(({ btc }) => (
  <div className="widget_item_btc">
    <p className="widget_symbol">{btc.symbol}</p>
    <p className={btc.change > 0 ? 'widget_change_up' : 'widget_change_down'}>
      {btc.change}%
    </p>
  </div>
))
