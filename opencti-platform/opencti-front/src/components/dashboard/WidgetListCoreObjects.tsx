import React, { forwardRef, MutableRefObject } from 'react';
import DataTableWithoutFragment from '../dataGrid/DataTableWithoutFragment';
import { DataTableVariant } from '../dataGrid/dataTableTypes';

interface WidgetListCoreObjectsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  dateAttribute: string
  publicWidget?: boolean
}

const WidgetListCoreObjects = forwardRef(({
  data,
  dateAttribute,
  publicWidget = false,
}: WidgetListCoreObjectsProps, ref: MutableRefObject<HTMLDivElement>) => (
  <DataTableWithoutFragment
    dataColumns={{
      entity_type: { flexSize: 10 },
      value: { flexSize: 30 },
      date: {
        id: 'date',
        isSortable: false,
        flexSize: 15,
        label: 'Date',
        render: (({ [dateAttribute]: date }, { fsd }) => fsd(date)),
      },
      objectLabel: { flexSize: 15 },
      x_opencti_workflow_id: { flexSize: 15 },
      objectMarking: { flexSize: 15 },
    }}
    storageKey={'mabite'}
    data={data.map(({ node }) => node)}
    globalCount={data.length}
    variant={DataTableVariant.widget}
    disableNavigation={publicWidget}
    rootRef={ref.current}
  />
));

WidgetListCoreObjects.displayName = 'WidgetListCoreObjects';

export default WidgetListCoreObjects;
