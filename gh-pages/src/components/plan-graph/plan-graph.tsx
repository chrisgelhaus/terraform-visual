import type { TreeGraph } from '@antv/g6'
const G6: typeof import('@antv/g6') = process.browser ? require('@antv/g6') : null

import { PlanGraph } from '@app/components'
import styles from '@app/components/plan-graph/plan-graph.module.css'
import { Entities } from '@app/data'
import React, { useEffect } from 'react'

interface Props {
  plan?: Entities.TerraformPlan

  setFocusedResource: Function
}

export const C = (props: Props) => {
  const { plan, setFocusedResource } = props

  const ref = React.useRef<HTMLDivElement>(null)
  let graph: TreeGraph

  useEffect(() => {
    if (!plan || !ref.current) {
      return
    }

    if (graph) {
      graph.destroy()
    }

    const graphData = PlanGraph.Entities.Utils.GraphData.fromTerraformPlanResourceChange(
      plan.resource_changes,
    )

    graph = new G6.TreeGraph({
      // @ts-ignore
      container: ref.current,
      width: ref?.current?.clientWidth || 0,
      height: ref?.current?.clientHeight || 550,
      linkCenter: true,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange(item, collapsed) {
              if (!item) {
                return
              }

              item.get('model').data.collapsed = collapsed
              return true
            },
          },
          'drag-canvas',
          {
            type: 'zoom-canvas',
            // @ts-ignore
            sensitivity: 1,
          },
        ],
      },
      layout: {
        type: 'compactBox',
        direction: 'TB',
        getId: (graphData: PlanGraph.Entities.GraphData) => graphData.id,
        getWidth: () => 0,
        getHGap: (graphData: PlanGraph.Entities.GraphData) => graphData.hGap,
      },
      defaultNode: {
        type: 'rect',

        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],

        style: {},
      },
      defaultEdge: {
        type: 'cubic-vertical',
        color: ' #e6e6e6',
        size: 3,
      },
    })

    graph.on('node:mouseenter', (event: any) => {
      if (!event.item._cfg.model.resource) {
        return
      }

      setFocusedResource(event.item._cfg.model.resource)
    })

    graph.data(graphData)
    graph.render()
    graph.fitView()

    return () => {
      if (!graph) {
        return
      }

      graph.destroy()
    }
  }, [plan])

  if (!plan) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>loading graph...</p>
      </div>
    )
  }

  return <div className={styles.container} ref={ref} />
}
